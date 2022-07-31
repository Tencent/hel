/** @typedef {typeof import('./consts').HEL_LOAD_STATUS} HelLoadStatusType */
/** @typedef {HelLoadStatusType[keyof HelLoadStatusType]} HelLoadStatusEnum */
import { DEFAULT_API_URL, DEFAULT_PLAT } from './consts';
import { setAllowLog, getJsRunLocation, safeGetMap } from './util';
import { getHelSingletonHost } from './utilBase';

/** @type {ReturnType<typeof makeHelMicroShared>} */
let helMicroShared = getHelSingletonHost().__HEL_MICRO_SHARED__;

export function makeCacheNode(platform) {
  return {
    isConfigInit: false,
    platform,
    apiMode: 'jsonp',
    apiPrefix: '',
    apiSuffix: '',
    strictMatchVer: true,
    apiPathOfApp: DEFAULT_API_URL,
    apiPathOfAppVersion: '',
    getSubAppAndItsVersionFn: null,
    getSubAppVersionFn: null,
    userLsKey: '',
    getUserName: null,
    /**
     * @type {Record<string, any>}
     * 记录在线版本 Comp
     */
    appName2Comp: {},
    /**
     * exposeByLibName 生成的代理对象会指向此对象
     * @type {Record<string, any>}
     */
    appName2Lib: {},
    /**
     * @type {Record<string, boolean>}
     * 记录 lib 是否已分配到 appName2Lib 的 libMap 里
     */
    appName2isLibAssigned: {},
    /**
     * @type {Record<string, import('hel-types').IEmitAppInfo>}
     * 记录在线版本 emitApp
     */
    appName2EmitApp: {},
    /** @type {Record<string, boolean>} */
    appName2isJsEvaluated: {},
    /** @type {Record<string, number>} TODO: remove me，仅为了暂时支持某些老版本hel-micro正常工作*/
    appName2loadStatus: {},
    /**
     * 应用各个版本的load状态，用于控制loadApp或loadAppAssets是否要再次执行 0:未加载 1:加载中 2:加载结束 
     * @type {Record<string, Record<string, HelLoadStatusEnum>>}
     */
    appName2verLoadStatus: {},
    /**
     * @type {Record<string, Record<string, Record<string, any>>>} 应用各个版本对应的lib
     */
    appName2verEmitLib: {},
    /**
     * @type {Record<string, Record<string, import('hel-types').IEmitAppInfo>>} 应用各个版本对应的appInfo
     */
    appName2verEmitApp: {},
    /**
     * @type {Record<string, Record<string, string>>} 应用各个版本对应的样式字符串
     */
    appName2verStyleStr: {},
    /**
     * @type {Record<string, Record<string, HelLoadStatusEnum>>} 
     * 应用各个版本对应的样式字符串是否已获取过，提供给 hel-micro appStyle 服务使用
     */
    appName2verStyleFetched: {},
    /**
     * 应用各个版本对应的版本数据
     * @type {Record<string, Record<string, import('hel-types').ISubAppVersion>>} 
     */
    appName2verAppVersion: {},
    /**
     * 兜底对应的app数据
     * @type {Record<string, import('hel-types').ISubApp>}
     */
    appName2app: {},
    /** 
     * 兜底对应的线上版本appVersion数据
     * @type {Record<string, import('hel-types').ISubAppVersion>}
     */
    appName2appVersion: {},
    /** 
     * 兜底对应的样式字符串
     * @type {Record<string, string>}
     */
    appName2styleStr: {},
    /** @type {Record<string, number>} */
    appName2styleFetchStatus: {},
    /** 组名对应的第一个加载的模块版本号，用于辅助 tryGetVersion 推导版本号用，在 setVersion 时会写入 */
    appGroupName2firstVer: {},
  };
}

function makeHelMicroShared() {
  /** @type {Record<string, any[]>} */
  const name2listeners = {};

  const tnewsCache = makeCacheNode('tnews');
  const cacheRoot = {
    platform: DEFAULT_PLAT,
    /** 1.4+ 新增，用于记录 preFetchLib 时显示传递了 platform 值，供 hel-lib-proxy 使用，
    * 方便多平台共同加载包体场景下， exposeLib 接口如果未显式的传递平台值，能尽量正确推测出应用对应的 platform 值
    * 但是这里依然推荐用户 exposeLib 传递具体的平台值，避免推测错误
    */
    appName2platform: {},
    /** 取代 appName2platform，后续 appName2platform 会移出 */
    appGroupName2platform: {},
    caches: {
      [DEFAULT_PLAT]: makeCacheNode(DEFAULT_PLAT),
      tnews: tnewsCache,
    },
  };

  return {
    createFeature: getJsRunLocation(),
    eventBus: {
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
          listeners.forEach(cb => cb(...args));
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
    },
    cacheRoot,
    // 老版本的 hel-micro 为支持多平台模块时，读取的是 commonCache 属性，
    // 这里该属性保量着，确保使用老版本 hel-micro 的读取不出错
    commonCache: tnewsCache,
    /** 指向的是  cacheRoot.caches.hel，放第一层仅用于方便控制台查看，实际业务逻辑还是走 caches 去取 */
    helCache: cacheRoot.caches[DEFAULT_PLAT],
    /** 调试相关函数 */
    dev: {
      setAllowLog,
    },
  };
}

export function ensureHelMicroShared() {
  if (helMicroShared) {
    const cacheRoot = helMicroShared.cacheRoot;
    safeGetMap(cacheRoot, 'appGroupName2platform');

    // 兼容线上老版本包，遍历 caches 做检测子节点数据结构并补齐
    const caches = cacheRoot.caches;
    Object.keys(caches).forEach(key => {
      const cacheNode = caches[key];
      safeGetMap(cacheNode, 'appGroupName2firstVer');
    });
    return;
  }

  helMicroShared = makeHelMicroShared();
  getHelSingletonHost().__HEL_MICRO_SHARED__ = helMicroShared;
}

export function getHelMicroShared() {
  return helMicroShared;
}
