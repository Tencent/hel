import { isNull } from './commonUtil';
import { getHelSingletonHost } from './globalRef';

/** @type {import('../index').IHelMicroDebug} */
let helMicroDebug = {};
try {
  helMicroDebug = getHelSingletonHost().__HEL_MICRO_DEBUG__;
} catch (err) {}

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
  if (!isNull(helMicroDebug)) {
    // 兼容老版本库生成的 __HEL_MICRO_DEBUG__ 对象
    if (helMicroDebug.logMode === undefined) {
      helMicroDebug.logMode = 0;
      helMicroDebug.logFilter = '';
    }
    return;
  }

  helMicroDebug = makeHelMicroDebug();
  try {
    getHelSingletonHost().__HEL_MICRO_DEBUG__ = helMicroDebug;
  } catch (err) {}
}

ensureHelMicroDebug();

export function getHelMicroDebug() {
  return helMicroDebug;
}
