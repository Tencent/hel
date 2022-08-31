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

let mockGlobalThis = null;

export function getGlobalThis() {
  if (mockGlobalThis) {
    return mockGlobalThis;
  }
  try {
    // for browser env
    if (typeof window !== 'undefined') {
      return window;
    }
    // for worker env
    if (typeof self !== 'undefined') {
      return self;
    }
    // for nodejs env
    if (typeof global !== 'undefined') {
      return global;
    }
    throw new Error('opps');
  } catch (err) {
    throw new Error('unable to locate global object');
  }
}

export function setGlobalThis(specGlobalThis) {
  mockGlobalThis = specGlobalThis;
}

/**
 * 获取 hel 全局单例对象挂载的宿主，现阶段是 window self global
 * 针对浏览器环境后期可能会调整宿主节点
 */
export function getHelSingletonHost() {
  return getGlobalThis();
}
