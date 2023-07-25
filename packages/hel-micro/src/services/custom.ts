import { parseHtml } from 'hel-html-parser';
import { commonUtil, helConsts, log } from 'hel-micro-core';
import type { IAssetItem, TagName } from 'hel-types';
import { getDatasetVal, isRelativePath } from '../browser/helper';
import type { ICustom, IHelMeta, IInnerPreFetchOptions, IParsedNodeItem } from '../types';
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
  parseHtml(htmlText: string) {
    let isHeadOpen = true;
    const itemList: IParsedNodeItem[] = [];
    const isValidTag = (tag: string): tag is 'script' | 'link' | 'style' => ['script', 'link', 'style'].includes(tag);

    parseHtml(htmlText, {
      onTagOpen(tag) {
        if (isValidTag(tag)) {
          itemList.push({ tag, attrs: {}, innerText: '', head: isHeadOpen });
        }
      },
      onTagClose(tag, tagData) {
        if (tag === 'head') isHeadOpen = false;
        if (!isValidTag(tag)) return;
        const lastItem = itemList[itemList.length - 1];
        if (lastItem) {
          const firstChild = tagData.children[0] || '';
          if (typeof firstChild === 'string') {
            lastItem.innerText = firstChild;
          }
          lastItem.attrs = tagData.attrs;
        }
      },
    });
    return itemList;
  },
  convertToAssetList(list: IParsedNodeItem[], host: string) {
    const headAssetList: IAssetItem[] = [];
    const bodyAssetList: IAssetItem[] = [];
    const staticCssSrcList: string[] = [];
    const staticJsSrcList: string[] = [];
    const relativeCssSrcList: string[] = [];
    const relativeJsSrcList: string[] = [];

    list.forEach((item) => {
      const { head, attrs, innerText, tag } = item;
      const list = head ? headAssetList : bodyAssetList;
      const { src, href, 'data-helex': helEx, rel } = attrs;
      const helAppend = getDatasetVal(attrs, 'data-helappend', '1');

      if (tag === 'style') {
        list.push({ tag, attrs, innerText, append: true });
      } else {
        const url = src || href || '';
        const isCss = url.endsWith('.css');
        const isLink = tag === 'link';
        if (!url) return;
        let append = true;
        const isBuildUrl = inner.isSrcMatchHost(url, host);
        // icon 资源默认不加载
        // 非构建产生的资源，如未标记 data-helappend="1" 且未标记data-helex="{exName}"，则不加载
        if (rel === 'icon' || (!isBuildUrl && helAppend !== '1' && !helEx)) {
          append = false;
        }

        let tagVar: TagName = tag;
        if (!isBuildUrl) {
          if (isRelativePath(url)) {
            tagVar = isLink ? 'relativeLink' : 'relativeScript';
            isCss ? relativeCssSrcList.push(url) : relativeJsSrcList.push(url);
          } else {
            tagVar = isLink ? 'staticLink' : 'staticScript';
            isCss ? staticCssSrcList.push(url) : staticJsSrcList.push(url);
          }
        }

        const itemVar: any = { tag: tagVar, attrs, innerText, append };
        list.push(itemVar);
      }
    });

    return { headAssetList, bodyAssetList, staticCssSrcList, staticJsSrcList, relativeCssSrcList, relativeJsSrcList };
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
    htmlText = result.reply || '';
    if (![200, 304].includes(result.status)) {
      throw new Error(`status ${result.status}`);
    }
  } catch (err: any) {
    throw new Error(`${err.message} from ${host}`);
  }

  const parseFn = parseHtml || inner.parseHtml;
  const nodeList = parseFn(htmlText);
  const { headAssetList, bodyAssetList, ...restList } = inner.convertToAssetList(nodeList, host);
  const srcList = inner.getChunkList(headAssetList.concat(bodyAssetList));

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
        ...srcList,
        ...restList,
      },
    },
  } as unknown as IHelMeta;
}
