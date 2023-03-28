/*
|--------------------------------------------------------------------------
| WARNING:
| 此包只能被每个应用独立安装，使用 externals 方式将会导致此判断失效
| 确保此包在入口文件第一行引入，才能让 isSubApp 逻辑执行正确
|--------------------------------------------------------------------------
*/

let isMeMarkTrue = false;

tryMarkFlag();

/**
 *
 * @returns {typeof globalThis}
 */
function getGlobalThis() {
  return window || global;
}

function tryMarkFlag() {
  const globalThis = getGlobalThis();

  // 启用新的名称 __HEL_ISO_FLAG__ 替代 hel-micro-core 里的 __MASTER_APP_LOADED__
  // 确保 hel-iso 被引入时能够正确推断是否主应用
  if (globalThis.__HEL_ISO_FLAG__ === undefined) {
    globalThis.__HEL_ISO_FLAG__ = true;
    isMeMarkTrue = true;
  }
}

/**
 * 是否是主应用
 * @returns
 */
export function isMasterApp() {
  // __HEL_ISO_FLAG__ 是当前包写入的，表示为主应用，反之则是子应用
  return isMeMarkTrue;
}

export function isSubApp() {
  return !isMasterApp();
}
