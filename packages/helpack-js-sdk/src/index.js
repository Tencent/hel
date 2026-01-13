/* eslint-disable */
/** @typedef {import('../index').ISubAppCreate} ISubAppCreate */
/** @typedef {import('../index').ISubAppUpdate} ISubAppUpdate */
/** @typedef {import('../index').IVersionCreate} IVersionCreate */
/** @typedef {import('../index').IOptions} IOptions */
/** @typedef {import('../index').IBackupAssetsOptions} IBackupAssetsOptions */
/** @typedef {import('hel-types').ISubApp} ISubApp */
/** @typedef {import('hel-types').ISubAppVersion} ISubAppVersion */
const axios = require('axios').default;
const crypto = require('crypto-js');

const DEFAULT_HOST = 'http://localhost:7777';
const API_PATH = '/openapi/v1/sdk';
const POLLING_INTERVAL = 5000; // 轮询间隔时间（毫秒）

const util = {
  log(/** @type {IOptions} */ options, ...data) {
    const { debug } = options;
    if (typeof debug === 'boolean') {
      debug && console.log(data);
    }
    if (typeof debug === 'function') {
      debug(data);
    }
  },
  getApiHostPath(/** @type {IOptions} */ options) {
    const host = options.host || DEFAULT_HOST;
    return `${host}${API_PATH}`;
  },
  getAPiPrefix(apiName, /** @type {IOptions} */ options) {
    return `${util.getApiHostPath(options)}/${apiName}`;
  },
  sign(content) {
    const sign = crypto.MD5(content).toString();
    // 等同于后台 crypto 库如下代码
    // const md5 = crypto.createHash('md5');
    // md5.update(content);
    // const sign = md5.digest('hex');
    return sign;
  },
  checkCommon(/** @type {ISubAppUpdate} */ subApp, forLabel) {
    if (!subApp.name) {
      throw new Error(`name is required ${forLabel}`);
    }
  },
  checkUpdate(/** @type {ISubAppUpdate} */ subApp, forLabel) {
    util.checkCommon(subApp, forLabel);
    if (subApp.app_group_name) {
      throw new Error(`app_group_name should not be supplied ${forLabel}`);
    }
  },
  checkCreate(/** @type {ISubAppCreate} */ subApp, /** @type {IOptions} */ options, forLabel) {
    util.checkCommon(subApp, forLabel);
    if (!subApp.app_group_name) {
      throw new Error(`app_group_name is required ${forLabel}`);
    }
    if (subApp.class_key && subApp.class_key !== options.classKey) {
      throw new Error(`class_key is equal with options.classKey ${forLabel}`);
    }
  },
  checkOptions(/** @type {IOptions} */ options) {
    const { classKey, classToken, operator } = options;
    if (!classKey) {
      throw new Error('options.classKey is required');
    }
    if (!classToken) {
      throw new Error('options.classToken is required');
    }
    if (!operator) {
      throw new Error('options.operator is required');
    }
  },
  genNonceSearch(operator, timestamp, nonce, addQuestionPrefix = true) {
    const prefix = addQuestionPrefix ? '?' : '&';
    return `${prefix}rtx=${operator}&timestamp=${timestamp}&nonce=${nonce}`;
  },
  checkAndWrapResult(axiosResult) {
    const { status, statusText, data } = axiosResult;
    if (status !== 200) {
      throw new Error(statusText);
    }
    if (data.code !== '0') {
      throw new Error(data.msg);
    }
    return { status, statusText, reply: data };
  },
  delay(ms = 5000) {
    return new Promise((r) => setTimeout(r, ms));
  },
  genRequestUrlWithinAppNonce(baseUrl, name, options) {
    const { classToken, operator, search = '' } = options;
    const timestamp = Date.now();
    const content = `${name}_${classToken}_${timestamp}`;
    const nonce = util.sign(content); // 调用签名函数得到随机字符串
    const fullUrl = `${baseUrl}${util.genNonceSearch(operator, timestamp, nonce)}${search}`;
    return fullUrl;
  },
};

const signer = {
  addVersion(/** @type {IVersionCreate} */ ver, /** @type {IOptions} */ options) {
    const { classToken, operator } = options;
    const { sub_app_name, sub_app_version } = ver;
    const timestamp = Date.now();
    const content = `${sub_app_name}_${sub_app_version}_${timestamp}_${classToken}`;
    const nonce = util.sign(content); // 调用签名函数得到随机字符串
    return { nonce, search: util.genNonceSearch(operator, timestamp, nonce) };
  },
};

/**
 * 创一个新应用
 * @param {ISubAppCreate} subApp
 * @param {IOptions} options
 * @returns
 */
exports.createSubApp = async function (subApp, options) {
  util.checkOptions(options);
  util.checkCreate(subApp, options, 'for createSubApp');
  const { classToken, operator, classKey } = options;

  /** @type ISubApp */
  const subAppData = Object.assign({}, subApp);
  subAppData.create_by = operator;
  subAppData.class_key = classKey;
  subAppData.is_test = subApp.is_test === undefined ? 1 : subApp.is_test;
  subAppData.enable_pipeline = subApp.enable_pipeline === undefined ? 1 : subApp.enable_pipeline;

  const timestamp = Date.now();
  const content = `${subAppData.name}_${timestamp}_${classKey}_${classToken}`;
  const nonce = util.sign(content); // 调用签名函数得到随机字符串
  const url = `${util.getAPiPrefix('createSubApp', options)}${util.genNonceSearch(operator, timestamp, nonce)}`;
  const result = await axios.post(url, subAppData);
  return util.checkAndWrapResult(result);
};

/**
 * 更新应用
 * @param {ISubAppUpdate} update
 * @param {IOptions} options
 */
exports.updateSubApp = async function (update, options) {
  util.checkOptions(options);
  util.checkUpdate(update, 'for updateSubApp');
  const { name } = update;
  const url = util.genRequestUrlWithinAppNonce(util.getAPiPrefix('updateSubApp', options), name, options);
  const result = await axios.post(url, update);
  return util.checkAndWrapResult(result);
};

/**
 * 新增版本
 * @param {IVersionCreate} ver
 * @param {IOptions} options
 */
exports.addVersion = async function (/** @type {IVersionCreate} */ ver, options) {
  util.checkOptions(options);
  /** @type ISubAppVersion */
  const verData = Object.assign({}, ver, {
    create_by: options.operator,
  });

  util.log(options, 'addVersion ', verData);
  const { search } = signer.addVersion(verData, options);
  const url = `${util.getAPiPrefix('addVersion', options)}${search}`;
  const result = await axios.post(url, { version: verData });
  return util.checkAndWrapResult(result);
};

/**
 * 新增版本并存储版本数据里描述的资源到helpack的默认cdn
 * TODO 支持直接存储本地的资源（ 上传zip ---> 后台解压然后存到cdn ）
 * @param {IVersionCreate} ver
 * @param {IOptions} options
 */
exports.addVersionAndBackupAssets = async function (/** @type {IVersionCreate} */ ver, /** @type {IBackupAssetsOptions} */ options) {
  const { reply } = await exports.addVersion(ver, options);
  const dbId = reply.data.id;

  let sec = options.timeout || 120;
  if (sec <= 10) {
    sec = 10;
  }

  const secMs = sec * 1000;
  const totalLoopCount = Math.ceil(secMs / POLLING_INTERVAL);
  let loopCount = 0;
  let uploadFinish = false;
  let finalFetchResult = {
    status: 200,
    statusText: '',
    reply: {
      code: '0',
      msg: '',
      data: {
        uploadedFiles: [],
        pendingFiles: [],
        totalCount: 0,
        finish: false,
      },
    },
  };
  while (loopCount < totalLoopCount) {
    const { search } = signer.addVersion(ver, options);
    const url = `${util.getAPiPrefix('queryBackupAssetsProgress', options)}${search}&dbId=${dbId}`;
    const result = await axios.post(url, { version: ver });
    finalFetchResult = util.checkAndWrapResult(result);
    const serverReply = finalFetchResult.reply;

    // 触发用户设定的进度查看回调
    if (options.onProcess) {
      options.onProcess(serverReply.data);
    }
    // 上传完毕，轮询结束
    if (serverReply.data.finished) {
      uploadFinish = true;
      break;
    }
    loopCount += 1;
    await util.delay(POLLING_INTERVAL);
  }
  if (!uploadFinish) {
    throw new Error(`upload assets timeout for ${sec}s, please go helpack to check your assets upload progress!`);
  }

  return finalFetchResult;
};

/**
 * 获取应用（ token已被替换为 ****** ）
 */
exports.getSubApp = async function (name, options) {
  const url = `${util.getAPiPrefix('getSubApp', options || {})}?name=${name}`;
  const result = await axios.post(url);
  return util.checkAndWrapResult(result);
};

/**
 * 通过版本号获取具体版本
 */
exports.getVersion = async function (verId, options) {
  const { name, classToken, operator } = options || {};
  const baseUrl = util.getAPiPrefix('getVersion', options);
  const search = `&ver=${verId}`;
  const url = util.genRequestUrlWithinAppNonce(baseUrl, name, { search, classToken, operator });
  const result = await axios.post(url);
  return util.checkAndWrapResult(result);
};

/**
 * 通过版本号获取具体版本
 */
exports.getVersionList = async function (name, options) {
  const { page = 0, size = 10, classToken, operator } = options || {};
  if (size > 100) {
    throw new Error('size cannot exceed 100');
  }

  const baseUrl = util.getAPiPrefix('getVersionList', options);
  const url = util.genRequestUrlWithinAppNonce(baseUrl, name, { classToken, operator });
  const result = await axios.post(url, { name, page, size });
  return util.checkAndWrapResult(result);
};
