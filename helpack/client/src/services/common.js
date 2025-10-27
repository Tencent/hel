/* eslint-disable camelcase */
/** @typedef {import('types/store').TPortalState} TPortalState */
/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { message } from 'antd';
import { getState } from 'concent';
import * as cst from 'configs/constant';
import * as ccModule from 'configs/constant/ccModule';
import * as page from 'configs/constant/page';
import qs from 'qs';
import { history } from 'react-router-concent';

const { LATEST_VISIT, STAR, STORE, INTRO } = page;

function computeDefaultLatestPushPath() {
  // #/xxxx ---> /xxx
  const path = window.top.location.hash.substr(1);
  if ([LATEST_VISIT, STAR, STORE, INTRO, '/'].includes(path)) {
    return path;
  }
  return '/';
}

function persistPortalModule() {
  /** @type TPortalState */
  const portalState = getState(ccModule.PORTAL);
  portalState.persistTime = Date.now();
  portalState.justLoadByHrefRefresh = true; // 设置为true，给protal reducer 再次读取时判断是不是刚刚强刷进来
  try {
    localStorage.setItem(cst.LS_HUB_PORTAL_STATE, JSON.stringify(portalState));
  } catch (err) {
    // pass
  }
}

export function getTitle() {
  return '海拉模块管控';
}

export function getUrlAppName() {
  const { pathname } = window.top.location;
  // 形如 xxxx, @hel-demo/hub-test,
  const str = pathname.substring(1);
  // 约定了 page/xxx 是访问对应页面的原始 html，需再提取一下名字
  // 此情况只会出现在本地，线上运行时，page/xxx 命中的页面已经是应用自己的 html
  if (str.startsWith('page/')) {
    return str.substring(5);
  }
  return str;
}

// /store, /star, /latest-visit, /
export function getRouteRelativePath() {
  const routerHistory = history.getRouterHistory();
  if (!routerHistory) {
    // 还未挂载好history
    // #/xxx ---> /xxx
    return window.top.location.hash.substr(1);
  }
  const { pathname } = routerHistory.location;
  return pathname;
}

export function getCurrentPage() {
  const pathanme = getRouteRelativePath();
  return pathanme.split('/')[1];
}

let latestPushPath = computeDefaultLatestPushPath();

/**
 * 母应用内部各个页面之间跳转时需要调用的路由跳转函数
 */
export function historyPush(path, refresh = false) {
  if (refresh) {
    // 使用强刷新策略载入母应用自己，如 /#/welcome
    loadAppWithForceRefresh(`${window.top.location.origin}/#${path}`);
    return;
  }
  latestPushPath = path;
  history.push(path);
}

export function getLatestPushPath() {
  return latestPushPath;
}

export function loadAppWithForceRefresh(/** @type string*/ fullPath) {
  let href = fullPath;
  if (fullPath.endsWith('#/')) {
    href = fullPath.substr(0, fullPath.length - 2);
  }
  const { port } = window.location;
  if (port && href.includes(`${port}/page/`)) {
    return message.warn(`不支持在本地开发时访问 ${href}`);
  }

  persistPortalModule();
  window.top.location.href = href;
}

export function getAppVersionInUrl() {
  const search = window.top.location.search;
  if (!search) return '';
  const searchObj = qs.parse(search, { ignoreQueryPrefix: true });
  return searchObj._appv || '';
}

/**
 * 获取应用的流水线所属项目空间
 * @param {SubAppVersion} appVersion
 * @returns
 */
export function getAppPipelineProjSpace(appVersion) {
  const { project_name } = appVersion;
  return `https://some-devops/pipeline/${project_name}`;
}

/**
 * @param {SubAppVersion} appVersion
 * @returns {string}
 */
export function getAppPipelineBuildUrl(appVersion) {
  const { project_name, pipeline_id, build_id, plugin_ver } = appVersion;
  if (!plugin_ver) return '';
  return `https://some-devops/console/pipeline/${project_name}/${pipeline_id}/detail/${build_id}`;
}

export function getUserAvatarUrl(name) {
  // TODO
  console.log(`get avatar for name ${name}`);
  return 'https://avatars.githubusercontent.com/u/7334950?v=4&size=64';
}
