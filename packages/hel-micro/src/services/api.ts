import type { ISubApp, ISubAppVersion, ApiMode, Platform } from 'hel-types';
import { safeParse, requestGet, perfStart, perfEnd, getLocalStorage } from '../util';
import { getPlatformHost, getPlatformConfig } from '../shared/platform';
import { getJSON } from '../dom/jsonp';
import { apiSrvConst } from '../consts/logic';

export interface IGetOptions {
  versionId?: string;
  platform?: Platform;
  apiMode?: ApiMode;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
}

async function executeGet(url: string, apiMode?: ApiMode): Promise<any> {
  let ret = null;
  // 方便追踪 jsonp 请求耗时
  const perfLabel = `request ${url}`;
  perfStart(perfLabel);
  if (apiMode === 'get') {
    ret = await requestGet(url);
  } else { // jsonp get
    ret = await getJSON(url);
  }
  perfEnd(perfLabel);
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


/**
 * 获取子应用和它的最新在线版本
 */
export async function getSubAppAndItsVersion(appName: string, getOptions: IGetOptions = {}) {
  const { versionId, platform, apiMode, isFullVersion } = getOptions;
  const apiHost = getPlatformHost(platform);
  const {
    apiSuffix, getSubAppAndItsVersionFn, apiPathOfApp, platform: targetPlatform,
    getUserName, userLsKey,
  } = getPlatformConfig(platform);
  const userName = getUserName?.({ platform: targetPlatform, appName })
    || getLocalStorage().getItem(userLsKey || apiSrvConst.USER_KEY)
    || '';

  const jsonpMark = apiMode === 'get' ? '' : 'Jsonp';
  const interfaceName = !isFullVersion ? apiSrvConst.GET_APP_AND_VER : apiSrvConst.GET_APP_AND_FULL_VER;
  const finalInterfaceName = `${interfaceName}${jsonpMark}`;

  const finalApiPath = apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
  let url = `${apiHost}${finalApiPath}/${finalInterfaceName}?name=${appName}`;
  if (userName) {
    url += `&userName=${userName}`;
  }
  if (versionId) {
    url += `&version=${versionId}`;
  }
  if (apiSuffix) {
    url += apiSuffix;
  }

  // 内部的请求句柄
  const innerRequest = async (custUrl?: string, custApiMode?: ApiMode) => {
    const reply = await executeGet(custUrl || url, custApiMode || apiMode);
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
  const HostedApiPrefix = getPlatformHost(platform);
  const { apiSuffix, getSubAppVersionFn, apiPathOfApp, apiPathOfAppVersion, platform: targetPlatform } = getPlatformConfig(platform);

  const jsonpMark = apiMode === 'get' ? '' : 'Jsonp';
  const interfaceName = !isFullVersion ? apiSrvConst.GET_APP_VER : apiSrvConst.GET_APP_FULL_VER;
  const finalInterfaceName = `${interfaceName}${jsonpMark}`;

  const finalApiPath = apiPathOfAppVersion || apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
  let url = `${HostedApiPrefix}${finalApiPath}/${finalInterfaceName}?ver=${versionId}`;
  if (apiSuffix) {
    url += apiSuffix;
  }

  // 内部的请求句柄
  const innerRequest = async (custUrl?: string, custApiMode?: ApiMode) => {
    const reply = await executeGet(custUrl || url, custApiMode || apiMode);
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
