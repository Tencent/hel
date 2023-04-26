import { getGlobalThis } from 'hel-micro-core';
import storageKeys from '../consts/storageKeys';
import type { AssetUrlType } from '../types';
import { getIndexedDBFactory, IndexedDBStorage } from './indexeddb';

function isRelativePath(path: string) {
  if (path.startsWith('//')) return false;
  return path.startsWith('/') || path.startsWith('./') || path.startsWith('../');
}

export function getAssetUrlType(webDirPath: string, url: string): AssetUrlType {
  if (url.startsWith(webDirPath)) {
    return 'build'; // 是构建生成的 css 文件
  }
  if (isRelativePath(url)) {
    return 'relative';
  }
  return 'static';
}

export function getIndexedDB() {
  if (!getIndexedDBFactory()) return null;

  const indexedDBIns = new IndexedDBStorage({
    name: storageKeys.DATABASE_NAME,
    storeName: storageKeys.STORE_NAME,
  });

  function setItem<T extends any = any>(key: string, value: T) {
    return indexedDBIns.setItem<T>(key, value);
  }

  function getItem<T extends any = any>(key: string) {
    return indexedDBIns.getItem<T>(key);
  }

  function removeItem<T extends any = any>(key: string) {
    return indexedDBIns.removeItem<T>(key);
  }

  return {
    getItem,
    setItem,
    removeItem,
  };
}

// avoid mock js-dom warn:
// [DOMException [SecurityError]: localStorage is not available for opaque origins]
export function getLocalStorage() {
  // prettier-ignore
  const mockStorage = { getItem() { }, setItem() { }, removeItem() { } };
  try {
    const storage = getGlobalThis()?.localStorage;
    return storage || mockStorage;
  } catch (err: any) {
    return mockStorage;
  }
}
