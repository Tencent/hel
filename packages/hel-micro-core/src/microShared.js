/** @typedef {typeof import('./consts').HEL_LOAD_STATUS} HelLoadStatusType */
/** @typedef {HelLoadStatusType[keyof HelLoadStatusType]} HelLoadStatusEnum */
import { DEFAULT_API_URL, DEFAULT_PLAT, PLAT_HEL, PLAT_UNPKG } from './consts';
import * as diffBase from './diff/base';
import { getJsRunLocation, safeGetMap, setLogFilter, setLogMode } from './util';
import { getHelSingletonHost } from './utilBase';

export function makeCacheNode(platform) {
  /** @type {import('../index').SharedCache} */
  const cacheNode = {
    isConfigOverwrite: false,
    platform,
    initPack: diffBase.PACK_MODE,
    appName2Comp: {},
    appName2Lib: {},
    appName2isLibAssigned: {},
    appName2EmitApp: {},
    appName2verLoadStatus: {},
    appName2verEmitLib: {},
    appName2verEmitApp: {},
    appName2verStyleStr: {},
    appName2verStyleFetched: {},
    appName2verExtraCssList: {},
    appName2verAppVersion: {},
    appName2app: {},
    appName2appVersion: {},
    appName2styleStr: {},
    appGroupName2firstVer: {},
    isP0InitCalled: false,
    // below properties can be overwrite for user custom platform
    apiPrefix: '', // 必须
    strictMatchVer: true,
    apiMode: 'jsonp',
    apiSuffix: '',
    apiPathOfApp: DEFAULT_API_URL,
    apiPathOfAppVersion: '',
    getApiPrefix: null,
    getSubAppAndItsVersionFn: null,
    userLsKey: '',
    getUserName: null,
    onFetchMetaFailed: null,
    shouldUseGray: null,
  };
  return cacheNode;
}

function makeEventBus() {
  /** @type {Record<string, any[]>} */
  const name2listeners = {};
  return {
    on: (eventName, cb) => {
      let listeners = name2listeners[eventName];
      if (!listeners) {
        const arr = [];
        name2listeners[eventName] = arr;
        listeners = arr;
      }
      listeners.push(cb);
    },
    emit: (eventName, ...args) => {
      const listeners = name2listeners[eventName];
      if (listeners) {
        const listenersCopy = listeners.slice();
        listenersCopy.forEach((cb) => cb(...args));
      }
    },
    off: (eventName, cb) => {
      const listeners = name2listeners[eventName];
      if (listeners) {
        for (let i = 0, len = listeners.length; i < len; i++) {
          const cbItem = listeners[i];
          if (cbItem === cb) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    },
  };
}

function makeHelMicroShared() {
  const helCache = makeCacheNode(PLAT_HEL);
  const unpkgCache = makeCacheNode(PLAT_UNPKG);
  const cacheRoot = {
    /** 默认的平台值 */
    platform: DEFAULT_PLAT,
    /** 1.4+ 新增，用于记录 preFetchLib 时显示传递了 platform 值，供 hel-lib-proxy 使用，
     * 方便多平台共同加载包体场景下， exposeLib 接口如果未显式的传递平台值，能尽量正确推测出应用对应的 platform 值
     * 但是这里依然推荐用户 exposeLib 传递具体的平台值，避免推测错误
     */
    appName2platform: {},
    /** 取代 appName2platform，后续 appName2platform 会移出 */
    appGroupName2platform: {},
    /** @type {Record<string, ReturnType<typeof makeCacheNode>>} */
    caches: {
      [PLAT_HEL]: helCache,
      [PLAT_UNPKG]: unpkgCache,
    },
  };

  const innerEventBus = makeEventBus();
  const userEventBus = makeEventBus();
  return {
    createFeature: getJsRunLocation(),
    eventBus: innerEventBus,
    userEventBus,
    cacheRoot,
    /** 指向的是  cacheRoot.caches.unpkg ，放第一层仅用于方便控制台查看，实际业务逻辑还是走 caches 去取 */
    unpkgCache,
    /** 指向的是  cacheRoot.caches.hel ，放第一层仅用于方便控制台查看，实际业务逻辑还是走 caches 去取 */
    helCache,
    /** 调试相关函数 */
    dev: {
      setLogMode,
      setLogFilter,
    },
  };
}

export function ensureHelMicroShared() {
  let helMicroShared = getHelMicroShared();
  if (helMicroShared) {
    const cacheRoot = helMicroShared.cacheRoot;
    safeGetMap(cacheRoot, 'appGroupName2platform');

    // 兼容线上老版本包，遍历 caches 做检测子节点数据结构并补齐
    const caches = cacheRoot.caches;
    Object.keys(caches).forEach((key) => {
      const cacheNode = caches[key];
      safeGetMap(cacheNode, 'appGroupName2firstVer');
      safeGetMap(cacheNode, 'appName2verExtraCssList');
    });

    // 补齐老包缺失的 userEventBus 对象
    if (!helMicroShared.userEventBus) {
      helMicroShared.userEventBus = makeEventBus();
    }
    return;
  }

  helMicroShared = makeHelMicroShared();
  getHelSingletonHost().__HEL_MICRO_SHARED__ = helMicroShared;
}

/** @return {ReturnType<typeof makeHelMicroShared>} */
export function getHelMicroShared() {
  return getHelSingletonHost().__HEL_MICRO_SHARED__;
}
