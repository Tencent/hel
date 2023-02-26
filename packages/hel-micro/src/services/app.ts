import { loadAppAssets } from '../browser';
import { getIndexedDB, getLocalStorage } from '../browser/helper';
import defaults from '../consts/defaults';
import { PLAT_UNPKG } from '../consts/logic';
import storageKeys from '../consts/storageKeys';
import * as core from '../deps/helMicroCore';
import type { ApiMode, ISubApp, ISubAppVersion, Platform } from '../deps/helTypes';
import { getPlatform, getPlatformConfig } from '../shared/platform';
import { isCustomValid, isEmitVerMatchInputVer } from '../shared/util';
import type { IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList, getCustomMeta, noop, safeParse } from '../util';
import type { IHelGetOptions } from './api';
import * as apiSrv from './api';

interface ISrvInnerOptions {
  platform: Platform;
  apiMode: ApiMode;
  versionId: string;
  loadOptions: IInnerPreFetchOptions;
}

interface ICacheData {
  appInfo: ISubApp;
  appVersion: ISubAppVersion;
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

async function getDiskCachedApp(appName: string, options: IInnerPreFetchOptions): Promise<ICacheData | null> {
  if (options.storageType === 'indexedDB') {
    const indexedDBStorage = getIndexedDB();
    if (indexedDBStorage) {
      const appCache = await indexedDBStorage.getItem<ICacheData>(getAppCacheKey(appName));
      return appCache;
    }
  }
  const appCacheStr = getLocalStorage().getItem(getAppCacheKey(appName));
  return safeParse(appCacheStr || '', null);
}

export async function clearDiskCachedApp(appName: string) {
  const indexedDBStorage = getIndexedDB();
  if (indexedDBStorage) {
    await indexedDBStorage.removeItem(getAppCacheKey(appName));
  }
  getLocalStorage().removeItem(getAppCacheKey(appName));
}

function tryTriggerOnAppVersionFetched(appVersion: ISubAppVersion, options: any) {
  if (appVersion && typeof options.onAppVersionFetched === 'function') {
    options.onAppVersionFetched(appVersion);
  }
}

export async function getAppFromRemoteOrLocal(appName: string, options: IInnerPreFetchOptions, fnOptions?: { callRemote?: boolean }) {
  const {
    enableDiskCache = defaults.ENABLE_DISK_CACHE,
    enableSyncMeta = defaults.ENABLE_SYNC_META,
    versionId = '',
    projectId = '',
    custom,
  } = options;
  const { callRemote = true } = fnOptions || {};
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

  const srcInnerOptions = { platform, apiMode, versionId, projectId, loadOptions: options };
  // 优先从内存获取
  if (
    platform !== PLAT_UNPKG
    && memApp
    && memAppVersion
    && isEmitVerMatchInputVer(appName, { platform, projectId, emitVer: memAppVersion.sub_app_version, inputVer: versionId })
  ) {
    return { appInfo: memApp, appVersion: memAppVersion };
  }

  let mayCachedApp: ICacheData | null = null;
  const tryGetFromRemote = async (allowGet: boolean) => {
    if (allowGet) {
      const remoteApp = await getAndCacheApp(appName, srcInnerOptions);
      return remoteApp;
    }
    return null;
  };

  // 允许使用硬盘缓存的情况下，尝试优先从硬盘获取
  if (enableDiskCache) {
    mayCachedApp = await getDiskCachedApp(appName, options);
    if (!mayCachedApp) {
      mayCachedApp = await tryGetFromRemote(callRemote);
    } else {
      const { appInfo, appVersion } = mayCachedApp;

      // 缓存无效，从远端获取，（注：enableDiskCache = true 情况下，未指定 versionId 时，总是相信本地缓存是最新的）
      if (versionId && appVersion.sub_app_version !== versionId) {
        mayCachedApp = await tryGetFromRemote(callRemote);
      } else {
        // 将硬盘缓存数据写回到内存
        cacheApp(appInfo, { appVersion, platform, toDisk: false, loadOptions: options });
        // 异步缓存一份最新的数据
        tryGetFromRemote(enableSyncMeta).catch((err: any) => noop(err));
      }
    }

    // 从远端获取
  } else {
    mayCachedApp = await tryGetFromRemote(callRemote);
  }

  // 此处记录【应用组名】对应【平台】，仅为了让模块暴露方在使用 exposeLib 接口或 libReady 接口如未显式的指定平台值，
  // 但 preFetch 指定了平台值去拉取模块时，能够自动帮 exposeLib、libReady 推导出模块对应的平台值
  // 但是依然强烈建议给 exposeLib 、libReady 显式指定平台值，避免用户通过 preFetchLib 引入了多平台的同名包体时
  // 出现推导错误的情况出现
  if (mayCachedApp) {
    core.setAppPlatform(appName, platform);
  }

  return mayCachedApp;
}

async function getAppFromRemoteOrLocalWithFallback(appName: string, options: IInnerPreFetchOptions) {
  const { isFirstCall = true } = options;
  try {
    const mayCachedApp = await getAppFromRemoteOrLocal(appName, options);
    return mayCachedApp;
  } catch (err: any) {
    // 第一次调用出错，抛上去，让上层再尝试一次
    if (isFirstCall) {
      throw err;
    }
    // 有指定 fallbackHook，返回空结果，让上层触发兜底函数
    if (getFallbackHook(options)) {
      return { appInfo: null, appVersion: null };
    }
    // 未指定 fallbackHook，为了尽量让应用能够正常加载，尝试使用硬盘缓存数据，硬盘缓存也无数据就报错
    const mayCachedApp = await getDiskCachedApp(appName, options);
    if (!mayCachedApp) {
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
    throw new Error('no version found or builded');
  }
  return { appInfo, appVersion };
}

export function cacheApp(
  appInfo: ISubApp,
  options: { appVersion: ISubAppVersion; platform: Platform; toDisk?: boolean; loadOptions: IInnerPreFetchOptions },
) {
  // toDisk 默认是 true
  const { appVersion, platform, toDisk = true, loadOptions } = options;
  let appMeta = appInfo;
  const appName = appMeta.name;
  // 写 disk
  if (toDisk) {
    const saveToLocalStorage = () => {
      getLocalStorage().setItem(getAppCacheKey(appName), JSON.stringify({ appInfo, appVersion }));
    };
    if (loadOptions.storageType === 'indexedDB') {
      const indexedDBStorage = getIndexedDB();
      if (indexedDBStorage) {
        indexedDBStorage.setItem(getAppCacheKey(appName), { appInfo, appVersion });
      } else {
        saveToLocalStorage();
      }
    } else {
      saveToLocalStorage();
    }
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
    const appData = await getAppFromRemoteOrLocalWithFallback(appName, options);
    let { appInfo, appVersion } = appData || {};
    const noMeta = !appInfo || !appVersion;

    // 尝试读取用户兜底数据
    if (noMeta && !isFirstCall) {
      const fallbackHook = getFallbackHook(options);
      if (fallbackHook) {
        const meta = await Promise.resolve(fallbackHook({ appName }));
        if (meta) {
          appInfo = meta.app;
          appVersion = meta.version;
          cacheApp(appInfo, { appVersion, platform: getPlatform(options.platform), toDisk: false, loadOptions: options });
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
    }
    startLoad();
    return null;
  } catch (err: any) {
    if (isFirstCall) {
      console.error('loadApp err and try one more time: ', err);
      const ret = await loadApp(appName, { ...options, isFirstCall: false });
      return ret;
    }
    throw new Error(`loadApp err: ${err.message}, recommend config onAppVersionFetched hook`);
  }
}
