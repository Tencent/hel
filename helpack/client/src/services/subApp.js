/* eslint-disable no-underscore-dangle,no-param-reassign */
/** @typedef {import('types/domain').SubApp} SubApp */
/** @typedef {import('hel-types').ISubAppVersion} ISubAppVersion*/
import { SEC_STR } from 'configs/constant';
import http from 'services/http';
import { signUrl, signUrlByName } from 'services/shared/sign';
import { purify, safeParse } from 'utils/object';
import { signMD5 } from 'utils/sign';

function ensureCommittedSubAppProperties(subApp) {
  const copy = { ...subApp };
  if (copy.gray_users && typeof copy.gray_users === 'object') {
    copy.gray_users = JSON.stringify(copy.gray_users);
  }
  if (copy.owners && typeof copy.owners === 'object') {
    copy.owners = JSON.stringify(copy.owners);
  }
  return copy;
}

export function makeAppInfo(/** @type SubApp*/ app, /** @type ISubAppVersion*/ appVersion) {
  return {
    name: app.name,
    nameInSec: app.name_in_sec,
    additionalScripts: safeParse(app.additional_scripts, []),
    cnName: app.cnname,
    apiHost: app.api_host,
    isTest: app.is_test,
    renderMode: app.render_mode,
    hostMap: app.host_map,
    uiFramework: app.ui_framework,
    version: appVersion.sub_app_version,
    srcMap: appVersion.src_map || {},
  };
}

/**
    subAppService.getUserStarAppNames()
    subAppService.getUserVisitAppNames()
 */
export async function combine3api(user) {
  const timestamp = Date.now();
  const name = `combine3api_for_${user}`;
  let url = `/api/v1/app/info/combine3api?timestamp=${timestamp}&name=${name}`;
  url = signUrlByName(url, name, timestamp);
  const ret = await http.get(url);
  if (!ret.markedInfo) {
    ret.markedInfo = { markedList: [] };
  }
  return ret;
}

/**
 * 获取子应用列表
 * @return {Promise<{apps:import('types/domain').SubApp[], total:number}>}
 */
export async function querySubApps(queryOptions = {}) {
  let _queryOptions = { ...queryOptions };
  if (!_queryOptions.page) _queryOptions.page = 1;
  if (!_queryOptions.size) _queryOptions.size = 20;
  _queryOptions = purify(_queryOptions);

  // 后台起始值是 0
  _queryOptions.page = _queryOptions.page - 1;

  const timestamp = Date.now();
  let url = `/api/v1/app/info/querySubApps?timestamp=${timestamp}`;
  const content = `${_queryOptions.page}_${SEC_STR}_${_queryOptions.size}_${timestamp}`;
  const nonce = signMD5(content);
  url = `${url}&nonce=${nonce}`;

  const ret = await http.post(url, _queryOptions);
  return ret;
}

export async function getSubApp(appName) {
  const app = await http.get(`/api/v1/app/info/getSubApp?name=${appName}`);
  return app;
}

export async function getSubAppToken(appName) {
  const ret = await http.get(`/api/v1/app/info/getSubAppToken?name=${appName}`, '', { check: false, returnLogicData: false });
  if (parseInt(ret.code, 10) !== 0) {
    throw new Error(ret.msg);
  }
  return ret.data;
}

export async function createSubApp(toCreate) {
  const timestamp = Date.now();
  const nonce = signMD5(`${toCreate.name}_${timestamp}_${SEC_STR}`);
  const res = await http.post(
    `/api/v1/app/info/createSubApp?timestamp=${timestamp}&nonce=${nonce}`,
    ensureCommittedSubAppProperties(toCreate),
  );
  return res;
}

export async function updateSubApp(toUpdate) {
  const timestamp = Date.now();
  const content = `${toUpdate.id}_${timestamp}_${SEC_STR}`;
  const nonce = signMD5(content);
  const url = `/api/v1/app/info/updateSubApp?timestamp=${timestamp}&nonce=${nonce}`;
  const res = await http.post(url, ensureCommittedSubAppProperties(toUpdate), { check: false, returnLogicData: false });
  return res;
}

/**
 * 获取子应用版本详情
 * @return {Promise<ISubAppVersion>}
 */
export async function getSubAppVersion(name, versionTag, isFull) {
  const content = isFull ? '1' : '0';
  const appVersion = await http.get(`/api/v1/app/info/getSubAppVersion?name=${name}&ver=${versionTag}&content=${content}`);
  return appVersion;
}

/**
 * 获取用户搜藏过的子应用名称列表
 */
export async function getUserStarAppNames() {
  const starAppNames = await http.get('/api/v1/app/info/getUserStarAppNames');
  return starAppNames;
}

/**
 * 获取用户最近访问过的子应用名称列表
 */
export async function getUserVisitAppNames() {
  const visitAppNames = await http.get('/api/v1/app/info/getUserVisitAppNames');
  return visitAppNames;
}

/**
 * 更新用户对某个应用的收藏记录
 * @param {string} subAppName - 子应用名称
 * @param {boolean} starIt - true: 标记收藏，false：取消收藏
 */
export async function updateUserStarApp(subAppName, starIt = true) {
  const ret = await http.get(`/api/v1/app/info/updateUserStarApp?name=${subAppName}&star=${starIt ? 1 : 0}`);
  return ret;
}

/**
 * 更新用户的最近访问记录
 * @param {string} subAppName
 * @return {[string][]} - newVisitAppNames
 */
export async function updateUserVisitApp(subAppName) {
  const ret = await http.get(`/api/v1/app/info/updateUserVisitApp?name=${subAppName}`);
  return ret;
}

/**
 * 删除用户的最近访问记录
 * @param {string} subAppName
 */
export async function delUserVisitApp(subAppName) {
  const ret = await http.get(`/api/v1/app/info/delUserVisitApp?name=${subAppName}`);
  return ret;
}

/**
 * 新增或更新应用某个版本的个人标记信息
 * @param {{name:string, ver:string, desc:string}} subAppName
 */
export async function updateAppUserMarkInfo(body) {
  const ret = await http.post('/api/v1/app/info/updateAppUserMarkInfo', body);
  return ret;
}

/**
 * 删除应用某个版本的个人标记信息
 * @param {{name:string, ver:string}} subAppName
 */
export async function delAppUserMarkInfo(body) {
  const ret = await http.post('/api/v1/app/info/delAppUserMarkInfo', body);
  return ret;
}

/**
 * 获取应用的全局数据
 * @param {string} subAppName
 */
export async function getAppGlobalData(name) {
  const ret = await http.get(`/api/v1/app/info/getAppGlobalData?name=${name}`);
  return ret;
}

/**
 * 新增或更新应用某个版本的全局标记信息
 * @param {{name:string, ver:string, desc:string}} body
 */
export async function updateAppGlobalMarkInfo(body) {
  const url = signUrl('/api/v1/app/info/updateAppGlobalMarkInfo', body.name);
  const ret = await http.post(url, body);
  return ret;
}

/**
 * 删除应用某个版本的全局标记信息
 * @param {{name:string, ver:string}} body
 */
export async function delAppGlobalMarkInfo(body) {
  const url = signUrl('/api/v1/app/info/delAppGlobalMarkInfo', body.name);
  const ret = await http.post(url, body);
  return ret;
}

export async function getSubAppAndItsVersion(name, version) {
  const ret = await http.get(`/openapi/v1/app/info/getSubAppAndItsVersion?name=${name}&version=${version}`);
  return ret;
}

export async function getSubAppAndItsFullVersion(name, version) {
  const ret = await http.get(`/openapi/v1/app/info/getSubAppAndItsFullVersion?name=${name}&version=${version}`);
  return ret;
}

export async function resetAppInfoCache(name) {
  const timestamp = Date.now();
  let url = `/api/v1/app/info/resetAppInfoCache?timestamp=${timestamp}`;
  url = signUrlByName(url, name, timestamp);
  const appInfo = await http.post(url, { name });
  return appInfo;
}
