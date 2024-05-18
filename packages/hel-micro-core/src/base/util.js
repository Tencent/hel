import { getGlobalThis } from './globalRef';

export function getOB() {
  const gs = getGlobalThis();
  // @ts-ignore
  return gs.MutationObserver || gs.WebKitMutationObserver || gs.MozMutationObserver;
}

/**
 * 经测试 nodeList.find(node => node.tagName === 'BODY')
 * 可能在某些浏览器报错，故抽象为 for 循环语法方便多处复用
 */
export function findNode(/** @type NodeList */ nodeList, tagName) {
  let targetNode = null;
  const len = nodeList.length;
  for (let i = 0; i < len; i++) {
    const node = nodeList[i];
    if (node.tagName === tagName) {
      targetNode = node;
      break;
    }
  }
  return targetNode;
}

export function okeys(map) {
  return Object.keys(map);
}

function getSearch() {
  const getLocSearch = (/** @type {Location} */ location) => {
    const locVar = location || {};
    let search = locVar.search || '';
    if (!search) {
      const hash = locVar.hash || '';
      const hashSearch = hash.split('?')[1] || '';
      if (hashSearch) {
        search = `?${hashSearch}`;
      }
    }
    return search;
  };

  try {
    return getLocSearch(getGlobalThis()?.top?.location);
  } catch (err) {
    // 可能是非同域的 iframe 载入，访问 iframe 外部变量导致的报错
    return getLocSearch(getGlobalThis()?.location);
  }
}

export function getLsItem(key) {
  const ls = getGlobalThis()?.localStorage;
  return ls?.getItem(key);
}

export function setLsItem(key, val) {
  const ls = getGlobalThis()?.localStorage;
  return ls?.setItem(key, val);
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
    /** @type {string[]} */
    const stackArr = err.stack.split('\n');
    const len = stackArr.length;
    // firefox 下 len-1 取不到，需要取 len-2
    loc = stackArr[len - 1] || stackArr[len - 2] || '';
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
