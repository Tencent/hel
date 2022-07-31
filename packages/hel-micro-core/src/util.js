import { getGlobalThis } from './utilBase';
import { getHelMicroDebug } from './microDebug';

let search = '';
try {
  search = getGlobalThis().top?.location?.search || '';
} catch (err) {
  // 可能是非同域的iframe载入，访问iframe外部变量会报错
  search = getGlobalThis()?.location?.search || '';
}

if (search.includes('hellog=1')) {
  setAllowLog(true);
}


/** 采用一次缓存值后，便不再从search推导，翻遍单页面应用路由变化后，依然可以打印long */
export function allowLog() {
  return getHelMicroDebug().allowLog;
}


export function setAllowLog(value) {
  getHelMicroDebug().allowLog = value;
}


const logPrefix = '  %c--> HEL LOG:';
const colorDesc = 'color:#ad4e00;font-weight:600';
export function log(...args) {
  if (allowLog()) {
    const [firstArg, ...rest] = args;
    if (typeof firstArg === 'string') {
      console.log(`${logPrefix} ${firstArg}`, colorDesc, ...rest);
    } else {
      console.log(logPrefix, colorDesc, ...args);
    }
  }
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


export function safeGetMap(rootObj, key) {
  let subMap = rootObj[key];
  if (!subMap) {
    subMap = {};
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
  Object.keys(assignFrom).forEach(key => {
    const val = assignFrom[key];
    if (![null, undefined, ''].includes(val)) {
      assignTo[key] = val;
    }
  });
}
