import { commonUtil, log } from 'hel-micro-core';
import type { ISubApp, ISubAppVersion } from 'hel-types';
import { getIndexedDB, getLocalStorage } from '../browser/helper';
import storageKeys from '../consts/storageKeys';
import { getPlatform } from '../shared/platform';
import type { GetCacheKey, IHelMeta, IInnerPreFetchOptions, StorageType } from '../types';

interface ICacheData {
  appInfo: ISubApp;
  appVersion: ISubAppVersion;
}

function saveToLocalStorage(cacheKey: string, toSave: IHelMeta) {
  try {
    getLocalStorage().setItem(cacheKey, JSON.stringify(toSave));
  } catch (err: any) {
    log(`save localStorage failed: ${err.message}`);
  }
}

/**
 * 获取缓存应用元数据的key
 */
export function getAppCacheKey(appName: string, platform?: string) {
  const innerKey = `${storageKeys.LS_CACHE_APP_PREFIX}.${getPlatform(platform)}.${appName}`;
  return innerKey;
}

/**
 * 获取缓存的应用元数据
 */
export async function getCachedAppMeta(
  appName: string,
  options?: { platform?: string; cacheKey?: string; storageType?: StorageType },
): Promise<IHelMeta | null> {
  const { platform, cacheKey, storageType = 'indexedDB' } = options || {};
  const appCacheKey = cacheKey || getAppCacheKey(appName, platform);
  try {
    if (storageType === 'indexedDB') {
      const indexedDBStorage = getIndexedDB();
      if (indexedDBStorage) {
        const appCache = await indexedDBStorage.getItem<IHelMeta>(appCacheKey);
        return appCache;
      }
    }
    const appCacheStr = getLocalStorage().getItem(appCacheKey);
    return commonUtil.safeParse(appCacheStr || '', null);
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

export function innerGetAppCacheKey(appName: string, getCacheKey?: GetCacheKey, platform?: string) {
  const innerKey = getAppCacheKey(appName, platform);
  const key = getCacheKey?.({ appName, innerKey }) || innerKey;
  return key;
}

export async function innerGetDiskCachedApp(appName: string, options: IInnerPreFetchOptions): Promise<ICacheData | null> {
  const { getCacheKey, storageType, platform } = options;
  const cacheKey = innerGetAppCacheKey(appName, getCacheKey, platform);
  const meta = await getCachedAppMeta(appName, { platform, cacheKey, storageType });
  if (meta) {
    return { appInfo: meta.app, appVersion: meta.version };
  }
  return null;
}

export function innerSaveMetaToDisk(cacheKey: string, toSave: IHelMeta, storageType?: StorageType) {
  const isSaveToIndexedDB = storageType === 'indexedDB';
  if (!isSaveToIndexedDB) {
    return saveToLocalStorage(cacheKey, toSave);
  }

  const indexedDBStorage = getIndexedDB();
  if (!indexedDBStorage) {
    return saveToLocalStorage(cacheKey, toSave);
  }

  indexedDBStorage.setItem(cacheKey, toSave).catch((err: any) => {
    log(`save indexeddb failed, use localStorage instead, err: ${err.message}`);
    saveToLocalStorage(cacheKey, toSave);
  });
}
