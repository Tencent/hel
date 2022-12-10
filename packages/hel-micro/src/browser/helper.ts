import { getGlobalThis } from 'hel-micro-core';
import storageKeys from '../consts/storageKeys';
import { getIndexedDBFactory, IndexedDBStorage } from './indexeddb';

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

  return {
    getItem,
    setItem,
  };
}

// avoid mock js-dom warn:
// [DOMException [SecurityError]: localStorage is not available for opaque origins]
export function getLocalStorage() {
  // prettier-ignore
  const mockStorage = { getItem() { }, setItem() { } };
  try {
    const storage = getGlobalThis()?.localStorage;
    return storage || mockStorage;
  } catch (err: any) {
    return mockStorage;
  }
}
