'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// 此包只能被每个应用独立安装，使用externals方式将会导致此判断失效
// 确保此包在入口文件第一行引入，才能让 isSubApp 逻辑执行正确

var isMeSetTrue = false;
trySetSignal();

/**
 *
 * @returns {typeof globalThis}
 */
function getGlobalThis() {
  return window || global;
}
function trySetSignal() {
  var globalThis = getGlobalThis();
  if (globalThis.__MASTER_APP_LOADED__ === undefined) {
    globalThis.__MASTER_APP_LOADED__ = true;
    isMeSetTrue = true;
  }
}

/**
 * 是否是主应用
 * @returns
 */
function isMasterApp$1() {
  // __MASTER_APP_LOADED__ 是当前包写入的，表示为主应用，反之则是子应用
  return isMeSetTrue;
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
