import type { ApiMode, ISubApp, ISubAppVersion, Platform } from 'hel-types';
import type { IGetOptions } from './api';
import type { IInnerPreFetchOptions } from '../types';
import * as core from 'hel-micro-core';
import { loadAppAssets } from '../dom';
import * as apiSrv from './api';
import { safeParse, getLocalStorage } from '../util';
import { getPlatformConfig, getPlatform } from '../shared/platform';
import storageKeys from '../consts/storageKeys';
import defaults from '../consts/defaults';


/**
 * 如果用户未指定 apiMode
 * node 环境则一定是 get
 * 强制干预 tnews 平台定制了 apiPathOfApp 为 '/api/subApp' 的请求一定采用 get 来发起请求
 * 此逻辑为了兼容 tnews 平台而存在，是为了保证所有 tnews 上星辰老应用本地调试不报错，不会影响属于 hel 的应用
 */
function computeApiMode(platform?: Platform, specifiedApiMode?: ApiMode) {
  const { apiPathOfApp, apiMode } = getPlatformConfig(platform);
  if (specifiedApiMode) {
    return specifiedApiMode;
  }
  // TODO：del
  if (platform === 'tnews' && apiPathOfApp === '/api/subApp') {
    return 'get';
  }
  return apiMode;
}


function getPlatformAndApiMode(specifiedPlatform?: Platform, specifiedApiMode?: ApiMode) {
  const platform = getPlatform(specifiedPlatform);
  const apiMode = computeApiMode(platform, specifiedApiMode);
  return { platform, apiMode };
}


function getAppCacheKey(appName: string) {
  return `${storageKeys.LS_CACHE_APP_PREFIX}.${appName}`;
}


function getDiskCachedApp(appName: string) {
  const appCacheStr = getLocalStorage().getItem(getAppCacheKey(appName));
  return safeParse(appCacheStr || '', null);
}


/**
 * 尝试获取用户在具体指定了版本号的元数据
 * @param appName
 * @param appVersion
 */
async function tryGetSpecifiedVersion(appVersion: ISubAppVersion, anotherVerId: string, platform: Platform, apiMode: ApiMode) {
  const appName = appVersion.sub_app_name;
  if (anotherVerId) {
    const anotherVersionData = await apiSrv.getSubAppVersion(anotherVerId, { platform, apiMode, appName });
    if (!anotherVersionData) {
      throw new Error(`版本${anotherVerId}不存在`);
    }
    core.setVersion(appName, anotherVersionData);
    return anotherVersionData;
  }
  return appVersion;
}


function tryTriggerOnAppVersionFetched(appVersion: ISubAppVersion, options: any) {
  if (appVersion && typeof options.onAppVersionFetched === 'function') {
    options.onAppVersionFetched(appVersion);
  }
}


async function getAppFromRemoteOrLocal(appName: string, options: IInnerPreFetchOptions) {
  let mayCachedApp: any = null;
  const { enableDiskCache = defaults.ENABLE_DISK_CACHE, versionId = '', isFirstCall } = options;
  const { platform, apiMode } = getPlatformAndApiMode(options.platform, options.apiMode);
  const memApp = core.getAppMeta(appName, platform);
  const memAppVersion = core.getVersion(appName, { platform });

  try {
    // 优先从内存获取
    if (memApp) {
      mayCachedApp = { appInfo: memApp, appVersion: memAppVersion };
      // 允许使用硬盘缓存的情况下，尝试优先从硬盘获取
    } else if (enableDiskCache) {
      mayCachedApp = getDiskCachedApp(appName);
      if (!mayCachedApp) {
        mayCachedApp = await getAndCacheApp(appName, platform, apiMode);
      } else {
        // 将硬盘缓存数据写回到内存
        cacheApp(mayCachedApp.appInfo, mayCachedApp.appVersion, platform, false);
        // 异步缓存一份最新的数据
        getAndCacheApp(appName, platform, apiMode).catch(err => err);
      }

      // 从远端获取
    } else {
      mayCachedApp = await getAndCacheApp(appName, platform, apiMode);
    }

    // 此处记录【应用组名】对应【平台】，仅为了让模块暴露方在使用 exposeLib 接口或 libReady 接口如未显式的指定平台值，
    // 但 preFetch 指定了平台值去拉取模块时，能够自动帮 exposeLib、libReady 推导出模块对应的平台值
    // 但是依然强烈建议给 exposeLib 、libReady 显式指定平台值，避免用户通过 preFetchLib 引入了多平台的同名包体时
    // 出现推导错误的情况出现
    core.setAppPlatform(appName, platform);

    let { appVersion } = mayCachedApp;
    appVersion = await tryGetSpecifiedVersion(appVersion, versionId, platform, apiMode);
    // 拿到的版本可能会被指定了版本号的数据替代
    return { ...mayCachedApp, appVersion };
  } catch (err) {
    // 首次调用直接报错
    // 非首次调用依然出错，为了尽量让应用能够正常加载，尝试使用硬盘缓存数据，硬盘缓存也无数据就报错
    mayCachedApp = getDiskCachedApp(appName);
    if (isFirstCall || !mayCachedApp) {
      throw err;
    }
    return mayCachedApp;
  }
}


export async function getAppAndVersion(appName: string, options: IGetOptions = {}) {
  const { versionId, isFullVersion = false } = options;
  const { platform, apiMode } = getPlatformAndApiMode(options.platform, options.apiMode);
  const { app: appInfo, version: appVersion } = await apiSrv.getSubAppAndItsVersion(
    appName,
    { versionId, platform, apiMode, isFullVersion },
  );
  if (!appVersion) {
    throw new Error(`版本${appInfo.online_version}不存在`);
  }
  return { appInfo, appVersion };
}


export function cacheApp(appInfo: ISubApp, appVersion: ISubAppVersion, platform: Platform, toDisk = true) {
  const appName = appInfo.name;
  // 写 disk
  if (toDisk) {
    getLocalStorage().setItem(getAppCacheKey(appName), JSON.stringify({ appInfo, appVersion }));
  }

  // 写 mem
  core.setAppMeta(appInfo, platform);
  core.setVersion(appName, appVersion, { platform });
}


export async function getAndCacheApp(appName: string, platform: Platform, apiMode: ApiMode) {
  const ret = await getAppAndVersion(appName, { platform, apiMode });
  const { appInfo, appVersion } = ret;
  cacheApp(appInfo, appVersion, platform);
  return ret;
}


/**
 * 加载应用的入口函数，先获取元数据，再加载资源
 */
export async function loadApp(appName: string, options: IInnerPreFetchOptions = {}): Promise<(() => void) | null> {
  const { isFirstCall = true, controlLoadAssets = false } = options;

  try {
    const { appInfo, appVersion } = await getAppFromRemoteOrLocal(appName, options);
    if (!appInfo) {
      throw new Error(`应用${appName}不存在`);
    }
    if (!appVersion) {
      throw new Error(`应用${appName}的版本不存在`);
    }
    tryTriggerOnAppVersionFetched(appVersion, options);

    const startLoad = () => {
      const appendCss = options.appendCss ?? true;
      loadAppAssets(appInfo, appVersion, { useAdditionalScript: false, appendCss });
    };

    // !!! 需要人工控制开始加载资源的时机
    if (controlLoadAssets) {
      return startLoad;
    } else {
      startLoad();
      return null;
    }
  } catch (err) {
    if (isFirstCall) {
      console.error('loadApp err and try one more time: ', err);
      const ret = await loadApp(appName, { ...options, isFirstCall: false });
      return ret;
    } else {
      throw err;
    }
  }
}
