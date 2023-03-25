import { allowLog, commonUtil, getGlobalThis } from 'hel-micro-core';
import xhrFetch from './browser/xhr';
import type { IInnerPreFetchOptions } from './types';

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

export function helScriptId(appName: string) {
  return `helScript_${appName}`;
}

export function helLinkId(appName: string) {
  return `helLink_${appName}`;
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
    const mergedList: string[] = commonUtil.merge2List(extraCssList, custCssList);
    return mergedList;
  }
  return extraCssList;
}
