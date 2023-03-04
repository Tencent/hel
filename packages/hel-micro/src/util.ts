import { allowLog, DEFAULT_ONLINE_VER, getGlobalThis } from './deps/helMicroCore';
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
  } catch (err: any) {
    if (defaultValue !== undefined) return defaultValue;
    if (errMsg) throw new Error(errMsg);
    throw err;
  }
}

export async function getUnpkgLatestVer(appName: string, apiPrefix: string) {
  // https://unpkg.com/hel-lodash@1.2.21/1659925934381_hel-lodash
  // https://cdn.jsdelivr.net/npm/hel-lodash@2.1.7/1659925934381_hel-lodash
  const { url } = await requestGet(`${apiPrefix}/${appName}@latest/${Date.now()}_${appName}`);
  const [, includeVer] = url.split('@');
  const [ver] = includeVer.split('/');
  return ver;
}

export async function requestGet(url: string, asJson = true) {
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

export async function getCustomMeta(appName: string, customHost: string, appGroupName?: string) {
  const t = Date.now();
  try {
    const { reply } = await requestGet(`${customHost}/hel-meta.json?_t=${t}`);
    if (reply) {
      reply.app.__fromCust = true;
      return reply;
    } else {
      console.warn('[[ getCustomMeta ]] 404 is a expected behavior for custom mode, user can ignore it');
    }
  } catch (err: any) {
    noop('json parse fail or other error');
  }

  const result = await requestGet(`${customHost}/index.html?_t=${t}`, false);
  const htmlText = result.reply;
  // 此处不能采用 const reg = /(?<=(src="))[^"]*?(?=")/ig 写法，谨防 safari 浏览器报错
  // SyntaxError: Invalid regular expression: invalid group specifier name
  const reg = new RegExp('(?<=(src="))[^"]*?(?=")', 'ig');
  const srcList: string[] = htmlText.match(reg) || [];
  const bodyAssetList: any[] = [];
  srcList.forEach((v: string) => {
    if (v.startsWith(customHost)) {
      bodyAssetList.push({
        tag: 'script',
        attrs: {
          src: v,
        },
      });
    }
  });

  return {
    app: {
      // @ts-ignore，标记来自 cust 配置
      __fromCust: true,
      name: appName,
      app_group_name: appGroupName || appName,
      online_version: DEFAULT_ONLINE_VER,
      build_version: DEFAULT_ONLINE_VER,
    },
    version: {
      sub_app_name: appName,
      sub_app_version: DEFAULT_ONLINE_VER,
      src_map: {
        headAssetList: [],
        bodyAssetList,
      },
    },
  };
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
