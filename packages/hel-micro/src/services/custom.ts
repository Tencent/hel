import { parseHtml } from 'hel-html-parser';
import { commonUtil, helConsts, log } from 'hel-micro-core';
import type { IAssetItem } from 'hel-types';
import { getDatasetVal } from '../browser/helper';
import type { ICustom, IHelMeta, IInnerPreFetchOptions } from '../types';
import { requestGet } from '../util';

const { DEFAULT_ONLINE_VER } = helConsts;
const LOCAL_STR = 'http://localhost';
const LOCAL_127 = 'http://127.0.0.1';

const inner = {
  isSrcMatchHost(src: string, host: string) {
    // 支持 custom 设定 localhost 或 127 时，能相互匹配
    if (host.startsWith(LOCAL_STR) || host.startsWith(LOCAL_127)) {
      return src.startsWith(LOCAL_STR) || src.startsWith(LOCAL_127);
    }
    return src.startsWith(host);
  },
  extractAssetList(htmlText: string, host: string) {
    type Item = { data: { tag: string; attrs: Record<string, string>; innerText: string }; toHead: boolean };
    let isHeadOpen = true;
    const headAssetList: IAssetItem[] = [];
    const bodyAssetList: IAssetItem[] = [];
    const itemList: Item[] = [];
    const isValidTag = (tag: string) => ['script', 'link'].includes(tag);

    parseHtml(htmlText, {
      onTagOpen(tag) {
        if (isValidTag(tag)) {
          itemList.push({ data: { tag, attrs: {}, innerText: '' }, toHead: isHeadOpen });
        }
      },
      onTagClose(tag, tagData) {
        if (tag === 'head') isHeadOpen = false;
        if (!isValidTag(tag)) return;
        const lastItem = itemList[itemList.length - 1];
        if (lastItem) {
          const firstChild = tagData.children[0] || '';
          if (typeof firstChild === 'string') {
            lastItem.data.innerText = firstChild;
          }
          lastItem.data.attrs = tagData.attrs;
        }
      },
    });

    itemList.forEach(({ data, toHead }) => {
      const list = toHead ? headAssetList : bodyAssetList;
      const { src, href, 'data-helex': helEx, rel } = data.attrs;
      const helAppend = getDatasetVal(data.attrs, 'data-helappend', '1');
      const url = src || href || '';
      let append = true;
      // icon 资源默认不加载
      // 非构建产生的资源，如未标记 data-helappend="1" 且未标记data-helex="{exName}"，则不加载
      if (rel === 'icon' || (!inner.isSrcMatchHost(url, host) && helAppend !== '1' && !helEx)) {
        append = false;
      }
      const itemVar: any = { ...data, append };
      list.push(itemVar);
    });

    return { headAssetList, bodyAssetList };
  },
  getChunkList(assetList: IAssetItem[]) {
    const chunkCssSrcList: string[] = [];
    const chunkJsSrcList: string[] = [];
    assetList.forEach((asset) => {
      const { href, src } = asset.attrs;
      const url = href || src || '';
      if (url) {
        url.endsWith('.css') ? chunkCssSrcList.push(url) : chunkJsSrcList.push(url);
      }
    });

    return { chunkCssSrcList, chunkJsSrcList };
  },
  extactHelMeta(reply: any) {
    const { code, data, msg } = reply;
    if (code && data) {
      // 符合来着管理台的相应数据特征
      if (code !== '0') {
        throw new Error(msg || 'server error occurred');
      }
      return data;
    }
    // 当作是来自 cdn 存储的元数据
    return reply;
  },
  async getHelMeta(appName: string, apiUrl: string, throwError?: boolean) {
    const msg = (detail = '') => `fetch ${appName} helmeta by url ${apiUrl} failed in custom mode! ${detail}`;
    try {
      const { reply } = await requestGet(apiUrl);
      const helMeta = inner.extactHelMeta(reply);
      if (helMeta && helMeta.app && helMeta.version) {
        helMeta.app.__fromCust = true;
        return helMeta;
      }
      if (throwError) {
        throw new Error(msg());
      }
      log('[[ getCustomMeta ]] 404 is a expected behavior for custom mode, user can ignore it');
      return null;
    } catch (err: any) {
      if (throwError) {
        throw new Error(msg(err.messgae));
      }
      commonUtil.noop('json parse fail or other error');
    }
  },
};

export function isCustomValid(custom: IInnerPreFetchOptions['custom']): custom is ICustom {
  if (custom) {
    const { enable = true, host } = custom;
    return !!(host && enable);
  }
  return false;
}

export async function getCustomMeta(appName: string, custom: ICustom): Promise<IHelMeta> {
  const { host, appGroupName, skipFetchHelMeta = false, isApiUrl, parseHtml } = custom;
  const t = Date.now();

  if (isApiUrl) {
    const helMeta = await inner.getHelMeta(appName, host, true);
    return helMeta;
  }

  if (!skipFetchHelMeta) {
    const helMetaUrl = host.endsWith('hel-meta.json') ? host : `${host}/hel-meta.json?_t=${t}`;
    const helMeta = await inner.getHelMeta(appName, helMetaUrl);
    if (helMeta) {
      return helMeta;
    }
  }

  let htmlText = '';
  try {
    const result = await requestGet(`${host}/index.html?_t=${t}`, false);
    htmlText = result.reply;
  } catch (err: any) {
    throw new Error(`${err.message} from ${host}`);
  }

  const parseFn = parseHtml || inner.extractAssetList;
  const result = parseFn(htmlText, host);
  const headAssetList = result.headAssetList || [];
  const bodyAssetList = result.bodyAssetList || [];
  const chunkResult = inner.getChunkList(headAssetList.concat(bodyAssetList));

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
        webDirPath: host,
        headAssetList,
        bodyAssetList,
        chunkCssSrcList: chunkResult.chunkCssSrcList,
        chunkJsSrcList: chunkResult.chunkJsSrcList,
        staticCssSrcList: [],
        staticJsSrcList: [],
        relativeCssSrcList: [],
        relativeJsSrcList: [],
      },
    },
  } as unknown as IHelMeta;
}
