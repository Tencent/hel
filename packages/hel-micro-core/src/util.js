import { getHelMicroDebug } from './microDebug';
import { getGlobalThis } from './utilBase';

initMicroDebug();

function initMicroDebug() {
  if (getHelMicroDebug().isInit) {
    return;
  }

  getHelMicroDebug().isInit = true;
  const searchObj = getSearchObj();
  const { hellog, hellogf } = searchObj;
  const ls = getGlobalThis().localStorage;

  // 优先读 url 上的控制参数 hellog，再读 localStorage 里的控制参数
  const logMode = hellog || ls.getItem('HelConfig.logMode') || 0;
  setLogMode(logMode);

  // 优先读 url 上的控制参数 hellogf
  const logFilter = hellogf || ls.getItem('HelConfig.logFilter') || '';
  setLogFilter(logFilter);
}

function getSearch() {
  try {
    return getGlobalThis().top?.location?.search || '';
  } catch (err) {
    // 可能是非同域的iframe载入，访问iframe外部变量会报错
    return getGlobalThis()?.location?.search || '';
  }
}

function isIncludeFilter(firstArg, logFilter) {
  if (!logFilter.includes(',')) {
    return firstArg.includes(logFilter);
  }
  /** @type {string[]} */
  const filterList = logFilter.split(',');
  return filterList.some((item) => firstArg.includes(item));
}

export function getSearchObj() {
  const search = getSearch();
  const map = {};
  if (search?.startsWith('?')) {
    const pureSearch = search.substring(1);
    const items = pureSearch.split('&');
    items.forEach((item) => {
      const [key, value] = item.split('=');
      map[key] = value;
    });
  }
  return map;
}

/** 采用一次缓存值后，便不再从search推导，方便单页面应用路由变化后，依然可以打印log */
export function allowLog() {
  return getLogMode() !== 0;
}

export function setLogMode(value) {
  const modeNum = parseInt(value, 10);
  if ([1, 2].includes(modeNum)) {
    getHelMicroDebug().logMode = modeNum;
  }
}

export function getLogMode() {
  return getHelMicroDebug().logMode;
}

export function setLogFilter(value) {
  getHelMicroDebug().logFilter = value;
}

export function getLogFilter() {
  return getHelMicroDebug().logFilter;
}

const logPrefix = '  %c--> HEL LOG:';
const colorDesc = 'color:#ad4e00;font-weight:600';
export function log(...args) {
  if (!allowLog()) {
    return;
  }
  const logFn = getLogMode() === 1 ? console.log : console.trace || console.log;
  const [firstArg, ...rest] = args;
  if (typeof firstArg !== 'string') {
    return logFn(logPrefix, colorDesc, ...args);
  }

  const logFilter = getLogFilter();
  const logParams = [`${logPrefix} ${firstArg}`, colorDesc, ...rest];
  if (logFilter) {
    isIncludeFilter(firstArg, logFilter) && logFn(...logParams);
    return;
  }
  logFn(...logParams);
}

export function getJsRunLocation() {
  let loc = '';
  try {
    throw new Error('getJsRunLocation');
  } catch (err) {
    const stackArr = err.stack.split('\n');
    loc = stackArr[stackArr.length - 1] || '';
  }
  return loc;
}

export function setSubMapValue(rootObj, key, subKey, subValue) {
  const subMap = safeGetMap(rootObj, key);
  subMap[subKey] = subValue;
}

export function safeGetMap(rootObj, key, defaultMap = {}) {
  let subMap = rootObj[key];
  if (!subMap) {
    subMap = defaultMap;
    rootObj[key] = subMap;
  }
  return subMap;
}

export function helScriptId(appName) {
  return `helScript_${appName}`;
}

export function helLinkId(appName) {
  return `helLink_${appName}`;
}

export function safeAssign(assignTo, assignFrom) {
  Object.keys(assignFrom).forEach((key) => {
    const val = assignFrom[key];
    if (![null, undefined, ''].includes(val)) {
      assignTo[key] = val;
    }
  });
}
