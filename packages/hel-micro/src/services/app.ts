import * as core from 'hel-micro-core';
import type { ApiMode, ISubApp, ISubAppVersion, Platform } from 'hel-types';
import defaults from '../consts/defaults';
import { PLAT_UNPKG } from '../consts/logic';
import storageKeys from '../consts/storageKeys';
import { loadAppAssets } from '../dom';
import { getPlatform, getPlatformConfig } from '../shared/platform';
import { isCustomValid, isEmitVerMatchInputVer } from '../shared/util';
import type { IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList, getCustomMeta, getLocalStorage, noop, safeParse } from '../util';
import type { IHelGetOptions } from './api';
import * as apiSrv from './api';

interface ISrvInnerOptions {
  platform: Platform;
  apiMode: ApiMode;
  versionId: string;
  loadOptions: IInnerPreFetchOptions;
}

function getFallbackHook(options: IInnerPreFetchOptions) {
  const conf = core.getPlatformConfig(options.platform);
  const fallbackHook = options.onFetchMetaFailed || conf.onFetchMetaFailed;
  return fallbackHook;
}

/**
 * 如果用户未指定 apiMode，或许将来node 环境则一定是 get
 */
function computeApiMode(platform?: Platform, specifiedApiMode?: ApiMode) {
  const { apiMode } = getPlatformConfig(platform);
  if (specifiedApiMode) {
    return specifiedApiMode;
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

function tryTriggerOnAppVersionFetched(appVersion: ISubAppVersion, options: any) {
  if (appVersion && typeof options.onAppVersionFetched === 'function') {
    options.onAppVersionFetched(appVersion);
  }
}

async function getAppFromRemoteOrLocal(appName: string, options: IInnerPreFetchOptions) {
  let mayCachedApp: any = null;
  const { enableDiskCache = defaults.ENABLE_DISK_CACHE, versionId = '', projectId = '', isFirstCall = true, custom } = options;
  const { platform, apiMode } = getPlatformAndApiMode(options.platform, options.apiMode);

  // 调试模式
  if (isCustomValid(custom)) {
    const { host } = custom;
    const { app, version } = await getCustomMeta(appName, host);
    cacheApp(app, { appVersion: version, platform, toDisk: false, loadOptions: options });
    return { appInfo: app, appVersion: version };
  }

  const memApp = core.getAppMeta(appName, platform);
  const memAppVersion = core.getVersion(appName, { platform });
  // memAppVersion.sub_app_version

  try {
    const srcInnerOptions = { platform, apiMode, versionId, projectId, loadOptions: options };
    // 优先从内存获取
    if (
      platform !== PLAT_UNPKG
      && memApp
      && memAppVersion
      && isEmitVerMatchInputVer(appName, { platform, projectId, emitVer: memAppVersion.sub_app_version, inputVer: versionId })
    ) {
      mayCachedApp = { appInfo: memApp, appVersion: memAppVersion };

      // 允许使用硬盘缓存的情况下，尝试优先从硬盘获取
    } else if (enableDiskCache) {
      mayCachedApp = getDiskCachedApp(appName);
      if (!mayCachedApp) {
        mayCachedApp = await getAndCacheApp(appName, srcInnerOptions);
      } else {
        const { appInfo, appVersion } = mayCachedApp;

        // 缓存无效，从远端获取，（注：enableDiskCache = true 情况下，未指定 versionId 时，总是相信本地缓存是最新的）
        if (versionId && appVersion.sub_app_version !== versionId) {
          mayCachedApp = await getAndCacheApp(appName, srcInnerOptions);
        } else {
          // 将硬盘缓存数据写回到内存
          cacheApp(appInfo, { appVersion: appVersion, platform, toDisk: false, loadOptions: options });
          // 异步缓存一份最新的数据
          getAndCacheApp(appName, srcInnerOptions).catch((err) => noop(err));
        }
      }

      // 从远端获取
    } else {
      mayCachedApp = await getAndCacheApp(appName, srcInnerOptions);
    }

    // 此处记录【应用组名】对应【平台】，仅为了让模块暴露方在使用 exposeLib 接口或 libReady 接口如未显式的指定平台值，
    // 但 preFetch 指定了平台值去拉取模块时，能够自动帮 exposeLib、libReady 推导出模块对应的平台值
    // 但是依然强烈建议给 exposeLib 、libReady 显式指定平台值，避免用户通过 preFetchLib 引入了多平台的同名包体时
    // 出现推导错误的情况出现
    core.setAppPlatform(appName, platform);

    return mayCachedApp;
  } catch (err: any) {
    // 指定了具体版本但未获取到，上层有指定 fallbackHook，则报错让上层处理
    if (err.message.includes('ver not found') && getFallbackHook(options)) {
      if (isFirstCall) {
        throw err;
      }
      return { appInfo: null, appVersion: null };
    }
    // 首次调用直接报错
    // 非首次调用依然出错，为了尽量让应用能够正常加载，尝试使用硬盘缓存数据，硬盘缓存也无数据就报错
    mayCachedApp = getDiskCachedApp(appName);
    if (isFirstCall || !mayCachedApp) {
      throw err;
    }
    return mayCachedApp;
  }
}

export async function getAppAndVersion(appName: string, options: IHelGetOptions) {
  const { platform, apiMode } = getPlatformAndApiMode(options.platform, options.apiMode);
  const fixedOptions = { ...options, platform, apiMode };
  const { app: appInfo, version: appVersion } = await apiSrv.getSubAppAndItsVersion(appName, fixedOptions);
  if (!appVersion) {
    throw new Error(`ver ${appInfo.online_version} not found`);
  }
  return { appInfo, appVersion };
}

export function cacheApp(
  appInfo: ISubApp,
  options: { appVersion: ISubAppVersion; platform: Platform; toDisk?: boolean; loadOptions: IInnerPreFetchOptions },
) {
  const { appVersion, platform, toDisk = true, loadOptions } = options;
  let appMeta = appInfo;
  const appName = appMeta.name;
  // 写 disk
  if (toDisk) {
    getLocalStorage().setItem(getAppCacheKey(appName), JSON.stringify({ appInfo, appVersion }));
  }

  // 写 mem app
  if (platform === PLAT_UNPKG) {
    const meta = core.getAppMeta(appName, platform);
    // @ts-ignore, inject __setByLatest
    if (meta?.__setByLatest !== true) {
      // @ts-ignore, inject __setByLatest，确保未设置版本好的调用写入 appMeta 后，后续其他版本的调用不在写入新的 appMeta
      appMeta = !loadOptions.versionId ? { ...appMeta, __setByLatest: true } : appMeta;
      core.setAppMeta(appMeta, platform);
    }
  } else {
    core.setAppMeta(appInfo, platform);
  }

  // 写 mem version
  core.setVersion(appName, appVersion, { platform });

  // 记录sdk注入的额外样式
  const cssList = getAllExtraCssList(loadOptions);
  core.setVerExtraCssList(appName, cssList, { platform, versionId: appVersion.sub_app_version });
}

export async function getAndCacheApp(appName: string, options: ISrvInnerOptions) {
  const { platform, loadOptions } = options;
  const ret = await getAppAndVersion(appName, options);
  const { appInfo, appVersion } = ret;
  cacheApp(appInfo, { appVersion, platform, loadOptions });
  return ret;
}

/**
 * 加载应用的入口函数，先获取元数据，再加载资源
 */
export async function loadApp(appName: string, options: IInnerPreFetchOptions = {}): Promise<(() => void) | null> {
  const { isFirstCall = true, controlLoadAssets = false } = options;

  try {
    let { appInfo, appVersion } = await getAppFromRemoteOrLocal(appName, options);
    const noMeta = !appInfo || !appVersion;

    // 尝试读取用户兜底数据
    if (noMeta && !isFirstCall) {
      const fallbackHook = getFallbackHook(options);
      if (fallbackHook) {
        const meta = await Promise.resolve(fallbackHook({ appName }));
        if (meta) {
          appInfo = meta.app;
          appVersion = meta.version;
        }
      }
    }

    if (!appInfo) {
      throw new Error(`应用${appName}不存在`);
    }
    if (!appVersion) {
      throw new Error(`应用${appName}的版本不存在`);
    }
    tryTriggerOnAppVersionFetched(appVersion, options);

    const startLoad = () => {
      loadAppAssets(appInfo, appVersion, options);
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
    }
    throw err;
  }
}
