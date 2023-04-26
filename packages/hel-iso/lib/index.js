'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
|--------------------------------------------------------------------------
| ATTENTION:
| 此包只能被每个应用独立安装，将此包提升到 external 将会导致 isSubApp 失效
| 同时确保此包在入口文件第一行引入，才能让 isSubApp 逻辑执行正确
|--------------------------------------------------------------------------
*/

// iso 模块加载信息
var info = getIsoInfo();
var cachedIsMaster = null;
tryMarkFlag();

/**
 * @returns {typeof globalThis}
 */
function getGlobalThis() {
  return window || global;
}
function getIsoInfo() {
  var _getGlobalThis = getGlobalThis(),
    __HEL_ISO_FLAG__ = _getGlobalThis.__HEL_ISO_FLAG__,
    __MASTER_APP_LOADED__ = _getGlobalThis.__MASTER_APP_LOADED__;
  return {
    /** 是否是第一个载入 hel-iso 模块 */
    isFirstMod: __HEL_ISO_FLAG__ === undefined,
    /** 是否是在 hel-micro-core 之前载入的 */
    isBeforeCore: __MASTER_APP_LOADED__ === undefined,
  };
}
function tryMarkFlag() {
  var globalThis = getGlobalThis();
  // 启用新的名称 __HEL_ISO_FLAG__ 替代 hel-micro-core 里的 __MASTER_APP_LOADED__
  // 确保 hel-iso 在被并调用 isMasterApp 时能够正确推断是否主应用
  if (globalThis.__HEL_ISO_FLAG__ === undefined) {
    globalThis.__HEL_ISO_FLAG__ = 1;
  }
}
function getCodeHost() {
  var loc = '';
  try {
    throw new Error('codeHost');
  } catch (err) {
    var stackArr = err.stack.split('\n');
    loc = stackArr[stackArr.length - 1] || '';
  }
  // at main (http://localhost:3103/static/js/bundle.js:343:60)
  var codeHost = loc.split('//')[1].split('/')[0];
  return codeHost;
}
function getIsMaster() {
  var globalThis = getGlobalThis();
  var isFirstMod = info.isFirstMod,
    isBeforeCore = info.isBeforeCore;

  // 如果不是第一个载入的，一定是子模块
  if (!isFirstMod) {
    return false;
  }
  // 以下逻辑开始，当前 iso 模式是【第一个载入的】，按道理可以返回 true 表示前应用是主应用了
  // 但为了兼容 iso 和 core 共存时，依然能正确判断当前应用是否是主应用，所以继续加入其他判断条件
  // -----------------------------------------------------------------------------
  // 在 core 之前加载
  if (isBeforeCore) {
    return true;
  }

  // 当前运行环境和代码的位置一致，一定是主应用
  var location = globalThis.location;
  var codeHost = getCodeHost();
  if (location && location.host === codeHost) {
    return true;
  }
  return false;
}

/**
 * 是否是主应用
 * @returns
 */
function isMasterApp$1() {
  if (cachedIsMaster === null) {
    cachedIsMaster = getIsMaster();
  }
  return cachedIsMaster;
}
function isSubApp$1() {
  return !isMasterApp$1();
}

var isMasterApp = isMasterApp$1,
  isSubApp = isSubApp$1;
var index = {
  isSubApp: isSubApp,
  isMasterApp: isMasterApp,
};

exports['default'] = index;
exports.isMasterApp = isMasterApp;
exports.isSubApp = isSubApp;
