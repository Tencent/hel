import { getGlobalThis } from '../base/globalRef';

// !!! 注：如果hel-micro hel-micro-core相关包体设置到externals里时，
// 此机制不再有效，建议尽快使用 hel-iso 包替代

// 该变量每个子应用自己维护一份，只能在 __MASTER_APP_LOADED__ 无值时才能被写为true
// __MASTER_APP_LOADED__ 有值表示主应用已挂载
// 需注意此设计模式下，hel-micro-core 不应该被抽到 externals，
// 否则各个应用共同维护一个了 isCoreInit 值，isSubApp 就无效了，需使用 hel-iso 替代
let isMeMarkTrue = false;

let isTryMarkCalled = false;

/**
 * @returns
 */
export function tryMarkFlag(clearSignals) {
  if (clearSignals) {
    isMeMarkTrue = false;
    isTryMarkCalled = false;
  }
  if (isTryMarkCalled) {
    return;
  }
  isTryMarkCalled = true;
  const globalThis = getGlobalThis();

  if (globalThis.__MASTER_APP_LOADED__ === undefined) {
    globalThis.__MASTER_APP_LOADED__ = true;
    isMeMarkTrue = true;
  }
}

/**
 * 是否是子应用
 * @deprecated
 * @returns
 */
export function isSubApp() {
  // calling isSubApp is unsafe, cause it will return wrong result when they were lift up to webpack
  // externals, please install hel-iso and call its isSubApp instead
  let tip = 'WARNING: calling isSubApp is unsafe, use hel-iso.isSubApp instead,\n';
  tip += 'more details see: https://tnfe.github.io/hel/docs/tutorial/attention-is-subapp';
  console.log(`%c${tip}`, 'color:red;');
  // __MASTER_APP_LOADED__ 是当前应用写入的，代表当前应用是主应用
  if (isMeMarkTrue) {
    return false;
  }

  return true;
}
