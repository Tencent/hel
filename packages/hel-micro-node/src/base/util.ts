import { MODULE_DESC, OBJ_DESC } from './mod-consts';

export function strItems2Dict<T = any>(strItems: string[], val: T): Record<string, T> {
  const dict: Record<string, T> = {};
  strItems.forEach((item) => (dict[item] = val));
  return dict;
}

/**
 * 判断是否是普通 json 字典对象
 * 例如，{}, {a:1} 为 true，null, undefind, 1, 2, true, [], new Map(), new Set() 等均为 false
 */
export function isDict(mayDict: any) {
  if (!mayDict) {
    return false;
  }
  return mayDict.toString() === OBJ_DESC;
}

export function isModuleLike(mayModule: any) {
  if (!mayModule) {
    return false;
  }
  if (typeof mayModule.toString !== 'function') {
    return false;
  }
  try {
    return [OBJ_DESC, MODULE_DESC].includes(mayModule.toString());
  } catch (err) {
    return false;
  }
}

export function isFn(mayFn: any) {
  return typeof mayFn === 'function';
}

export function isValidModule(mayModule: any) {
  if (!mayModule) {
    return false;
  }
  const len = Object.keys(mayModule).length;
  if (!len) {
    try {
      return mayModule.toString() === MODULE_DESC;
    } catch (err) {
      return false;
    }
  }

  return true;
}

/**
 * xss过滤器
 *
 * @param {string} input 传入字符串
 * @returns {string} 过滤后的字符串
 */
export function xssFilter(input: string) {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

export function purify<T = any>(raw: object): T {
  const pured = {};
  Object.keys(raw).forEach((key) => {
    const val = raw[key];
    if (![undefined, null, ''].includes(val)) {
      pured[key] = val;
    }
  });
  return pured as T;
}

export function purifyFn(raw: object) {
  const pured = {};
  Object.keys(raw).forEach((key) => {
    const val = raw[key];
    if (typeof val === 'function') {
      pured[key] = val;
    }
  });
  return pured;
}

/**
 * 获取数组倒数位置的元素，默认获取最后一个
 */
export function lastNItem(strList: string[], lastIdx = 1) {
  const idx = strList.length - lastIdx;
  return strList[idx];
}

/**
 * 不重复添加元素
 */
export function uniqueStrPush(strList: string[], str: string) {
  if (!strList.includes(str)) {
    strList.push(str);
  }
  return strList;
}

export function safeGet<T = any>(dict: object, key: string, defaultVal: T): T {
  let val = dict[key];
  if (!val) {
    dict[key] = defaultVal;
    val = defaultVal;
  }
  return val;
}

export function maySet(dict: object, key: string, val: any) {
  if (!val) {
    return false;
  }
  dict[key] = val;
  return true;
}

export function maySetFn(dict: object, key: string, val: any) {
  if (typeof val === 'function') {
    dict[key] = val;
  }
}

export function noop(...args: any[]) {
  return args;
}

/**
 * 克隆
 */
export function clone(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}
