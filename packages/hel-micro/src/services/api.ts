import type { ISubApp, ISubAppVersion, ApiMode, Platform } from 'hel-types';
import { safeParse, requestGet, perfStart, perfEnd, getLocalStorage } from '../util';
import { getPlatformHost, getPlatformConfig } from '../shared/platform';
import { getJSON } from '../dom/jsonp';
import { apiSrvConst, PLAT_UNPKG } from '../consts/logic';

export interface IGetOptions {
  versionId?: string;
  platform?: Platform;
  apiMode?: ApiMode;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
}

async function executeGet(
  url: string,
  options: { apiMode?: ApiMode, isFullVersion?: boolean, platform: Platform, onlyVersion?: boolean },
): Promise<any> {
  let ret = null;
  const { isFullVersion, platform, onlyVersion } = options;
  // 确保一定向 unpkg 平台发起 get 请求
  const apiMode = platform === PLAT_UNPKG ? 'get' : options.apiMode;

  // 方便追踪请求耗时
  const perfLabel = `request ${url}`;
  perfStart(perfLabel);
  if (apiMode === 'get') {
    ret = await requestGet(url);
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
    return { data: ret, code: '0' };
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


function getUnpkgUrl(apiHost: string, appName: string, versionId: string,) {
  const ver = versionId || 'latest';
  // 直接这样简写 https://unpkg.com/hel-lodash 会产生两次额外的 302 重定向，为了更高效的请求，此处提供完整的请求链接
  return `${apiHost}/${appName}@${ver}/hel_dist/hel-meta.json?_t=${Date.now()}`;
}


export function prepareRequestInfo(appName: string, getOptions: IGetOptions = {}) {
  const { versionId, platform, apiMode, isFullVersion } = getOptions;
  const apiHost = getPlatformHost(platform);
  const { apiSuffix, apiPathOfApp, platform: targetPlatform, getUserName, userLsKey } = getPlatformConfig(platform);
  const userName = getUserName?.({ platform: targetPlatform, appName })
    || getLocalStorage().getItem(userLsKey || apiSrvConst.USER_KEY)
    || '';
  let url = '';

  // 为请求 unpkg cdn 拼接请求链接
  if (targetPlatform === PLAT_UNPKG) {
    url = getUnpkgUrl(apiHost, appName, versionId);
  } else {
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
  }

  return { url, userName };
}


function prepareRequestVersionUrl(versionId: string, getOptions: IGetVerOptions) {
  const { platform, apiMode, appName, isFullVersion = false } = getOptions;
  const apiHost = getPlatformHost(platform);
  const { apiSuffix, apiPathOfApp, apiPathOfAppVersion, platform: targetPlatform } = getPlatformConfig(platform);
  let url = '';

  // 为请求 unpkg cdn 拼接请求链接
  if (targetPlatform === PLAT_UNPKG) {
    url = getUnpkgUrl(apiHost, appName, versionId);
  } else {
    // 为 hel pack 模块管理台拼接请求链接
    const jsonpMark = apiMode === 'get' ? '' : 'Jsonp';
    const interfaceName = !isFullVersion ? apiSrvConst.GET_APP_VER : apiSrvConst.GET_APP_FULL_VER;
    const finalInterfaceName = `${interfaceName}${jsonpMark}`;

    const finalApiPath = apiPathOfAppVersion || apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
    url = `${apiHost}${finalApiPath}/${finalInterfaceName}?ver=${versionId}`;
    if (apiSuffix) {
      url += apiSuffix;
    }
  }

  return url;
}


/**
 * 获取子应用和它的最新在线版本
 */
export async function getSubAppAndItsVersion(appName: string, getOptions: IGetOptions = {}) {
  const { versionId, platform, apiMode } = getOptions;
  const { getSubAppAndItsVersionFn, platform: targetPlatform } = getPlatformConfig(platform);
  const { url, userName } = prepareRequestInfo(appName, getOptions);

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

  // 如用户在 init 时定义了 getSubAppAndItsVersionFn 函数，则走用户的自定义函数
  if (getSubAppAndItsVersionFn) {
    const data = await Promise.resolve(
      getSubAppAndItsVersionFn({ platform: targetPlatform, appName, userName, versionId, url, innerRequest })
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
  const { platform, apiMode, appName, isFullVersion = false } = options;
  const { getSubAppVersionFn, platform: targetPlatform } = getPlatformConfig(platform);

  let url = prepareRequestVersionUrl(versionId, options);

  // 内部的请求句柄
  const innerRequest = async (custUrl?: string, custApiMode?: ApiMode) => {
    const reply = await executeGet(
      custUrl || url,
      { apiMode: custApiMode || apiMode, isFullVersion, platform: targetPlatform },
    );
    if (0 !== parseInt(reply.code)) {
      throw new Error(reply.msg);
    }
    return ensureVersion(reply.data);
  };

  if (getSubAppVersionFn) {
    const data = await Promise.resolve(
      getSubAppVersionFn({ platform: targetPlatform, appName, versionId, url, innerRequest })
    ) as ISubAppVersion;
    return ensureVersion(data);
  }

  const data = await innerRequest();
  return data;
}
