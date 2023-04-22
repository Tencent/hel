let globalThisRef = null;

function assignRef() {
  // for browser env
  if (typeof window !== 'undefined') {
    globalThisRef = window;
    return;
  }
  // for nodejs env
  if (typeof global !== 'undefined') {
    globalThisRef = global;
    return;
  }
  throw new Error('unable to locate global object');
}

/**
 *
 * @returns {typeof globalThis}
 */
export function getGlobalThis() {
  if (!globalThisRef) {
    assignRef();
  }
  return globalThisRef;
}

export function setGlobalThis(specGlobalThis, merge = false) {
  let prevShared = null;
  if (globalThisRef?.__HEL_MICRO_SHARED__) {
    prevShared = globalThisRef.__HEL_MICRO_SHARED__;
  }
  if (merge) {
    globalThisRef = { ...globalThisRef, ...specGlobalThis };
  } else {
    globalThisRef = specGlobalThis;
  }
  // 避免 resetGlobalThis 被用户调用后，共享数据丢失
  if (prevShared) {
    globalThisRef.__HEL_MICRO_SHARED__ = prevShared;
  }
}

/**
 * 获取 hel 全局单例对象挂载的宿主，现阶段是 window self global
 * 针对浏览器环境后期可能会调整宿主节点
 */
export function getHelSingletonHost() {
  return getGlobalThis();
}
