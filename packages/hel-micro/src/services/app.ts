import * as core from 'hel-micro-core';
import type { ApiMode, ISubApp, ISubAppVersion, Platform } from 'hel-types';
import * as alt from '../alternative';
import { loadAppAssets } from '../browser';
import { getIndexedDB, getLocalStorage } from '../browser/helper';
import defaults from '../consts/defaults';
import storageKeys from '../consts/storageKeys';
import { getPlatform } from '../shared/platform';
import { isEmitVerMatchInputVer } from '../shared/util';
import type { IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList } from '../util';
import type { IHelGetOptions } from './api';
import * as apiSrv from './api';
import { getCustomMeta, isCustomValid } from './custom';

const { commonUtil, helConsts } = core;
const { KEY_ASSET_CTX } = helConsts;

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

const inner = {
  recordAssetCtx(appInfo: ISubApp, appVersion: ISubAppVersion, options: IInnerPreFetchOptions) {
    const { name, app_group_name } = appInfo;
    const { src_map: srcMap, sub_app_version: ver } = appVersion;
    const { chunkCssSrcList = [], chunkJsSrcList = [] } = srcMap;
    const fn = alt.getHookFn(options, 'beforeAppendAssetNode');
    const assetList = chunkCssSrcList.concat(chunkJsSrcList);
    const { platform } = options;

    // 记录资源映射的 配置上下文数据，方便以下作用
    // 1 记录 beforeAppendAssetNode 句柄引用，方便 patchAppendChild 逻辑里做追加的资源替换
    // 2 记录资源不能加载情况，方便 patchAppendChild 逻辑里，不追加资源到 document，用于拦截 webpack 异步加载的资源（目前只对css有效）
    assetList.forEach((url) => {
      const urlData = core.getCommonData(KEY_ASSET_CTX, url) || {};
      if (!urlData.marked) {
        Object.assign(urlData, {
          marked: true,
          platform,
          groupName: app_group_name,
          name,
          ver,
          beforeAppend: fn,
        });
        core.setCommonData(KEY_ASSET_CTX, url, urlData);
      }
    });
  },

  tryTriggerOnFetchMetaSuccess(
    appInfo: ISubApp,
    appVersion: ISubAppVersion,
    options: { fromFallback: boolean; loadOptions: IInnerPreFetchOptions },
  ) {
    const { loadOptions, fromFallback } = options;
    const fn = alt.getHookFn(loadOptions, 'onFetchMetaSuccess');
    fn?.({ app: appInfo, version: appVersion, fromFallback });
  },
};

function getFallbackHook(options: IInnerPreFetchOptions) {
  const legacyFn = alt.getFn(options.platform, 'onFetchMetaFailed', options.onFetchMetaFailed);
  const newFn = alt.getHookFn(options, 'onFetchMetaFailed');
  return newFn || legacyFn;
}

/**
 * 如果用户未指定 apiMode，或许将来node 环境则一定是 get
 */
function computeApiMode(platform?: Platform, specifiedApiMode?: ApiMode) {
  const { apiMode } = core.getPlatformConfig(platform);
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
  return commonUtil.safeParse(appCacheStr || '', null);
}

export async function clearDiskCachedApp(appName: string) {
  const indexedDBStorage = getIndexedDB();
  if (indexedDBStorage) {
    await indexedDBStorage.removeItem(getAppCacheKey(appName));
  }
  getLocalStorage().removeItem(getAppCacheKey(appName));
}

export async function getAppFromRemoteOrLocal(appName: string, options: IInnerPreFetchOptions, fnOptions?: { callRemote?: boolean }) {
  const {
    enableDiskCache = defaults.ENABLE_DISK_CACHE,
    enableSyncMeta = defaults.ENABLE_SYNC_META,
    versionId = '',
    projectId = '',
    isFullVersion = false,
    custom,
    strictMatchVer,
    semverApi,
  } = options;
  const { callRemote = true } = fnOptions || {};
  const { platform, apiMode } = getPlatformAndApiMode(options.platform, options.apiMode);

  // 调试模式
  if (isCustomValid(custom)) {
    const { app, version } = await getCustomMeta(appName, custom);
    cacheApp(app, { appVersion: version, platform, toDisk: false, loadOptions: options });
    core.setAppPlatform(app.app_group_name, platform);
    return { appInfo: app, appVersion: version };
  }

  const memApp = core.getAppMeta(appName, platform);
  const memAppVersion = core.getVersion(appName, { platform, versionId });

  // 优先从内存获取（非语义化api获取的 memAppVersion 才是有意义的，可进入此逻辑做判断）
  // TODO : semverApi 下沉到 isEmitVerMatchInputVer 里面
  if (
    !semverApi
    && memApp
    && memAppVersion
    && isEmitVerMatchInputVer(appName, { platform, projectId, emitVer: memAppVersion.sub_app_version, inputVer: versionId, strictMatchVer })
  ) {
    return { appInfo: memApp, appVersion: memAppVersion };
  }

  const srcInnerOptions = { platform, apiMode, versionId, projectId, isFullVersion, loadOptions: options };
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
        tryGetFromRemote(enableSyncMeta).catch((err: any) => commonUtil.noop(err));
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
    core.setAppPlatform(mayCachedApp.appInfo.app_group_name, platform);
  }

  return mayCachedApp;
}

async function getAppWithFallback(appName: string, options: IInnerPreFetchOptions): Promise<{ data: ICacheData | null; err: string }> {
  const { isFirstCall = true } = options;
  try {
    const data = await getAppFromRemoteOrLocal(appName, options);
    return { data, err: '' };
  } catch (err: any) {
    // 第一次调用出错，抛上去，让上层再尝试一次
    if (isFirstCall) {
      throw err;
    }
    // 有指定 fallbackHook，返回空结果，让上层触发兜底函数
    if (getFallbackHook(options)) {
      return { data: null, err: err.message };
    }
    // 未指定 fallbackHook，为了尽量让应用能够正常加载，尝试使用硬盘缓存数据，硬盘缓存也无数据就报错
    const data = await getDiskCachedApp(appName, options);
    if (!data) {
      throw err;
    }

    commonUtil.nbalert(`
      ${err.message}, hel-micro will try use cached data to keep your app works well,
      please check your network if this behavior is not as you expected!
    `);
    return { data, err: '' };
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
  appInfo: ISubApp | undefined,
  options: { appVersion?: ISubAppVersion; platform: Platform; toDisk?: boolean; loadOptions: IInnerPreFetchOptions },
) {
  // toDisk 默认是 true
  const { appVersion, platform, toDisk = true, loadOptions } = options;
  if (!appInfo || !appVersion) {
    return;
  }
  let appMeta = appInfo;
  const appName = appMeta.name;
  // 写 disk
  if (toDisk) {
    const saveToLocalStorage = () => {
      try {
        getLocalStorage().setItem(getAppCacheKey(appName), JSON.stringify({ appInfo, appVersion }));
      } catch (err: any) {
        core.log('save localStorage failed');
      }
    };
    if (loadOptions.storageType === 'indexedDB') {
      const indexedDBStorage = getIndexedDB();
      if (indexedDBStorage) {
        indexedDBStorage.setItem(getAppCacheKey(appName), { appInfo, appVersion }).catch((err: any) => {
          core.log(`save indexeddb failed, use localStorage instead, err: ${err.message}`);
          saveToLocalStorage();
        });
      } else {
        saveToLocalStorage();
      }
    } else {
      saveToLocalStorage();
    }
  }

  // 写 mem app
  if (loadOptions.semverApi) {
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
export async function loadApp(appName: string, loadOptions: IInnerPreFetchOptions = {}): Promise<(() => void) | null> {
  const { isFirstCall = true, controlLoadAssets = false, platform, versionId = '' } = loadOptions;

  try {
    const { data, err } = await getAppWithFallback(appName, loadOptions);
    let { appInfo, appVersion } = data || {};
    const noMeta = !appInfo || !appVersion;
    let fromFallback = false;

    // 尝试读取用户兜底数据
    if (noMeta && !isFirstCall) {
      const fallbackHook = getFallbackHook(loadOptions);
      if (fallbackHook) {
        const meta = await Promise.resolve(fallbackHook({ platform, appName, versionId }));
        if (meta) {
          appInfo = meta.app;
          appVersion = meta.version;
          fromFallback = true;
          cacheApp(appInfo, { appVersion, platform: getPlatform(platform), toDisk: false, loadOptions });
        }
      }
    }

    if (!appInfo) {
      throw new Error(err || `app[${appName}] not exist`);
    }
    if (!appVersion) {
      throw new Error(err || `app[${appName}]'s version[${versionId}] not exist`);
    }
    inner.tryTriggerOnFetchMetaSuccess(appInfo, appVersion, { loadOptions, fromFallback });
    inner.recordAssetCtx(appInfo, appVersion, loadOptions);

    const startLoad = () => {
      loadAppAssets(appInfo as ISubApp, appVersion as ISubAppVersion, loadOptions);
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
      const ret = await loadApp(appName, { ...loadOptions, isFirstCall: false });
      return ret;
    }
    throw new Error(`loadApp [${appName}] err (${err.message}), recommend config onFetchMetaFailed hook`);
  }
}
