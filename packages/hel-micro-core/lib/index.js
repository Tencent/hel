'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// 防止循环引用

/** @type {'inner' | 'out'} */
var PACK_MODE = 'out';
var VER$1 = '3.9.5';

var VER = VER$1;
var DEFAULT_API_URL = '/openapi/v1/app/info';
var DEFAULT_ONLINE_VER$1 = '__default_online_ver__';
var UNPKG_PREFIX = 'https://unpkg.com';
var PLAT_UNPKG = 'unpkg';
var PLAT_HEL = 'hel';
var DEFAULT_PLAT = PLAT_UNPKG;
var HEL_EVENTS = {
  // renderApp 发射的是 SUB_APP_LOADED
  // 此处有个小写开头的瑕疵不再做纠正，
  SUB_APP_LOADED: 'subAppLoaded',
  // libReady 发射的是 SUB_LIB_LOADED
  SUB_LIB_LOADED: 'SubLibLoaded',
  // 3.2+ 新增样式字符串获取完毕事件
  STYLE_STR_FETCHED: 'StyleStrFetched'
};
/**
 * 作为应用是否加载 或 样式字符串 是否获取的枚举 map
 * @type {{NOT_LOAD:0, LOADING:1, LOADED:2}}
 */

var HEL_LOAD_STATUS = {
  NOT_LOAD: 0,
  LOADING: 1,
  LOADED: 2
};

var outPrefix = ['ht', 'tps', ':/', '/foo', 'tpri', 'nt.q', 'q.c', 'om/'].join('');

function getApiInnerPrefix(platform) {
  return "".concat(outPrefix).concat(platform);
}

function getDefaultApiPrefix(platform) {
  if (platform === PLAT_UNPKG) {
    return UNPKG_PREFIX;
  }

  return getApiInnerPrefix();
}

/*
|--------------------------------------------------------------------------
| 
| 下沉一下基础函数，避免循环引用
| util <---> microDebug
| 改进后依赖形如 
| util ---> microDebug ---> utilBase
| 
|--------------------------------------------------------------------------
*/
var mockGlobalThis = null;
function getGlobalThis$1() {
  if (mockGlobalThis) {
    return mockGlobalThis;
  }

  try {
    // for browser env
    if (typeof window !== 'undefined') {
      return window;
    } // for worker env


    if (typeof self !== 'undefined') {
      return self;
    } // for nodejs env


    if (typeof global !== 'undefined') {
      return global;
    }

    throw new Error('opps');
  } catch (err) {
    throw new Error('unable to locate global object');
  }
}
function setGlobalThis$1(specGlobalThis) {
  mockGlobalThis = specGlobalThis;
}
/**
 * 获取 hel 全局单例对象挂载的宿主，现阶段是 window self global
 * 针对浏览器环境后期可能会调整宿主节点
 */

function getHelSingletonHost() {
  return getGlobalThis$1();
}

/** @type {import('../index').IHelMicroDebug} */

var helMicroDebug = getHelSingletonHost().__HEL_MICRO_DEBUG__;
/**
 * @returns {import('../index').IHelMicroDebug}
 */


function makeHelMicroDebug() {
  return {
    logMode: 0,
    logFilter: '',
    isInit: false
  };
}

function ensureHelMicroDebug() {
  if (helMicroDebug) {
    // 兼容老版本库生成的 __HEL_MICRO_DEBUG__ 对象
    if (helMicroDebug.logMode === undefined) {
      helMicroDebug.logMode = 0;
      helMicroDebug.logFilter = '';
    }

    return;
  }

  helMicroDebug = makeHelMicroDebug();
  getHelSingletonHost().__HEL_MICRO_DEBUG__ = helMicroDebug;
}

ensureHelMicroDebug();
function getHelMicroDebug() {
  return helMicroDebug;
}

function getSearch() {
  try {
    var _getGlobalThis$top, _getGlobalThis$top$lo;

    return ((_getGlobalThis$top = getGlobalThis$1().top) === null || _getGlobalThis$top === void 0 ? void 0 : (_getGlobalThis$top$lo = _getGlobalThis$top.location) === null || _getGlobalThis$top$lo === void 0 ? void 0 : _getGlobalThis$top$lo.search) || '';
  } catch (err) {
    var _getGlobalThis, _getGlobalThis$locati;

    // 可能是非同域的iframe载入，访问iframe外部变量会报错
    return ((_getGlobalThis = getGlobalThis$1()) === null || _getGlobalThis === void 0 ? void 0 : (_getGlobalThis$locati = _getGlobalThis.location) === null || _getGlobalThis$locati === void 0 ? void 0 : _getGlobalThis$locati.search) || '';
  }
}

function isIncludeFilter(firstArg, logFilter) {
  if (!logFilter.includes(',')) {
    return firstArg.includes(logFilter);
  }
  /** @type {string[]} */


  var filterList = logFilter.split(',');
  return filterList.some(function (item) {
    return firstArg.includes(item);
  });
}

function getSearchObj() {
  var search = getSearch();
  var map = {};

  if (search && search.startsWith('?')) {
    var pureSearch = search.substring(1);
    var items = pureSearch.split('&');
    items.forEach(function (item) {
      var _item$split = item.split('='),
          _item$split2 = _slicedToArray(_item$split, 2),
          key = _item$split2[0],
          value = _item$split2[1];

      map[key] = value;
    });
    return map;
  }

  return map;
}
/** 采用一次缓存值后，便不再从search推导，方便单页面应用路由变化后，依然可以打印log */

function allowLog$1() {
  return getLogMode() !== 0;
}
function setLogMode(value) {
  getHelMicroDebug().logMode = value;
}
function getLogMode() {
  return getHelMicroDebug().logMode;
}
function setLogFilter(value) {
  getHelMicroDebug().logFilter = value;
}
function getLogFilter() {
  return getHelMicroDebug().logFilter;
}

if (!getHelMicroDebug().isInit) {
  getHelMicroDebug().isInit = true;
  var searchObj = getSearchObj();
  var hellog = searchObj.hellog,
      hellogf = searchObj.hellogf;

  if (hellog == '1') {
    setLogMode(1);
  } else if (hellog == '2') {
    setLogMode(2);
  }

  if (hellogf) {
    setLogFilter(hellogf);
  }
}

var logPrefix = '  %c--> HEL LOG:';
var colorDesc = 'color:#ad4e00;font-weight:600';
function log$1() {
  if (!allowLog$1()) {
    return;
  }

  var logFn = getLogMode() === 1 ? console.log : console.trace || console.log;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var firstArg = args[0],
      rest = args.slice(1);

  if (typeof firstArg === 'string') {
    var logFilter = getLogFilter();
    var logParams = ["".concat(logPrefix, " ").concat(firstArg), colorDesc].concat(_toConsumableArray(rest));

    if (logFilter) {
      isIncludeFilter(firstArg, logFilter) && logFn.apply(void 0, _toConsumableArray(logParams));
      return;
    }

    logFn.apply(void 0, _toConsumableArray(logParams));
    return;
  }

  logFn.apply(void 0, [logPrefix, colorDesc].concat(args));
}
function getJsRunLocation() {
  var loc = '';

  try {
    throw new Error('getJsRunLocation');
  } catch (err) {
    var stackArr = err.stack.split('\n');
    loc = stackArr[stackArr.length - 1] || '';
  }

  return loc;
}
function setSubMapValue(rootObj, key, subKey, subValue) {
  var subMap = safeGetMap(rootObj, key);
  subMap[subKey] = subValue;
}
function safeGetMap(rootObj, key) {
  var defaultMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var subMap = rootObj[key];

  if (!subMap) {
    subMap = defaultMap;
    rootObj[key] = subMap;
  }

  return subMap;
}
function safeAssign(assignTo, assignFrom) {
  Object.keys(assignFrom).forEach(function (key) {
    var val = assignFrom[key];

    if (![null, undefined, ''].includes(val)) {
      assignTo[key] = val;
    }
  });
}

/** @type {ReturnType<typeof makeHelMicroShared>} */

var helMicroShared = getHelSingletonHost().__HEL_MICRO_SHARED__;

function makeCacheNode(platform) {
  /** @type {import('../index').SharedCache} */
  var cacheNode = {
    isConfigOverwrite: false,
    isInnerConfigOverwrite: false,
    platform: platform,
    initPack: PACK_MODE,
    apiMode: 'jsonp',
    apiPrefix: '',
    apiSuffix: '',
    strictMatchVer: true,
    apiPathOfApp: DEFAULT_API_URL,
    apiPathOfAppVersion: '',
    getSubAppAndItsVersionFn: null,
    onFetchMetaFailed: null,
    userLsKey: '',
    getUserName: null,
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
    appGroupName2firstVer: {}
  };
  return cacheNode;
}

function makeHelMicroShared() {
  var _caches;

  /** @type {Record<string, any[]>} */
  var name2listeners = {};
  var helCache = makeCacheNode(PLAT_HEL);
  var unpkgCache = makeCacheNode(PLAT_UNPKG);
  var cacheRoot = {
    /** 这个值保留着是为了兼容历史逻辑，让老包执行 helper.getPlatform 能够正常取到篡改的默认值，新版包体不在支持设置 platform 值 */
    platform: '',

    /** 1.4+ 新增，用于记录 preFetchLib 时显示传递了 platform 值，供 hel-lib-proxy 使用，
     * 方便多平台共同加载包体场景下， exposeLib 接口如果未显式的传递平台值，能尽量正确推测出应用对应的 platform 值
     * 但是这里依然推荐用户 exposeLib 传递具体的平台值，避免推测错误
     */
    appName2platform: {},

    /** 取代 appName2platform，后续 appName2platform 会移出 */
    appGroupName2platform: {},

    /** @type {Record<string, ReturnType<typeof makeCacheNode>>} */
    caches: (_caches = {}, _defineProperty(_caches, PLAT_HEL, helCache), _defineProperty(_caches, PLAT_UNPKG, unpkgCache), _caches)
  };
  return {
    createFeature: getJsRunLocation(),
    eventBus: {
      on: function on(eventName, cb) {
        var listeners = name2listeners[eventName];

        if (!listeners) {
          var arr = [];
          name2listeners[eventName] = arr;
          listeners = arr;
        }

        listeners.push(cb);
      },
      emit: function emit(eventName) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var listeners = name2listeners[eventName];

        if (listeners) {
          listeners.forEach(function (cb) {
            return cb.apply(void 0, args);
          });
        }
      },
      off: function off(eventName, cb) {
        var listeners = name2listeners[eventName];

        if (listeners) {
          for (var i = 0, len = listeners.length; i < len; i++) {
            var cbItem = listeners[i];

            if (cbItem === cb) {
              listeners.splice(i, 1);
              break;
            }
          }
        }
      }
    },
    cacheRoot: cacheRoot,

    /** 指向的是  cacheRoot.caches.unpkg ，放第一层仅用于方便控制台查看，实际业务逻辑还是走 caches 去取 */
    unpkgCache: unpkgCache,

    /** 指向的是  cacheRoot.caches.hel ，放第一层仅用于方便控制台查看，实际业务逻辑还是走 caches 去取 */
    helCache: helCache,

    /** 调试相关函数 */
    dev: {
      setLogMode: setLogMode,
      setLogFilter: setLogFilter
    }
  };
}

function ensureHelMicroShared() {
  if (helMicroShared) {
    var cacheRoot = helMicroShared.cacheRoot;
    safeGetMap(cacheRoot, 'appGroupName2platform'); // 兼容线上老版本包，遍历 caches 做检测子节点数据结构并补齐

    var caches = cacheRoot.caches;
    Object.keys(caches).forEach(function (key) {
      var cacheNode = caches[key];
      safeGetMap(cacheNode, 'appGroupName2firstVer');
      safeGetMap(cacheNode, 'appName2verExtraCssList');
    });
    return;
  }

  helMicroShared = makeHelMicroShared();
  getHelSingletonHost().__HEL_MICRO_SHARED__ = helMicroShared;
}
function getHelMicroShared() {
  return helMicroShared;
}

/**
 * 获取默认的平台值
 * @returns
 */

function getPlatform$1() {
  // 后续可能会计划彻底不再支持重置平台默认值
  return getHelMicroShared().cacheRoot.platform || DEFAULT_PLAT;
}
/**
 * @param {string} platform
 */

function getPlatformSharedCache(platform) {
  var p = platform || getPlatform$1();
  var cacheRoot = getCacheRoot();
  var cacheNode = cacheRoot.caches[p];

  if (!cacheNode) {
    var platCache = makeCacheNode(platform);
    cacheRoot.caches[p] = platCache;
    cacheNode = platCache;
  }

  return cacheNode;
}
function getCacheRoot() {
  return getHelMicroShared().cacheRoot;
}
function isVerMatchOnline(
/** @type {import('hel-types').ISubApp}*/
appMeta, inputVer) {
  // 如果不传版本号，就表示匹配线上版本
  if (!inputVer) {
    return true;
  }

  return (appMeta === null || appMeta === void 0 ? void 0 : appMeta.online_version) === inputVer || (appMeta === null || appMeta === void 0 ? void 0 : appMeta.build_version) === inputVer;
}

// 建议用户自己维护（例如通过 process.env来判断） 是否是子应用
// 该变量每个子应用自己维护一份，只能在 __MASTER_APP_LOADED__ 无值时才能被写为true
// __MASTER_APP_LOADED__ 有值表示主应用已挂载
// 需注意此设计模式下，hel-micro-core 不应该被抽到 externals，
// 否则各个应用共同维护一个了 isMasterAppLoadedSignalWritenByCurrentApp 值，isSubApp 就无效了

var isMasterAppLoadedSignalWritenByCurrentApp = false;
var isTrySetMasterAppLoadedSignalCalled = false;
function trySetMasterAppLoadedSignal$1() {
  if (isTrySetMasterAppLoadedSignalCalled === true) {
    return;
  }

  isTrySetMasterAppLoadedSignalCalled = true;
  var globalThis = getGlobalThis$1();

  if (globalThis.__MASTER_APP_LOADED__ === undefined) {
    globalThis.__MASTER_APP_LOADED__ = true;
    isMasterAppLoadedSignalWritenByCurrentApp = true;
  }
}
/**
 * 是否是子应用
 * @returns
 */

function isSubApp$1() {
  // __MASTER_APP_LOADED__ 是当前应用写入的，代表当前应用是主应用
  if (isMasterAppLoadedSignalWritenByCurrentApp) {
    return false;
  }

  return true;
}

log$1("hel-micro-core ver ".concat(VER)); // 载入此包就尝试设置 masterApp 锁，以推断自己是不是父应用

trySetMasterAppLoadedSignal$1(); // 确保 __HEL_MICRO_SHARED__ 存在

ensureHelMicroShared();
var inner = {
  setVerLoadStatus: function setVerLoadStatus(appName, loadStatus, statusMapKey, options) {
    var _ref = options || {},
        versionId = _ref.versionId,
        platform = _ref.platform;

    var appVerLoadStatus = getSharedCache(platform)[statusMapKey];
    var versionIdVar = versionId || DEFAULT_ONLINE_VER;
    setSubMapValue(appVerLoadStatus, appName, versionIdVar, loadStatus);
  },
  getVerLoadStatus: function getVerLoadStatus(appName, statusMapKey, options) {
    var _appVerLoadStatus$app;

    var _ref2 = options || {},
        versionId = _ref2.versionId,
        platform = _ref2.platform;

    var appVerLoadStatus = getSharedCache(platform)[statusMapKey];
    var versionIdVar = versionId || DEFAULT_ONLINE_VER;
    return ((_appVerLoadStatus$app = appVerLoadStatus[appName]) === null || _appVerLoadStatus$app === void 0 ? void 0 : _appVerLoadStatus$app[versionIdVar]) || HEL_LOAD_STATUS.NOT_LOAD;
  },
  // 预防一些未升级的老模块未写 DEFAULT_ONLINE_VER 的值到 libOrAppMap 里
  ensureOnlineModule: function ensureOnlineModule(libOrAppMap, appName, platform) {
    if (libOrAppMap[DEFAULT_ONLINE_VER]) {
      return;
    }

    var appMeta = getAppMeta(appName, platform);
    var onlineModule = libOrAppMap[appMeta === null || appMeta === void 0 ? void 0 : appMeta.online_version];

    if (onlineModule) {
      libOrAppMap[DEFAULT_ONLINE_VER] = onlineModule;
    }
  }
};
var isSubApp = isSubApp$1; // 暴露出去，仅仅为兼容以前的调用此函数代码不报错，但是说明上已标即不鼓励使用

var trySetMasterAppLoadedSignal = trySetMasterAppLoadedSignal$1;
/**
 * 获取默认的平台值
 * @returns
 */

var getPlatform = getPlatform$1;
var helEvents = HEL_EVENTS;
var helLoadStatus = HEL_LOAD_STATUS;
var DEFAULT_ONLINE_VER = DEFAULT_ONLINE_VER$1;
var log = log$1;
var allowLog = allowLog$1;
var getHelDebug = getHelMicroDebug;
var getGlobalThis = getGlobalThis$1;
var setGlobalThis = setGlobalThis$1;
function getHelEventBus() {
  return getHelMicroShared().eventBus;
}
/**
 * @param {string} platform
 */

function getSharedCache(platform) {
  return getPlatformSharedCache(platform);
}
function tryGetVersion(appGroupName, platform) {
  // 形如: at c (https://{cdn_host_name}/{platform}/{appname_prefixed_version}/static/js/4.b60c0895.chunk.js:2:44037
  // 用户串改过的话，可能是：at c (https://{user_cdn}/{user_dir1}/{user_dir2 ...}/{platform}/{appname_prefixed_version}/...)
  var loc = getJsRunLocation();
  log$1("[[tryGetVersion]] may include source > ".concat(loc));

  var _getSharedCache = getSharedCache(platform),
      appGroupName2firstVer = _getSharedCache.appGroupName2firstVer;

  var callerSpecifiedVer = appGroupName2firstVer[appGroupName] || '';

  if (loc.includes('https://') || loc.includes('http://')) {
    var _loc$split = loc.split('//'),
        _loc$split2 = _slicedToArray(_loc$split, 2),
        restStr = _loc$split2[1];

    var strList = restStr.split('/'); // 优先判断可能包含的版本特征

    if (callerSpecifiedVer) {
      if (platform === PLAT_UNPKG && strList.some(function (item) {
        return item.includes(callerSpecifiedVer);
      })) {
        return callerSpecifiedVer;
      }

      if (strList.includes(callerSpecifiedVer)) {
        return callerSpecifiedVer;
      }
    } // [ 'unpkg.com' , 'hel-lodash@1.1.0' , ... ]


    if (platform === PLAT_UNPKG) {
      return strList[1].split('@')[1] || callerSpecifiedVer;
    } // 走默认的规则： {cdn_host_name}/{platform}/{appname_prefixed_version}，取下标2对应元素作为版本号


    return strList[2] || callerSpecifiedVer;
  } // 在微容器里运行时，js全是在VM里初始化的，此时拿不到具体的加载链接了


  return callerSpecifiedVer;
}
function tryGetAppName(
/** @type string */
version, appGroupName) {
  // 来自 hel 管理台的版本号规则
  if (version.includes('_')) {
    // lib-test_20220621165953 ---> lib-test
    var appName = version.substring(0, version.length - 15);
    return appName;
  } // 来自 unpkg


  return appGroupName || '';
}
function libReady(appGroupName, appProperties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var platform = options.platform || getAppPlatform(appGroupName);
  var versionId = tryGetVersion(appGroupName, platform);
  var appName = tryGetAppName(versionId, appGroupName);
  var appMeta = getAppMeta(appName, platform); // @ts-ignore，来自于用户设定 cust 配置弹射的模块

  if (appMeta && appMeta.__fromCust) {
    versionId = appMeta.online_version;
    appName = appMeta.name;
  }

  var emitApp = {
    platform: platform,
    appName: appName,
    appGroupName: appGroupName,
    versionId: versionId,
    appProperties: appProperties,
    Comp: function EmptyComp() {},
    lifecycle: {}
  };
  setEmitLib(appName, emitApp, {
    appGroupName: appGroupName,
    platform: platform
  });
  var eventBus = getHelEventBus();
  eventBus.emit(helEvents.SUB_LIB_LOADED, emitApp);
}
function getPlatformHost(iPlatform) {
  var platform = iPlatform || getPlatform();

  var _getSharedCache2 = getSharedCache(platform),
      apiPrefix = _getSharedCache2.apiPrefix;

  if (apiPrefix) {
    return apiPrefix;
  }

  return getDefaultApiPrefix(platform);
}
/**
 * 提取无其他杂项的配置对象
 * @param {SharedCache} mayCache
 * @returns {IPlatformConfigFull}
 */

function getPureConfig(mayCache) {
  var apiMode = mayCache.apiMode,
      apiPrefix = mayCache.apiPrefix,
      apiSuffix = mayCache.apiSuffix,
      apiPathOfApp = mayCache.apiPathOfApp,
      apiPathOfAppVersion = mayCache.apiPathOfAppVersion,
      getSubAppAndItsVersionFn = mayCache.getSubAppAndItsVersionFn,
      onFetchMetaFailed = mayCache.onFetchMetaFailed,
      strictMatchVer = mayCache.strictMatchVer,
      getUserName = mayCache.getUserName,
      userLsKey = mayCache.userLsKey,
      platform = mayCache.platform;
  return {
    apiMode: apiMode,
    apiPrefix: apiPrefix,
    apiSuffix: apiSuffix,
    apiPathOfApp: apiPathOfApp,
    apiPathOfAppVersion: apiPathOfAppVersion,
    getSubAppAndItsVersionFn: getSubAppAndItsVersionFn,
    onFetchMetaFailed: onFetchMetaFailed,
    strictMatchVer: strictMatchVer,
    getUserName: getUserName,
    userLsKey: userLsKey,
    platform: platform
  };
}
/**
 *
 * @param {IPlatformConfig} config
 * @param {string} [iPlatform ]
 * @returns
 */


function initPlatformConfig(
/** @type {import('../index').IPlatformConfig} */
config, iPlatform) {
  var cache = getPlatformSharedCache(iPlatform);
  var pureConfig = getPureConfig(config);

  if (cache.isConfigOverwrite) {
    // 对应平台的 initPlatformConfig 只接受一次调用
    return;
  }

  cache.isConfigOverwrite = true;
  safeAssign(cache, pureConfig);
}
function getPlatformConfig(iPlatform) {
  var cache = getPlatformSharedCache(iPlatform);
  return getPureConfig(cache);
}
function setEmitApp(appName,
/** @type {import('hel-types').IEmitAppInfo} */
emitApp) {
  var versionId = emitApp.versionId,
      platform = emitApp.platform;
  var sharedCache = getSharedCache(platform);
  var appName2verEmitApp = sharedCache.appName2verEmitApp,
      appName2Comp = sharedCache.appName2Comp,
      appName2EmitApp = sharedCache.appName2EmitApp,
      appName2app = sharedCache.appName2app;

  if (isVerMatchOnline(appName2app[appName], versionId)) {
    appName2Comp[appName] = emitApp.Comp;
    appName2EmitApp[appName] = emitApp;
    setSubMapValue(appName2verEmitApp, appName, DEFAULT_ONLINE_VER, emitApp);
  }

  if (versionId) {
    setSubMapValue(appName2verEmitApp, appName, versionId, emitApp);
  }
}
function getVerApp(appName, options) {
  var _options$strictMatchV;

  var _ref3 = options || {},
      versionId = _ref3.versionId,
      platform = _ref3.platform;

  var _getSharedCache3 = getSharedCache(platform),
      appName2verEmitApp = _getSharedCache3.appName2verEmitApp,
      appName2Comp = _getSharedCache3.appName2Comp,
      strictMatchVer = _getSharedCache3.strictMatchVer,
      appName2EmitApp = _getSharedCache3.appName2EmitApp;

  var targetStrictMatchVer = (_options$strictMatchV = options.strictMatchVer) !== null && _options$strictMatchV !== void 0 ? _options$strictMatchV : strictMatchVer;
  var verEmitAppMap = safeGetMap(appName2verEmitApp, appName);
  inner.ensureOnlineModule(verEmitAppMap, appName, platform); // 不传递具体版本号就执行默认在线版本

  var versionIdVar = versionId || DEFAULT_ONLINE_VER;
  var verApp = verEmitAppMap[versionIdVar];
  var Comp = appName2Comp[appName]; // { Comp } 是为了兼容老包写入的数据，老包未写入 appName2EmitApp

  var legacyWriteVerApp = Comp ? {
    Comp: Comp
  } : null; // 指定了版本严格匹配的话，兜底模块置为空

  var fallbackApp = targetStrictMatchVer ? null : appName2EmitApp[appName] || legacyWriteVerApp;
  var result = verApp || fallbackApp || null;
  log("[[ getVerApp ]] appName,options,result", appName, options, result);
  return result;
}
function getAppMeta(appName, platform) {
  var appName2app = getSharedCache(platform).appName2app;
  return appName2app[appName];
}
function setAppMeta(
/** @type {import('hel-types').ISubApp}*/
appMeta, platform) {
  var _getSharedCache4 = getSharedCache(platform),
      appName2app = _getSharedCache4.appName2app;

  appName2app[appMeta.name] = appMeta;
}
function setEmitLib(appName,
/** @type {import('hel-types').IEmitAppInfo} */
emitApp, options) {
  var _ref4 = options || {},
      appGroupName = _ref4.appGroupName;

  var versionId = emitApp.versionId,
      appProperties = emitApp.appProperties;
  var platform = emitApp.platform || options.platform;
  var sharedCache = getSharedCache(platform);
  var appName2verEmitLib = sharedCache.appName2verEmitLib,
      appName2Lib = sharedCache.appName2Lib,
      appName2isLibAssigned = sharedCache.appName2isLibAssigned;
  var appMeta = getAppMeta(appName, platform);

  var assignLibObj = function assignLibObj(appName) {
    // 区别于 setEmitApp，使用文件头静态导入模块语法时，默认是从 appName2Lib 拿数据
    // !!! 不再经过 isVerMatchOnline 逻辑成立后才记录 appName2Lib
    // 这意味着 文件头静态导入 总是执行第一个加载的版本模块，
    // （ 注：文件头静态导入对接的是 hel-lib-proxy 的 exposeLib，该接口使用的是 appName2Lib ）
    // 所以 多版本同时导入 和 文件头静态导入 本身是冲突的，用户不应该两种用法一起使用，
    // 否则 文件头静态导入 的模块是不稳定的，除非用户知道后果并刻意这样做
    // marked at 2022-05-06
    var libObj = appName2Lib[appName]; // 未静态导入时，libObj 是 undefined

    if (!libObj) {
      appName2Lib[appName] = appProperties;
    } else if (_typeof(libObj) === 'object' && Object.keys(libObj).length === 0) {
      // 静态导入时，emptyChunk 那里调用 exposeLib 会提前生成一个 {} 对象
      // 这里只需负责 merge 模块提供方通过 libReady 提供的模块对象
      Object.assign(libObj, appProperties);
    }

    appName2isLibAssigned[appName] = true;
  };

  assignLibObj(appName); // 确保 preFetchLib 传入测试应用名时，exposeLib 获取的代理对象能够指到测试库
  // 这样静态导入才能正常工作

  if (appGroupName) {
    assignLibObj(appGroupName);
  } else {
    appMeta && assignLibObj(appMeta.app_group_name);
  } // 当前版本可作为默认线上版本来记录


  log("[[ setEmitLib ]] appMeta", appMeta);
  var verEmitLibMap = safeGetMap(appName2verEmitLib, appName);

  if (!appMeta && !verEmitLibMap[DEFAULT_ONLINE_VER] // 使用 custom 配置直接载入目标模块时
  || isVerMatchOnline(appMeta, versionId)) {
    setSubMapValue(appName2verEmitLib, appName, DEFAULT_ONLINE_VER, appProperties);
  }

  if (versionId) {
    setSubMapValue(appName2verEmitLib, appName, versionId, appProperties);
  }
}
function getVerLib(appName, inputOptions) {
  var _options$strictMatchV2;

  var options = inputOptions || {};
  var versionId = options.versionId,
      platform = options.platform;
  var sharedCache = getSharedCache(platform);
  var appName2verEmitLib = sharedCache.appName2verEmitLib,
      appName2Lib = sharedCache.appName2Lib,
      strictMatchVer = sharedCache.strictMatchVer,
      appName2isLibAssigned = sharedCache.appName2isLibAssigned;
  var targetStrictMatchVer = (_options$strictMatchV2 = options.strictMatchVer) !== null && _options$strictMatchV2 !== void 0 ? _options$strictMatchV2 : strictMatchVer;
  var verEmitLibMap = safeGetMap(appName2verEmitLib, appName);
  inner.ensureOnlineModule(verEmitLibMap, appName); // 不传递具体版本号就执行默认在线版本

  var versionIdVar = versionId || DEFAULT_ONLINE_VER;
  var verLib = verEmitLibMap[versionIdVar]; // 未分配的模块，直接返回 null 即可，因为 appName2Lib 里会被 exposeLib 提前注入一个 {} 对象占位

  var staticLib = appName2isLibAssigned[appName] ? appName2Lib[appName] : null; // 指定了版本严格匹配的话，兜底模块置为空

  var fallbackLib = targetStrictMatchVer ? null : staticLib;
  var result = verLib || fallbackLib || null;
  log("[[ getVerLib ]] appName,options,result", appName, options, result);
  return result;
}
function setVerExtraCssList(appName, cssList, inputOptions) {
  var options = inputOptions || {};
  var versionId = options.versionId,
      platform = options.platform;
  var sharedCache = getSharedCache(platform);
  var appName2verExtraCssList = sharedCache.appName2verExtraCssList;
  var appMeta = getAppMeta(appName, platform);
  log("[[ setVerExtraCssList ]] cssList", cssList);
  var verExtraCssListMap = safeGetMap(appName2verExtraCssList, appName);

  if (!appMeta && !verExtraCssListMap[DEFAULT_ONLINE_VER] // 使用 custom 配置直接载入目标模块时
  || isVerMatchOnline(appMeta, versionId)) {
    setSubMapValue(appName2verExtraCssList, appName, DEFAULT_ONLINE_VER, cssList);
  }

  if (versionId) {
    setSubMapValue(appName2verExtraCssList, appName, versionId, cssList);
  }
}
function getVerExtraCssList(appName, inputOptions) {
  var options = inputOptions || {};
  var versionId = options.versionId,
      platform = options.platform;
  var sharedCache = getSharedCache(platform);
  var appName2verExtraCssList = sharedCache.appName2verExtraCssList;
  var verExtraCssListMap = safeGetMap(appName2verExtraCssList, appName);
  var cssList = verExtraCssListMap[versionId] || verExtraCssListMap[DEFAULT_ONLINE_VER] || [];
  log("[[ getVerExtraCssList ]] options, cssList", options, cssList);
  return cssList;
}
function setVerLoadStatus(appName, loadStatus, options) {
  inner.setVerLoadStatus(appName, loadStatus, 'appName2verLoadStatus', options);
}
function getVerLoadStatus(appName, options) {
  return inner.getVerLoadStatus(appName, 'appName2verLoadStatus', options);
}
function setVerStyleStrStatus(appName, loadStatus, options) {
  inner.setVerLoadStatus(appName, loadStatus, 'appName2verStyleFetched', options);
}
function getVerStyleStrStatus(appName, options) {
  return inner.getVerLoadStatus(appName, 'appName2verStyleFetched', options);
}
/**
 * hel-micro innerPreFetch 会调用此接口提前记录一下应用名对应的版本号
 */

function setAppPlatform(appGroupName, platform) {
  getCacheRoot().appGroupName2platform[appGroupName] = platform;
  return getAppPlatform(appGroupName);
}
/**
 * 优先获取用户为某个应用单独设定的平台值，目前设定的时机有 preFetch、preFetchLib 时指定的平台值
 * 这里是为了在 exposeLib 接口未指定平台值时可以动态的推导出目标模块的平台值
 * @returns
 */

function getAppPlatform(appGroupName) {
  return getCacheRoot().appGroupName2platform[appGroupName] || getPlatform$1();
}
function getVersion(appName, options) {
  var _appName2verAppVersio;

  var _ref5 = options || {},
      platform = _ref5.platform,
      versionId = _ref5.versionId;

  var _getSharedCache5 = getSharedCache(platform),
      appName2verAppVersion = _getSharedCache5.appName2verAppVersion,
      appName2appVersion = _getSharedCache5.appName2appVersion; // TODO: 暂未考虑接入 strictMatchVer


  var fallbackVerData = appName2appVersion[appName] || null;

  if (!versionId) {
    return fallbackVerData;
  }

  return ((_appName2verAppVersio = appName2verAppVersion[appName]) === null || _appName2verAppVersio === void 0 ? void 0 : _appName2verAppVersio[versionId]) || fallbackVerData;
}
function setVersion(appName,
/** @type {import('hel-types').ISubAppVersion}*/
versionData, options) {
  var _ref6 = options || {},
      platform = _ref6.platform;

  var _getSharedCache6 = getSharedCache(platform),
      appName2verAppVersion = _getSharedCache6.appName2verAppVersion,
      appName2appVersion = _getSharedCache6.appName2appVersion,
      appName2app = _getSharedCache6.appName2app,
      appGroupName2firstVer = _getSharedCache6.appGroupName2firstVer;

  var versionId = versionData.sub_app_version;
  var appMeta = getAppMeta(appName, platform);

  if (isVerMatchOnline(appName2app[appName], versionId)) {
    appName2appVersion[appName] = versionData;
    setSubMapValue(appName2verAppVersion, appName, DEFAULT_ONLINE_VER, versionData);
  }

  setSubMapValue(appName2verAppVersion, appName, versionId, versionData);
  appGroupName2firstVer[appMeta.app_group_name] = versionId;
}
function getAppStyleStr(appName, options) {
  var _appName2verStyleStr$;

  var _ref7 = options || {},
      platform = _ref7.platform,
      versionId = _ref7.versionId;

  var _getSharedCache7 = getSharedCache(platform),
      appName2verStyleStr = _getSharedCache7.appName2verStyleStr,
      appName2styleStr = _getSharedCache7.appName2styleStr; // TODO: 暂未考虑接入 strictMatchVer


  var fallbackStyleStr = appName2styleStr[appName] || ''; // 兼容老包未写 versionId 的情况

  if (!versionId) {
    return fallbackStyleStr;
  }

  return ((_appName2verStyleStr$ = appName2verStyleStr[appName]) === null || _appName2verStyleStr$ === void 0 ? void 0 : _appName2verStyleStr$[versionId]) || fallbackStyleStr || '';
}
function setAppStyleStr(appName, str, options) {
  var _ref8 = options || {},
      platform = _ref8.platform,
      versionId = _ref8.versionId;

  var _getSharedCache8 = getSharedCache(platform),
      appName2verStyleStr = _getSharedCache8.appName2verStyleStr,
      appName2verStyleFetched = _getSharedCache8.appName2verStyleFetched,
      appName2styleStr = _getSharedCache8.appName2styleStr; // 兼容老包未写 versionId 的情况


  if (!versionId) {
    appName2styleStr[appName] = str;
    return;
  }

  setSubMapValue(appName2verStyleStr, appName, versionId, str);
  setSubMapValue(appName2verStyleFetched, appName, versionId, helLoadStatus.LOADED);
}
var index = {
  DEFAULT_ONLINE_VER: DEFAULT_ONLINE_VER,
  helLoadStatus: helLoadStatus,
  helEvents: helEvents,
  isSubApp: isSubApp,
  trySetMasterAppLoadedSignal: trySetMasterAppLoadedSignal,
  getHelEventBus: getHelEventBus,
  getHelDebug: getHelDebug,
  getSharedCache: getSharedCache,
  getPlatform: getPlatform,
  getPlatformHost: getPlatformHost,
  getPlatformConfig: getPlatformConfig,
  getAppPlatform: getAppPlatform,
  setAppPlatform: setAppPlatform,
  // 应用Comp get set
  getVerApp: getVerApp,
  setEmitApp: setEmitApp,
  // 应用lib get set
  getVerLib: getVerLib,
  setEmitLib: setEmitLib,
  // 应用元数据 get set
  getAppMeta: getAppMeta,
  setAppMeta: setAppMeta,
  // 版本元数据 get set
  getVersion: getVersion,
  setVersion: setVersion,
  // 构建生成样式字符串 get set
  getAppStyleStr: getAppStyleStr,
  setAppStyleStr: setAppStyleStr,
  // 版本获取状态 get set
  getVerLoadStatus: getVerLoadStatus,
  setVerLoadStatus: setVerLoadStatus,
  // 样式字符串获取状态 get set
  getVerStyleStrStatus: getVerStyleStrStatus,
  setVerStyleStrStatus: setVerStyleStrStatus,
  // sdk注入的额外样式列表
  getVerExtraCssList: getVerExtraCssList,
  setVerExtraCssList: setVerExtraCssList,
  tryGetVersion: tryGetVersion,
  tryGetAppName: tryGetAppName,
  initPlatformConfig: initPlatformConfig,
  libReady: libReady,
  log: log,
  allowLog: allowLog,
  getGlobalThis: getGlobalThis,
  setGlobalThis: setGlobalThis
};

exports.DEFAULT_ONLINE_VER = DEFAULT_ONLINE_VER;
exports.allowLog = allowLog;
exports["default"] = index;
exports.getAppMeta = getAppMeta;
exports.getAppPlatform = getAppPlatform;
exports.getAppStyleStr = getAppStyleStr;
exports.getGlobalThis = getGlobalThis;
exports.getHelDebug = getHelDebug;
exports.getHelEventBus = getHelEventBus;
exports.getPlatform = getPlatform;
exports.getPlatformConfig = getPlatformConfig;
exports.getPlatformHost = getPlatformHost;
exports.getSharedCache = getSharedCache;
exports.getVerApp = getVerApp;
exports.getVerExtraCssList = getVerExtraCssList;
exports.getVerLib = getVerLib;
exports.getVerLoadStatus = getVerLoadStatus;
exports.getVerStyleStrStatus = getVerStyleStrStatus;
exports.getVersion = getVersion;
exports.helEvents = helEvents;
exports.helLoadStatus = helLoadStatus;
exports.initPlatformConfig = initPlatformConfig;
exports.isSubApp = isSubApp;
exports.libReady = libReady;
exports.log = log;
exports.setAppMeta = setAppMeta;
exports.setAppPlatform = setAppPlatform;
exports.setAppStyleStr = setAppStyleStr;
exports.setEmitApp = setEmitApp;
exports.setEmitLib = setEmitLib;
exports.setGlobalThis = setGlobalThis;
exports.setVerExtraCssList = setVerExtraCssList;
exports.setVerLoadStatus = setVerLoadStatus;
exports.setVerStyleStrStatus = setVerStyleStrStatus;
exports.setVersion = setVersion;
exports.tryGetAppName = tryGetAppName;
exports.tryGetVersion = tryGetVersion;
exports.trySetMasterAppLoadedSignal = trySetMasterAppLoadedSignal;
