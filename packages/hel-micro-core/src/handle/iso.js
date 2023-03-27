import { getGlobalThis } from '../base/globalRef';

// !!! 注：如果hel-micro hel-micro-core相关包体设置到externals里时，此机制不再有效，所以后续可能会移出此逻辑
// 建议用户自己维护（例如通过 process.env来判断） 是否是子应用

// 该变量每个子应用自己维护一份，只能在 __MASTER_APP_LOADED__ 无值时才能被写为true
// __MASTER_APP_LOADED__ 有值表示主应用已挂载
// 需注意此设计模式下，hel-micro-core 不应该被抽到 externals，
// 否则各个应用共同维护一个了 isCoreInit 值，isSubApp 就无效了
let isCoreInit = false;

let isTrySetCalled = false;

export function trySetMasterAppLoadedSignal(clearSignals) {
  if (clearSignals) {
    isCoreInit = false;
    isTrySetCalled = false;
  }

  if (isTrySetCalled === true) {
    return;
  }
  isTrySetCalled = true;
  const globalThis = getGlobalThis();

  if (globalThis.__MASTER_APP_LOADED__ === undefined) {
    globalThis.__MASTER_APP_LOADED__ = true;
    isCoreInit = true;
  }
}

/**
 * 是否是子应用
 * @returns
 */
export function isSubApp() {
  // __MASTER_APP_LOADED__ 是当前应用写入的，代表当前应用是主应用
  if (isCoreInit) {
    return false;
  }

  return true;
}
