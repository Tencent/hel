import { getGlobalThis, getHelSingletonHost } from './globalRef';
import { getSearchObj, isNull } from './util';

export const inner = {
  isIncludeFilter(firstArg, logFilter) {
    if (!logFilter.includes(',')) {
      return firstArg.includes(logFilter);
    }
    /** @type {string[]} */
    const filterList = logFilter.split(',');
    return filterList.some((item) => firstArg.includes(item));
  },
  getLogFilter() {
    return getHelMicroDebug().logFilter;
  },
  setLogFilter(value) {
    getHelMicroDebug().logFilter = value;
  },
  setLogMode(value) {
    const modeNum = parseInt(value, 10);
    if ([1, 2].includes(modeNum)) {
      getHelMicroDebug().logMode = modeNum;
    }
  },
  getLogMode() {
    return getHelMicroDebug().logMode;
  },
};

/** @type {import('../index').IHelMicroDebug} */
let helMicroDebug = {};
function initMicroDebug() {
  if (getHelMicroDebug().isInit) {
    return;
  }

  getHelMicroDebug().isInit = true;
  const searchObj = getSearchObj();
  const { hellog, hellogf } = searchObj;
  const ls = getGlobalThis().localStorage;

  // 优先读 url 上的控制参数 hellog，再读 localStorage 里的控制参数
  const logMode = hellog || ls?.getItem('HelConfig.logMode') || 0;
  inner.setLogMode(logMode);

  // 优先读 url 上的控制参数 hellogf
  const logFilter = hellogf || ls?.getItem('HelConfig.logFilter') || '';
  inner.setLogFilter(logFilter);
}

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

export function ensureHelMicroDebug() {
  helMicroDebug = getHelSingletonHost().__HEL_MICRO_DEBUG__;
  if (!isNull(helMicroDebug)) {
    // 兼容老版本库生成的 __HEL_MICRO_DEBUG__ 对象
    if (helMicroDebug.logMode === undefined) {
      helMicroDebug.logMode = 0;
      helMicroDebug.logFilter = '';
    }
    return;
  }

  helMicroDebug = makeHelMicroDebug();
  getHelSingletonHost().__HEL_MICRO_DEBUG__ = helMicroDebug;
  try {
    initMicroDebug();
  } catch (err) {}
}

/** 采用一次缓存值后，便不再从search推导，方便单页面应用路由变化后，依然可以打印log */
export function allowLog() {
  return inner.getLogMode() !== 0;
}

export function getHelMicroDebug() {
  return helMicroDebug;
}

const logPrefix = '  %c--> HEL LOG:';
const colorDesc = 'color:#ad4e00;font-weight:600';
export function log(...args) {
  if (!allowLog()) {
    return;
  }
  const logFn = inner.getLogMode() === 1 ? console.log : console.trace || console.log;
  const [firstArg, ...rest] = args;
  if (typeof firstArg !== 'string') {
    return logFn(logPrefix, colorDesc, ...args);
  }

  const logFilter = inner.getLogFilter();
  const logParams = [`${logPrefix} ${firstArg}`, colorDesc, ...rest];
  if (logFilter) {
    inner.isIncludeFilter(firstArg, logFilter) && logFn(...logParams);
    return;
  }
  logFn(...logParams);
}
