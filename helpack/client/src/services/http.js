/* eslint-disable */
/** @typedef {import('./httpt').IReqOptions} IReqOptions*/
import axios from 'axios';
import errCode from 'configs/constant/errCode';
import cute from 'cute-http';
import qs from 'qs';
import reqwest from 'reqwest';
import * as messageService from 'services/message';
// import resData from 'assets/response-data';

cute.setConfig({
  retryCount: 3, // 重试次数
  timeout: 20000, // 超时时间
  // debug: true, // 打开debug模式
});

const getXFormOptions = () => ({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  withCredentials: true,
});
const generalOptions = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,

  // replyReceived: (reply, m) => {
  //   // console.log('reply.config.url', reply.config.url);
  //   cute.post('/collectData', { data: reply.data, method: m, url: reply.config.url }, {
  //     headers: { 'Content-Type': 'application/json' },
  //     withCredentials: true,
  //   });
  // }
};

const checkCode = (axiosReply, url = '', checkOptions = {}) => {
  const { returnLogicData = true, check = true } = checkOptions;

  const { statusCode = 0 } = axiosReply;
  const httpResponse = axiosReply.data || axiosReply;

  if (statusCode >= 400) throw new Error(`服务器内部错误${statusCode}`);
  const { status = '0', message = '接口格式错误', response, code, data, msg } = httpResponse;

  // 这里 status 和 code 都要判断......
  if (check && status !== undefined) {
    if (status !== '0') {
      const err = new Error(message);
      err.status = status;
      err.url = url;
      throw err;
    }
  }

  if (check && code !== undefined) {
    if (String(code) !== '0') {
      const err = new Error(`url: ${url} ${msg || message}`);
      err.code = code;
      throw err;
    }
  }

  // 直接返回 axiosReply.data, 即服务器返回的原始数据
  if (!returnLogicData) {
    return httpResponse;
  }

  // 服务端返回的业务相关的数据
  return data !== undefined ? data : response;
};

export const attachPrefixAndData = (/** @type string */ url, data) => {
  const pureUrl = url.replace(/ /g, '');
  let prefixedUrl = `${pureUrl}`;

  if (data) {
    if (pureUrl.includes('?')) return `${prefixedUrl}&${qs.stringify(data)}`;
    return `${prefixedUrl}?${qs.stringify(data)}`;
  }

  if (!url.startsWith('http')) {
    prefixedUrl = `${window.top.location.origin}${prefixedUrl}`;
  }

  return prefixedUrl;
};

const attachReqTime = (url) => {
  const time = Date.now();
  if (url.includes('?')) return `${url}&_rt=${time}`;
  return `${url}?_rt=${time}`;
};

function handleError(error, defaultValue) {
  if (!defaultValue) {
    const code = error.code;
    if (code === errCode.HEL_ERR_TIME_EXPIRED) {
      messageService.error('你的当前系统时间不正确，请校正后再尝试');
    }
    throw error;
  } else {
    if (error && error.response && error.response.status >= 400) {
      messageService.error(`服务器内部错误 ${error.response.status}`);
    }
  }

  // 返回默认值
  return defaultValue;
}

async function sendRequest(method, url, data, options = {}) {
  const { returnLogicData, defaultValue = '', check = true } = options;
  try {
    delete options.returnLogicData;
    delete options.check;
    const mergedOpt = { ...generalOptions, ...options };

    let reply;
    if (method === 'get') {
      // 防止get接口被浏览器缓存
      const reqUrl = attachReqTime(attachPrefixAndData(url, data));
      reply = await cute[method](reqUrl, '', mergedOpt);
    } else {
      reply = await cute[method](attachPrefixAndData(url, ''), data, mergedOpt);
    }

    const checkOptions = { returnLogicData, check };
    return checkCode(reply, url, checkOptions);
  } catch (err) {
    return handleError(err, defaultValue);
  }
}

/**
 * @param {string} url
 * @param {object} data
 * @param {IReqOptions} options
 */
async function get(url, data, options) {
  return sendRequest('get', url, data, options);
}

/**
 * @param {string} url
 * @param {object} data
 * @param {IReqOptions} options
 */
async function post(url, body, options) {
  return sendRequest('post', url, body, options);
}

/**
 * @param {string} url
 * @param {object} data
 * @param {IReqOptions} options
 */
async function put(url, body, options) {
  return sendRequest('put', url, body, options);
}

async function xFormPost(url, data, options = {}) {
  const { returnLogicData, defaultValue = '' } = options;
  try {
    delete options.returnLogicData;
    const xFormOptions = getXFormOptions();
    const reply = await cute.post(attachPrefixAndData(url, data), {}, xFormOptions);
    return checkCode(reply, url, returnLogicData);
  } catch (err) {
    return handleError(err, defaultValue);
  }
}

async function postE(url, body, options = {}) {
  try {
    return post(url, body, options);
  } catch (err) {
    messageService.warning(err.message);
    return handleError(err, options.defaultValue);
  }
}

async function multiGet(urls, options = {}) {
  const { returnLogicData, defaultValue = '' } = options;
  try {
    delete options.returnLogicData;
    const _urls = urls.map((url) => attachPrefixAndData(url, ''));
    const failStrategy = options.failStrategy !== undefined ? options.failStrategy : cute.const.KEEP_ALL_BEEN_EXECUTED;
    const replyList = await cute.multiGet(_urls, { ...generalOptions, ...{ failStrategy } });
    return replyList.map((r, idx) => checkCode(r, _urls[idx], returnLogicData));
  } catch (err) {
    return handleError(err, defaultValue);
  }
}

async function multiPost(items, options = {}) {
  const { returnLogicData, defaultValue = '' } = options;

  try {
    delete options.returnLogicData;
    items.forEach((item) => (item.url = attachPrefixAndData(item.url, '')));
    const failStrategy = options.failStrategy !== undefined ? options.failStrategy : cute.const.KEEP_ALL_BEEN_EXECUTED;
    const replyList = await cute.multiPost(items, { ...generalOptions, ...{ failStrategy } });
    return replyList.map((r, idx) => checkCode(r, items[idx].url, returnLogicData));
  } catch (err) {
    return handleError(err, defaultValue);
  }
}

async function postFromData(url, data) {
  const formData = new FormData();
  Object.keys(data).forEach((k) => {
    formData.append(k, data[k]);
  });

  const instance = axios.create({
    withCredentials: true,
  });

  return new Promise((resolve, reject) => {
    instance.post(url, formData).then((res) => {
      if (res.status == 200) {
        resolve(res.data);
      } else {
        reject(res.status);
      }
    });
  });
}

const http = async ({ checkFn = checkCode, defaultValue, ...options }) => {
  try {
    options.url = attachPrefixAndData(options.url);

    // jsonp 通过 reqwest 发送
    if (options.method === 'jsonp') {
      const data = await reqwest({
        type: 'jsonp',
        url: `${options.url}?${qs.stringify(options.data)}`,
      });
      return checkFn(data);
    }
    // get 请求通过params发送参数
    if (options.method === 'get' || !options.method) {
      options.params = options.data;
      delete options.data;
    }

    options.withCredentials = true;
    const { data } = await axios(options);
    return checkFn(data);
  } catch (error) {
    console.error(options, error.message);
    messageService.error(error.message);
    // 返回默认值
    return defaultValue;
  }
};

http.get = get;
http.put = put;
http.xFormPost = xFormPost;
http.post = post;
http.postE = postE; // 总是提示错误
http.postFromData = postFromData;
http.multiGet = multiGet;
http.multiPost = multiPost;

export default http;
