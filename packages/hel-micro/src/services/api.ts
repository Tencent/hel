import type { ApiMode, ISubApp, ISubAppVersion, Platform } from 'hel-types';
import { apiSrvConst, PLAT_UNPKG } from '../consts/logic';
import { getJSON } from '../dom/jsonp';
import { getPlatformConfig, getPlatformHost } from '../shared/platform';
import type { IInnerPreFetchOptions } from '../types';
import { getUnpkgLatestVer, perfEnd, perfStart, requestGet, safeParse } from '../util';
import { getDefaultPlatform, guessUserName } from '../_diff';

export interface IHelGetOptionsBase {
  platform?: Platform;
  apiMode?: ApiMode;
  /** 默认 false，是否获取 html_content */
  isFullVersion?: boolean;
}

export interface IHelGetOptions extends IHelGetOptionsBase {
  versionId?: string;
  projectId?: string;
  loadOptions?: IInnerPreFetchOptions;
  /** 仅服务于batch模式 */
  versionIdList?: string[];
  projectIdList?: string[];
}

async function executeGet<T extends any = any>(
  url: string,
  options: {
    apiMode?: ApiMode;
    isFullVersion?: boolean;
    platform: Platform;
    onlyVersion?: boolean;
  },
): Promise<{ data: T | null; code: string; msg: string }> {
  let ret: any = null;
  const { isFullVersion, platform, onlyVersion } = options;
  // 确保一定向 unpkg 平台发起 get 请求
  const apiMode = platform === PLAT_UNPKG ? 'get' : options.apiMode;

  // 方便追踪请求耗时
  const perfLabel = `request ${url}`;
  perfStart(perfLabel);
  if (apiMode === 'get') {
    const result = await requestGet(url);
    ret = result.reply;
  } else {
    // jsonp get
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
    if (!isFullVersion && version) {
      delete version.html_content;
    }
    if (!version) {
      return { data: null, code: '404', msg: 'no version found' };
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

async function getUnpkgUrl(apiHost: string, appName: string, versionId: string, skip404Sniff = false) {
  let ver = versionId;
  if (!ver) {
    if (skip404Sniff) {
      ver = 'latest'; // latest 未必是最新的，unpkg 可能有延时，需用户自己抉择需不需要跳过404嗅探
    } else {
      ver = await getUnpkgLatestVer(appName, apiHost);
    }
  }
  // https://unpkg.com/hel-lodash@2.1.7/hel_dist/hel-meta.json
  // https://cdn.jsdelivr.net/npm/hel-lodash@2.1.7/hel_dist/hel-meta.json
  return `${apiHost}/${appName}@${ver}/hel_dist/hel-meta.json?_t=${Date.now()}`;
}

export function prepareOtherPlatRequestInfo(appNameOrNames: string | string[], getOptions: IHelGetOptions) {
  const { versionId, projectId, platform, apiMode, isFullVersion = false, versionIdList = [], projectIdList = [] } = getOptions;

  // trust me, appName will be reassign later
  let appName: string = appNameOrNames as string;
  let urlAppName = appName;
  let urlVersion = versionId;
  let urlProjId = projectId;
  let isBatch = false;
  if (Array.isArray(appNameOrNames)) {
    appName = appNameOrNames[0];
    urlAppName = appNameOrNames.join(',');
    urlVersion = versionIdList.join(',');
    urlProjId = projectIdList.join(',');
    isBatch = true;
  }

  const apiHost = getPlatformHost(platform);
  const { apiSuffix, apiPathOfApp, platform: targetPlatform, getUserName, userLsKey } = getPlatformConfig(platform);
  const userName = getUserName?.({ platform: targetPlatform, appName }) || guessUserName(userLsKey || apiSrvConst.USER_KEY);
  let url = '';

  // 为 hel pack 模块管理台拼接请求链接
  const jsonpMark = apiMode === 'get' ? '' : 'Jsonp';
  let interfaceName = '';
  if (!isBatch) {
    interfaceName = !isFullVersion ? apiSrvConst.GET_APP_AND_VER : apiSrvConst.GET_APP_AND_FULL_VER;
  } else {
    interfaceName = !isFullVersion ? apiSrvConst.BATCH_GET_APP_AND_VER : apiSrvConst.BATCH_GET_APP_AND_FULL_VER;
  }
  const finalInterfaceName = `${interfaceName}${jsonpMark}`;

  const finalApiPath = apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
  url = `${apiHost}${finalApiPath}/${finalInterfaceName}?name=${urlAppName}`;
  if (userName) {
    url += `&userName=${userName}`;
  }
  if (urlVersion) {
    url += `&version=${urlVersion}`;
  }
  if (urlProjId) {
    url += `&projId=${urlProjId}`;
  }
  if (apiSuffix) {
    url += apiSuffix;
  }

  return { url, userName };
}

export async function prepareUnpkgPlatRequestInfo(appName: string, getOptions: IHelGetOptions) {
  const { versionId, platform, loadOptions } = getOptions;
  const apiHost = loadOptions?.apiPrefix || getPlatformHost(platform);
  const url = await getUnpkgUrl(apiHost, appName, versionId || '', loadOptions?.skip404Sniff);
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
    const reply = await executeGet(custUrl || url, { apiMode: custApiMode || apiMode, platform: targetPlatform });
    if (0 !== parseInt(reply.code) || !reply) {
      throw new Error(reply.msg);
    }
    return { app: ensureApp(reply.data.app), version: ensureVersion(reply.data.version) };
  };

  if (getFn) {
    const data = (await Promise.resolve(getFn({ platform: targetPlatform, appName, userName, versionId, url, innerRequest }))) as {
      app: ISubApp;
      version: ISubAppVersion;
    };
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
  if (0 !== parseInt(code) || !data) {
    throw new Error(msg || 'ver not found');
  }

  const versionData = ensureVersion(data);
  return versionData;
}

/**
 * 获取子应用版本详情 { platform, apiMode, appName: appVersion.sub_app_name }
 */
export async function batchGetSubAppAndItsVersion(appNames: string[], getOptions: IHelGetOptions) {
  const { apiMode } = getOptions;
  const { url } = await prepareOtherPlatRequestInfo(appNames, getOptions);

  const { data, code, msg } = await executeGet<Array<{ app: ISubApp; version: ISubAppVersion }>>(url, {
    apiMode,
    platform: getDefaultPlatform(getOptions.platform),
  });
  if (0 !== parseInt(code) || !data) {
    throw new Error(msg || 'batch get failed');
  }

  const list = data.map((item) => ({ app: ensureApp(item.app), version: ensureVersion(item.version) }));

  return list;
}
