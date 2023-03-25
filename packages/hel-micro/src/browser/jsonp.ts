import { getGlobalThis } from 'hel-micro-core';

// @see https://www.runoob.com/jsref/prop-node-nodetype.html
const DOCUMENT_FRAGMENT_NODE = 11;

const JSONP = {
  now() {
    return new Date().getTime();
  },
  rand() {
    return Math.random().toString().substring(6);
  },
  // 删除节点元素
  removeElem(elem: HTMLElement) {
    const parent = elem.parentNode;
    if (parent && parent.nodeType !== DOCUMENT_FRAGMENT_NODE) {
      parent.removeChild(elem);
    }
  },
  // url 组装 data
  parseData(data?: string | Record<string, any>) {
    let ret = '';
    if (typeof data === 'string') {
      ret = data;
    } else if (typeof data === 'object') {
      for (const key in data) {
        ret += `${ret}&${key}=${encodeURIComponent(data[key])}`;
      }
    }
    // 加时间戳防止缓存
    ret += `&_t=${JSONP.now()}`;
    ret = ret.substring(1);
    return ret;
  },
  getJSON(inputUrl: string, data?: string | Record<string, any>) {
    return new Promise<any>((resolve, reject) => {
      let callbackName = '';
      let url = inputUrl;

      url = url + (url.indexOf('?') === -1 ? '?' : '&') + JSONP.parseData(data);
      // 检测 callback 的函数名是否已经定义
      const match = /callback=(\w+)/.exec(url);
      if (match?.[1]) {
        callbackName = match[1];
      } else {
        callbackName = `helJsonp_${JSONP.now()}_${JSONP.rand()}`;
      }
      if (url.includes('?')) {
        url = `${url}&callback=${callbackName}`;
      } else {
        url = `${url}?callback=${callbackName}`;
      }

      const globalThis = getGlobalThis();
      const doc = globalThis.document;
      const script = doc.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.id = callbackName;
      script.onerror = reject;
      script.addEventListener('error', reject); // 早期版本的浏览器不支持 script.onerror

      // 把传进来的函数重新组装，并把它设置为全局函数，远程会触发该函数
      // @ts-ignore
      globalThis[callbackName] = function (jsonData: any) {
        // @ts-ignore
        delete globalThis[callbackName]; // 执行完函数就销毁
        const elem = doc.getElementById(callbackName);
        elem && JSONP.removeElem(elem);

        return resolve(jsonData);
      };
      const head = doc.getElementsByTagName('head');
      if (head?.[0]) {
        head[0].appendChild(script);
      }
    });
  },
};

export const { getJSON } = JSONP;
