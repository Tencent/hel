import { getGlobalThis } from './globalRef';

export function okeys(map) {
  return Object.keys(map);
}

function getSearch() {
  try {
    return getGlobalThis().top?.location?.search || '';
  } catch (err) {
    // 可能是非同域的iframe载入，访问iframe外部变量会报错
    return getGlobalThis()?.location?.search || '';
  }
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

export function safeAssign(assignTo, assignFrom) {
  Object.keys(assignFrom).forEach((key) => {
    const val = assignFrom[key];
    if (![null, undefined, ''].includes(val)) {
      assignTo[key] = val;
    }
  });
}

export function noDupPush(oriList, toPush) {
  if (!oriList.includes(toPush)) oriList.push(toPush);
}

export function isNull(value, nullDef = {}) {
  const { nullValues = [null, undefined, ''], emptyObjIsNull = true, emptyArrIsNull = true } = nullDef;

  const inNullValues = nullValues.includes(value);
  if (inNullValues) {
    return true;
  }

  if (Array.isArray(value)) {
    if (emptyArrIsNull) return value.length === 0;
    return false;
  }

  if (typeof value === 'object') {
    const keys = okeys(value);
    const keyLen = keys.length;
    if (emptyObjIsNull) return keyLen === 0;
    return false;
  }

  return false;
}
