import { getHelSingletonHost } from './utilBase';

/** @type {import('../index').IHelMicroDebug} */
let helMicroDebug = getHelSingletonHost().__HEL_MICRO_DEBUG__;

/**
 * @returns {import('../index').IHelMicroDebug}
 */
function makeHelMicroDebug() {
  return {
    logMode: 0,
    logFilter: '',
    isInit: false,
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

export function getHelMicroDebug() {
  return helMicroDebug;
}
