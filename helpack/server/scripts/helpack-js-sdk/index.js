/* eslint-disable */
/** @typedef {import('../index').ISubAppCreate} ISubAppCreate */
/** @typedef {import('../index').ISubAppUpdate} ISubAppUpdate */
/** @typedef {import('../index').IVersionCreate} IVersionCreate */
/** @typedef {import('../index').IOptions} IOptions */
/** @typedef {import('hel-types').ISubApp} ISubApp */
/** @typedef {import('hel-types').ISubAppVersion} ISubAppVersion */
const axios = require('axios').default;
const crypto = require('crypto-js');

// TODO
const DEFAULT_HOST = 'you-helpack-host';
const API_PATH = '/openapi/v1/sdk';

const util = {
  getApiHostPath(/** @type {IOptions} */ options) {
    const host = options.host || DEFAULT_HOST;
    return `${host}${API_PATH}`;
  },
  getAPiPrefix(apiName, /** @type {IOptions} */ options) {
    return `${util.getApiHostPath(options)}/${apiName}`;
  },
  sign(content) {
    const sign = crypto.MD5(content).toString();
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
  genSearch(operator, timestamp, nonce) {
    return `?rtx=${operator}&timestamp=${timestamp}&nonce=${nonce}`;
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

  const timestamp = Date.now();
  const content = `${subAppData.name}_${timestamp}_${classKey}_${classToken}`;
  const nonce = util.sign(content); // 调用签名函数得到随机字符串
  const url = `${util.getAPiPrefix('createSubApp', options)}${util.genSearch(operator, timestamp, nonce)}`;
  const { status, statusText, data } = await axios.post(url, subAppData);
  return { status, statusText, reply: data };
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
  const { classToken, operator } = options;

  const timestamp = Date.now();
  const content = `${name}_${classToken}_${timestamp}`;
  const nonce = util.sign(content); // 调用签名函数得到随机字符串
  const url = `${util.getAPiPrefix('updateSubApp', options)}${util.genSearch(operator, timestamp, nonce)}`;
  const { status, statusText, data } = await axios.post(url, update);
  return { status, statusText, reply: data };
};

/**
 * 新增版本
 * @param {IVersionCreate} ver
 * @param {IOptions} options
 */
exports.addVersion = async function (/** @type {IVersionCreate} */ ver, options) {
  util.checkOptions(options);
  const { classToken, operator } = options;

  /** @type ISubAppVersion */
  const verData = Object.assign({}, ver);
  verData.create_by = operator;

  const { sub_app_name, sub_app_version } = verData;
  const timestamp = Date.now();
  const content = `${sub_app_name}_${sub_app_version}_${timestamp}_${classToken}`;
  const nonce = util.sign(content); // 调用签名函数得到随机字符串
  const url = `${util.getAPiPrefix('addVersion', options)}${util.genSearch(operator, timestamp, nonce)}`;
  const { status, statusText, data } = await axios.post(url, { version: verData });
  return { status, statusText, reply: data };
};

/**
 * 获取应用（token已被移除）
 */
exports.getSubApp = async function (name, options) {
  const url = `${util.getAPiPrefix('getSubApp', options || {})}?name=${name}`;
  const { status, statusText, data } = await axios.post(url);
  return { status, statusText, reply: data };
};
