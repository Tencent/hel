import type { ISubApp, ISubAppVersion, ApiMode, Platform } from 'hel-types';
import type { IInnerPreFetchOptions } from '../types';
import { safeParse, requestGet, perfStart, perfEnd, getLocalStorage, getUnpkgLatestVer } from '../util';
import { getPlatformHost, getPlatformConfig } from '../shared/platform';
import { getJSON } from '../dom/jsonp';
import { apiSrvConst, PLAT_UNPKG } from '../consts/logic';

export interface IUnpkgGetOptions {
  versionId?: string;
  platform?: Platform;
}

export interface IHelSimpleGetOptions {
  versionId?: string;
  platform?: Platform;
  apiMode?: ApiMode;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
}

export interface IHelGetOptions extends IHelSimpleGetOptions {
  loadOptions?: IInnerPreFetchOptions;
}

async function executeGet(
  url: string,
  options: {
    apiMode?: ApiMode, isFullVersion?: boolean, platform: Platform,
    onlyVersion?: boolean,
  },
): Promise<any> {
  let ret = null;
  const { isFullVersion, platform, onlyVersion } = options;
  // 确保一定向 unpkg 平台发起 get 请求
  const apiMode = platform === PLAT_UNPKG ? 'get' : options.apiMode;

  // 方便追踪请求耗时
  const perfLabel = `request ${url}`;
  perfStart(perfLabel);
  if (apiMode === 'get') {
    const reply = await requestGet(url);
    ret = reply.data;
  } else { // jsonp get
    ret = await getJSON(url);
  }
  perfEnd(perfLabel);

  // 请求 unpkg 平台时拿到的是原始数据，和 hel pack 管理台有差异
  // 这里做一下抹平处理，以便上层可以用一致的方式读取数据
  if (platform === PLAT_UNPKG) {
    const version = ret.version;
    if (onlyVersion) {
      ret = version;
    }
    if (!isFullVersion) {
      delete version?.html_content;
    }
    return { data: ret, code: '0', msg: '' };
  }

  return ret;
}


function ensureApp(app: ISubApp) {
  const clonedApp = { ...app };
  clonedApp.additional_scripts = safeParse(clonedApp.additional_scripts, []);
  clonedApp.additional_body_scripts = safeParse(clonedApp.additional_body_scripts, []);
  return clonedApp;
}


function ensureVersion(version: ISubAppVersion) {
  const clonedVersion = { ...version };
  clonedVersion.src_map = safeParse(clonedVersion.src_map, {});
  return clonedVersion;
}


async function getUnpkgUrl(apiHost: string, appName: string, versionId: string) {
  let ver = versionId;
  if (!ver) {
    ver = await getUnpkgLatestVer(appName);
  }
  // https://unpkg.com/hel-lodash@1.2.2/hel_dist/hel-meta.json
  return `${apiHost}/${appName}@${ver}/hel_dist/hel-meta.json?_t=${Date.now()}`;
}


export function prepareOtherPlatRequestInfo(appName: string, getOptions: Omit<IHelGetOptions, 'loadOptions'>) {
  const { versionId, platform, apiMode, isFullVersion = false } = getOptions;
  const apiHost = getPlatformHost(platform);
  const { apiSuffix, apiPathOfApp, platform: targetPlatform, getUserName, userLsKey } = getPlatformConfig(platform);
  const userName = getUserName?.({ platform: targetPlatform, appName })
    || getLocalStorage().getItem(userLsKey || apiSrvConst.USER_KEY)
    || '';
  let url = '';

  // 为 hel pack 模块管理台拼接请求链接
  const jsonpMark = apiMode === 'get' ? '' : 'Jsonp';
  const interfaceName = !isFullVersion ? apiSrvConst.GET_APP_AND_VER : apiSrvConst.GET_APP_AND_FULL_VER;
  const finalInterfaceName = `${interfaceName}${jsonpMark}`;

  const finalApiPath = apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
  url = `${apiHost}${finalApiPath}/${finalInterfaceName}?name=${appName}`;
  if (userName) {
    url += `&userName=${userName}`;
  }
  if (versionId) {
    url += `&version=${versionId}`;
  }
  if (apiSuffix) {
    url += apiSuffix;
  }

  return { url, userName };
}


export async function prepareUnpkgPlatRequestInfo(appName: string, getOptions: IUnpkgGetOptions = {}) {
  const { versionId, platform } = getOptions;
  const apiHost = getPlatformHost(platform);
  const url = await getUnpkgUrl(apiHost, appName, versionId || '');
  return url;
}


export async function prepareRequestInfo(appName: string, getOptions: IHelGetOptions) {
  const { platform } = getOptions;
  const { platform: targetPlatform } = getPlatformConfig(platform);
  let userName = '';
  let url = '';

  // 为请求 unpkg cdn 拼接请求链接
  if (targetPlatform === PLAT_UNPKG) {
    url = await prepareUnpkgPlatRequestInfo(appName, getOptions);
  } else {
    const ret = prepareOtherPlatRequestInfo(appName, getOptions);
    url = ret.url;
    userName = ret.userName;
  }

  return { url, userName };
}


async function prepareRequestVersionUrl(versionId: string, getOptions: IGetVerOptions) {
  const { platform, apiMode, appName, isFullVersion = false } = getOptions;
  const apiHost = getPlatformHost(platform);
  const { apiSuffix, apiPathOfApp, apiPathOfAppVersion, platform: targetPlatform } = getPlatformConfig(platform);
  let url = '';

  // 为请求 unpkg cdn 拼接请求链接
  if (targetPlatform === PLAT_UNPKG) {
    url = await getUnpkgUrl(apiHost, appName, versionId);
  } else {
    // 为 hel pack 模块管理台拼接请求链接
    const jsonpMark = apiMode === 'get' ? '' : 'Jsonp';
    const interfaceName = !isFullVersion ? apiSrvConst.GET_APP_VER : apiSrvConst.GET_APP_FULL_VER;
    const finalInterfaceName = `${interfaceName}${jsonpMark}`;

    const finalApiPath = apiPathOfAppVersion || apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
    url = `${apiHost}${finalApiPath}/${finalInterfaceName}?ver=${versionId}`;
    if (appName) {
      url += `&name=${appName}`;
    }
    if (apiSuffix) {
      url += apiSuffix;
    }
  }

  return url;
}


/**
 * 获取子应用和它的最新在线版本
 */
export async function getSubAppAndItsVersion(appName: string, getOptions: IHelGetOptions) {
  const { versionId, platform, apiMode, loadOptions } = getOptions;
  const { getSubAppAndItsVersionFn, platform: targetPlatform } = getPlatformConfig(platform);
  const { url, userName } = await prepareRequestInfo(appName, getOptions);
  // 如用户在 preFetchLib 或 init 时定义了 getSubAppAndItsVersionFn 函数，则走用户的自定义函数
  const getFn = loadOptions?.getSubAppAndItsVersionFn || getSubAppAndItsVersionFn;

  // 内部的请求句柄
  const innerRequest = async (custUrl?: string, custApiMode?: ApiMode) => {
    const reply = await executeGet(
      custUrl || url,
      { apiMode: custApiMode || apiMode, platform: targetPlatform },
    );
    if (0 !== parseInt(reply.code)) {
      throw new Error(reply.msg);
    }
    return { app: ensureApp(reply.data.app), version: ensureVersion(reply.data.version) };
  };

  if (getFn) {
    const data = await Promise.resolve(
      getFn({ platform: targetPlatform, appName, userName, versionId, url, innerRequest })
    ) as { app: ISubApp, version: ISubAppVersion };
    return { app: ensureApp(data.app), version: ensureVersion(data.version) };
  }

  const data = await innerRequest();
  return data;
}


export interface IGetVerOptions {
  platform: Platform;
  apiMode: ApiMode;
  appName: string;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
}


/**
 * 获取子应用版本详情 { platform, apiMode, appName: appVersion.sub_app_name }
 */
export async function getSubAppVersion(versionId: string, options: IGetVerOptions) {
  const { platform, apiMode, isFullVersion = false } = options;
  const { platform: targetPlatform } = getPlatformConfig(platform);
  const url = await prepareRequestVersionUrl(versionId, options);

  const { data, code, msg } = await executeGet(url, { apiMode, isFullVersion, platform: targetPlatform, onlyVersion: true });
  if (0 !== parseInt(code)) {
    throw new Error(msg || 'ver not found');
  }

  const versionData = ensureVersion(data);
  return versionData;
}
