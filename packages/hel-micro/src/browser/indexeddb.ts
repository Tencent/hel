/**
 * 本代码实现参考localforage库：https://localforage.github.io/localForage/#localforage
 */
import { commonUtil, getGlobalThis } from 'hel-micro-core';

interface IOptions {
  name: string;
  storeName: string;
  version?: number;
}

interface IDbInfo {
  db: IDBDatabase | null;
  name: string;
  storeName: string;
  version: number;
}

// 保存db实例
const dbContexts: Record<string, IDbInfo> = {};

/**
 * 创建 dbcontext
 * @returns
 */
function createContext(): IDbInfo {
  return {
    db: null,
    name: '',
    storeName: '',
    version: 1,
  };
}

/**
 * 获取indexedDB，若浏览器不支持则打印警告并返回 null
 * @returns
 */
export function getIndexedDBFactory() {
  if (!('indexedDB' in getGlobalThis())) {
    console.warn('The current browser is not support indexedDB!');
    return null;
  }
  return getGlobalThis().indexedDB;
}

export class IndexedDBStorage {
  dbInfo: IDbInfo = createContext();
  ready: Promise<IDbInfo> | null = null;

  constructor(options: IOptions) {
    this.initStorage(options);
  }

  initStorage(options: IOptions) {
    const indexedDB = getIndexedDBFactory();
    if (!indexedDB) return;

    let initResolve: any = null;
    let initReject: any = null;
    this.ready = new Promise((resolve, reject) => {
      initResolve = resolve;
      initReject = reject;
    });

    const { dbInfo } = this;
    if (options) {
      const { name, storeName, version } = options;
      Object.assign(dbInfo, commonUtil.purify({ name, storeName, version }));
    }
    let dbContext = dbContexts[dbInfo.name];
    if (!dbContext) {
      dbContext = createContext();
      dbContexts[dbInfo.name] = dbContext;
    }
    dbInfo.db = dbContext.db;

    // 是否升级
    const isUpgrade = this.isUpgradeNeeded(dbInfo);

    if (dbInfo.db) {
      if (isUpgrade) {
        // 升级前关闭原来打开的
        dbInfo.db.close();
      } else {
        initResolve(dbInfo);
        return;
      }
    }

    const dbArgs: [string, number | undefined] = [dbInfo.name, undefined];
    if (isUpgrade) {
      dbArgs[1] = dbInfo.version;
    }

    // 打开数据库
    const openreq: IDBOpenDBRequest = indexedDB.open.apply(indexedDB, dbArgs);

    if (isUpgrade) {
      // 如果升级则监听 onupgradeneeded 事件
      openreq.onupgradeneeded = function (e) {
        dbContext.db = openreq.result;
        dbInfo.db = openreq.result;
        try {
          // 创建 ojectStore(只能在 onupgradeneeded 事件中创建)
          dbInfo.db.createObjectStore(dbInfo.storeName);
        } catch (err: any) {
          // storeName 可能重复
          if (err.name === 'ConstraintError') {
            const tip = commonUtil.nbstr(`
              The database "${dbInfo.name}"
              has been upgraded from version ${e.oldVersion} to version ${e.newVersion},
              but the storage "${dbInfo.storeName}" already exists.`);
            console.warn(tip);
          } else {
            throw err;
          }
        }
      };
    }

    openreq.onerror = function () {
      initReject(openreq.error);
    };

    openreq.onsuccess = function () {
      dbInfo.db = openreq.result;
      dbContext.db = openreq.result;

      dbInfo.db.onversionchange = function (e) {
        (e.target as IDBDatabase).close();
      };

      initResolve(dbInfo);
    };
  }

  /**
   * 判断是否升级
   * @param dbInfo
   * @returns
   */
  isUpgradeNeeded(dbInfo: IDbInfo) {
    if (!dbInfo.db) return true;

    // 是否有新的 objectStore
    const isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    // 是否降低版本
    const isDowngrade = dbInfo.version < dbInfo.db.version;
    // 是否升级版本
    const isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
      // 对于降低版本给予提示，并继续采用之前的版本
      console.warn(`The database "${dbInfo.name}" can't be downgraded from version ${dbInfo.db.version} to version ${dbInfo.version}`);
      dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
      // 有新的 objectStore 则升级版本
      if (isNewStore) {
        const incVersion = dbInfo.db.version + 1;
        if (incVersion > dbInfo.version) {
          dbInfo.version = incVersion;
        }
      }

      return true;
    }

    return false;
  }

  async getObjectStore(mode?: IDBTransactionMode): Promise<IDBObjectStore> {
    const dbInfo = await this.getDbInfo();
    const { name, db, storeName } = dbInfo;
    if (!db) {
      throw new Error(`get ${storeName} objectStore failed in ${name} database`);
    }
    const objectStore = db.transaction(storeName, mode || 'readonly').objectStore(storeName);
    return objectStore;
  }

  attachHandler(req: IDBRequest, resolve: any, reject: any) {
    req.onsuccess = () => {
      resolve(req.result || null);
    };
    req.onerror = () => {
      reject(req.error);
    };
  }

  getItem<Value extends any = any>(key: string) {
    return new Promise<Value | null>((resolve, reject) => {
      this.getObjectStore()
        .then((objectStore) => {
          const req = objectStore.get(key);
          this.attachHandler(req, resolve, reject);
        })
        .catch(reject);
    });
  }

  setItem<T extends any = any>(key: string, value: T) {
    return new Promise<T>((resolve, reject) => {
      this.getObjectStore('readwrite')
        .then((objectStore) => {
          const req = objectStore.put(value, key);
          this.attachHandler(req, resolve, reject);
        })
        .catch(reject);
    });
  }

  removeItem<T extends any = any>(key: string) {
    return new Promise<T>((resolve, reject) => {
      this.getObjectStore('readwrite')
        .then((objectStore) => {
          const req = objectStore.delete(key);
          this.attachHandler(req, resolve, reject);
        })
        .catch(reject);
    });
  }

  getDbInfo() {
    if (!this.ready) {
      return Promise.reject('forget init');
    }
    return this.ready;
  }
}
