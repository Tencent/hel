import { getGlobalThis } from '../core/globalRef';

interface IXHRConfig {
  responseType?: XMLHttpRequest['responseType'];
  timeout?: XMLHttpRequest['timeout'];
  withCredentials?: XMLHttpRequest['withCredentials'];
  headers?: Record<string, string>;
}

interface IXhrFetchConfig extends IXHRConfig {
  method?: string;
}

interface Response<T extends any = any> {
  status: XMLHttpRequest['status'];
  statusText: XMLHttpRequest['statusText'];
  data?: T;
  msg?: any;
  url?: string;
}

export function getXHRIns() {
  let xhr;
  const { XMLHttpRequest, ActiveXObject } = getGlobalThis();
  if (XMLHttpRequest) { // 标准浏览器
    xhr = new XMLHttpRequest();
  } else if (ActiveXObject) { // 旧版IE
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xhr;
}

export default async function xhrFetch<T extends any = any>(url: string, config?: IXhrFetchConfig): Promise<Response<T>> {
  const { method, ...xhrConfig } = config || {};
  const xhr = new XHR(xhrConfig);
  const result = await xhr.request<T>(url, method);
  return result;
}

class XHR {
  req: XMLHttpRequest | null = null;
  resultPromise: Promise<Response<any>> = Promise.resolve(null as any);

  constructor(config?: IXHRConfig) {
    this.init(config || {});
  }

  init(config: IXHRConfig) {
    const req = getXHRIns();
    if (!req) {
      throw new Error('current browser is not support XMLHttpRequest!');
    }
    this.req = req;

    // 同步配置
    const { responseType, timeout = 10000, withCredentials, headers } = config;
    req.responseType = responseType || 'json';
    req.timeout = timeout;
    req.withCredentials = !!withCredentials;
    if (headers) {
      Object.keys(headers).forEach((key) => {
        req.setRequestHeader(key, headers[key]);
      });
    }

    let initResolve: any = null;
    let initReject: any = null;
    this.resultPromise = new Promise((resolve, reject) => {
      initResolve = resolve;
      initReject = reject;
    });

    const wrapSuccessResult = () => {
      const { response, status, statusText, responseURL } = req;
      initResolve({ data: response, status, statusText, url: responseURL });
    };

    const wrapErrResult = (e: ProgressEvent<EventTarget>) => {
      const { status, statusText, responseURL } = req;
      initReject({ msg: e, status, statusText, url: responseURL });
    };

    // 监听事件
    req.onload = () => wrapSuccessResult();
    req.onerror = (e) => wrapErrResult(e);
    req.onabort = (e) => wrapErrResult(e);
    req.ontimeout = (e) => wrapErrResult(e);
    req.onprogress = () => { };
  }

  async request<T extends any = any>(url: string, method?: string): Promise<Response<T>> {
    if (!this.req) {
      throw new Error('forget init');
    }

    // 发送请求
    this.req.open(method ? method.toUpperCase() : 'GET', url);
    this.req.send();
    const result: Response<T> = await this.resultPromise;
    return result;
  }
}
