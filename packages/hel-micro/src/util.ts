import { allowLog, getGlobalThis } from 'hel-micro-core';

export function perfStart(label: string) {
  if (allowLog()) {
    console.time(label);
  }
}


// avoid mock js-dom warn:
// [DOMException [SecurityError]: localStorage is not available for opaque origins]
export function getLocalStorage() {
  const mockStorage = { getItem() { }, setItem() { } };
  try {
    const storage = getGlobalThis()?.localStorage;
    return storage || mockStorage;
  } catch (err: any) {
    return mockStorage;
  }
}


export function perfEnd(label: string) {
  if (allowLog()) {
    console.timeEnd(label);
  }
}


export function noDupPush(list: any[], item: any) {
  if (!list.includes(item)) {
    list.push(item);
  }
}


export function okeys(map: any) {
  return Object.keys(map);
}


export function helScriptId(appName: string) {
  return `helScript_${appName}`;
}


export function helLinkId(appName: string) {
  return `helLink_${appName}`;
}

interface NullDef {
  nullValues?: any[];
  /** {} 算不算空，true算空 */
  emptyObjIsNull?: boolean;
  emptyArrIsNull?: boolean;
}
export function isNull(value: any, nullDef: NullDef = {}) {
  const {
    nullValues = [null, undefined, ''],
    emptyObjIsNull = true, emptyArrIsNull = true,
  } = nullDef;

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


/**
 * 确定一个有效值，如果左边无效，则取右边的备用值
 * @param firstVal
 * @param secondVal
 */
export function decideVal(firstVal: any, secondVal: any) {
  if (!isNull(firstVal)) return firstVal;
  return secondVal;
}


export function safeParse(jsonStr: any, defaultValue: any, errMsg?: string) {
  // 防止传入进来的已经是 json 对象
  if (jsonStr && typeof jsonStr !== 'string') {
    return jsonStr;
  }
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    if (defaultValue !== undefined) return defaultValue;
    if (errMsg) throw new Error(errMsg);
    throw err;
  }
}


export async function requestGet(url: string, asJson = true) {
  const res = await getGlobalThis().fetch(url);
  if (asJson) {
    const json = await res.json();
    return json;
  }

  const text = await res.text();
  return text;
}
