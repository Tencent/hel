import { allowLog, getGlobalThis } from 'hel-micro-core';
import xhrFetch from './browser/xhr';
import type { IInnerPreFetchOptions } from './types';

export function noop(...args: any) {
  return args;
}

export function perfStart(label: string) {
  if (allowLog()) {
    console.time(label);
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

export function merge2List(list1: string[], list2: string[]) {
  const mergedList: string[] = [];
  list1.forEach((v) => noDupPush(mergedList, v));
  list2.forEach((v) => noDupPush(mergedList, v));
  return mergedList;
}

export function okeys(map: any) {
  return Object.keys(map);
}

export function purify(obj: Record<string, any>, isValueValid?: (val: any) => boolean): Record<string, any> {
  // isValidVal or isNull
  const isValidFn = isValueValid || ((value) => !isNull(value));
  const pureObj: Record<string, any> = {};
  okeys(obj).forEach((key) => {
    if (isValidFn(obj[key])) pureObj[key] = obj[key];
  });
  return pureObj;
}

export function getObjsVal<T extends any = any>(objs: any[], key: string, backupVal?: any): T {
  let val = backupVal;
  for (const item of objs) {
    const mayValidVal = item[key];
    if (![null, undefined, ''].includes(mayValidVal)) {
      val = mayValidVal;
      break;
    }
  }
  return val;
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

export function safeParse(jsonStr: any, defaultValue: any, errMsg?: string) {
  // 防止传入进来的已经是 json 对象
  if (jsonStr && typeof jsonStr !== 'string') {
    return jsonStr;
  }
  try {
    const result = JSON.parse(jsonStr); // 避免 JSON.parse('null') ---> null
    return result || defaultValue;
  } catch (err: any) {
    if (defaultValue !== undefined) return defaultValue;
    if (errMsg) throw new Error(errMsg);
    throw err;
  }
}

/**
 * 默认请求 unpkg
 */
export async function getSemverLatestVer(appName: string, apiPrefix: string) {
  // https://unpkg.com/hel-lodash@1.2.21/1659925934381_hel-lodash
  // https://cdn.jsdelivr.net/npm/hel-lodash@2.1.7/1659925934381_hel-lodash
  const { url } = await requestGet(`${apiPrefix}/${appName}@latest/${Date.now()}_${appName}`);
  const [, includeVer] = url.split('@');
  const [ver] = includeVer.split('/');
  return ver;
}

export async function requestByFetch(url: string, asJson: boolean) {
  const res = await getGlobalThis().fetch(url);
  const { status, url: resUrl } = res;
  if (![200, 304].includes(status)) {
    return { url: resUrl, reply: null };
  }

  if (asJson) {
    const json = await res.json();
    return { url: resUrl, reply: json };
  }

  const text = await res.text();
  return { url: resUrl, reply: text };
}

export async function requestByXHR(url: string, asJson: boolean) {
  const res = await xhrFetch(url, { method: 'GET', responseType: asJson ? 'json' : 'text' });
  const { status, data, url: resUrl = '' } = res;
  if (status === 400) {
    return { url: resUrl, reply: null };
  }
  return { url: resUrl, reply: data };
}

export async function requestGet(url: string, asJson = true) {
  let requester = requestByXHR;
  // 如果支持fetch则使用
  if (!!getGlobalThis().fetch) {
    requester = requestByFetch;
  }
  const result = await requester(url, asJson);
  return result;
}

export function getAllExtraCssList(loadOptions: IInnerPreFetchOptions) {
  const { extraCssList = [], custom } = loadOptions;
  if (custom) {
    const { extraCssList: custCssList = [], cssStrategy = 'only_cust', enable = true } = custom;
    if (!enable) {
      return extraCssList;
    }
    if (cssStrategy === 'only_cust') {
      return custCssList;
    }
    if (cssStrategy === 'only_out') {
      return extraCssList;
    }
    const mergedList: string[] = merge2List(extraCssList, custCssList);
    return mergedList;
  }
  return extraCssList;
}
