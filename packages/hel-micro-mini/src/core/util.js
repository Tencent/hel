import { getGlobalThis } from './globalRef';

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

export function safeGetMap(rootObj, key, defaultMap = {}) {
  let subMap = rootObj[key];
  if (!subMap) {
    subMap = defaultMap;
    rootObj[key] = subMap;
  }
  return subMap;
}

export function setSubMapValue(rootObj, key, subKey, subValue) {
  const subMap = safeGetMap(rootObj, key);
  subMap[subKey] = subValue;
}
