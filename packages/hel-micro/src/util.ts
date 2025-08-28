import { allowLog, commonUtil, getGlobalThis, log } from 'hel-micro-core';
import xhrFetch from './browser/xhr';
import type { IInnerPreFetchOptions } from './types';

let seq = 0;
const detectMark = 'try_detect_latest_ver';

export function hasProp(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function perfStart(label: string, addSeq?: boolean) {
  let seqStr = '';
  if (allowLog()) {
    if (addSeq) {
      seq += 1;
      seqStr = `_${seq}`;
    }
    console.time(`${label}${seqStr}`);
  }
  return seqStr;
}

export function perfEnd(label: string, seq?: string) {
  if (allowLog()) {
    console.timeEnd(`${label}${seq || ''}`);
  }
}

/**
 * 默认请求 unpkg，会先经过 302 重定向到一个 404 请求地址后，即可拿到最新的版本号
 */
export async function getSemverLatestVer(appName: string, apiPrefix: string) {
  try {
    const { url } = await requestGet(`${apiPrefix}/${appName}@latest/${detectMark}_${Date.now()}`);
    // 可能 appName 也包含 @ 符号，故 verStr 取 strArr 最后一个元素去推导
    const strArr = url.split('@');
    const includeVerStr = strArr[strArr.length - 1];
    const [ver] = includeVerStr.split('/');
    return ver;
  } catch (err: any) {
    log('[[ getSemverLatestVer ]] returns ver(latest) due to error:', err.message);
    return 'latest';
  }
}

export async function requestByFetch(url: string, asJson: boolean) {
  const res = await getGlobalThis().fetch(url);
  const { status, url: resUrl } = res;
  if (![200, 304].includes(status)) {
    return { url: resUrl, reply: null, status };
  }

  if (asJson) {
    const json = await res.json();
    return { url: resUrl, reply: json, status };
  }

  const text = await res.text();
  return { url: resUrl, reply: text, status };
}

export async function requestByXHR(url: string, asJson: boolean) {
  const res = await xhrFetch(url, { method: 'GET', responseType: asJson ? 'json' : 'text' });
  const { status, data, url: resUrl = '' } = res;
  if (status === 400) {
    return { url: resUrl, reply: null, status };
  }
  return { url: resUrl, reply: data, status };
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
    const { extraCssList: custCssList = [], enable = true } = custom;
    if (enable) {
      const mergedList: string[] = commonUtil.merge2List(extraCssList, custCssList);
      return mergedList;
    }
  }
  return extraCssList.slice();
}
