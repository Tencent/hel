import { commonUtil, helConsts, log } from 'hel-micro-core';
import type { ILinkItem, IScriptItem } from 'hel-types';
import type { ICustom, IHelMeta, IInnerPreFetchOptions } from '../types';
import { requestGet } from '../util';

const { DEFAULT_ONLINE_VER } = helConsts;
const type2conf = {
  js: {
    endMarks: ['.js', '.ts'] as string[],
    reg: '(?<=(src="))[^"]*?(?=")',
    tag: 'script',
  },
  css: {
    endMarks: ['.css'] as string[],
    reg: '(?<=(href="))[^"]*?(?=")',
    tag: 'link',
  },
} as const;
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
  extractAssetList(htmlText: string, options: { host: string; type: 'js' | 'css' }) {
    // TODO: 分析 script style 内部文本（现阶段暂不支持内部文本）
    // const arr = Array.from(htmlText.matchAll(new RegExp('(?<=\<script\>).*?(?=(\</script\>|$))', 'g')));
    // arr.forEach(item=> console.log(item[0])); // item[0] 即内部文本

    const { host, type } = options;
    const { endMarks, tag, reg } = type2conf[type];

    // 此处不能采用 const reg = /(?<=(src="))[^"]*?(?=")/ig 写法，谨防 safari 浏览器报错
    // SyntaxError: Invalid regular expression: invalid group specifier name
    const assetReg = new RegExp(reg, 'ig');
    const rawList = htmlText.match(assetReg) || [];
    // 记录sdk 初次加载应用需要的资源描述对象
    const itemList: Array<ILinkItem | IScriptItem> = [];
    // 记录所有的资源路径，注意此处只是模拟，实际上通过 custom 方式加载的应用
    // chunkJsSrcList chunkCssSrcList 信息并不如构建时提取的完整
    const stringList: string[] = [];

    rawList.forEach((v) => {
      if (!inner.isSrcMatchHost(v, host)) {
        return;
      }
      if (endMarks.every((endMark) => !v.endsWith(endMark))) {
        return;
      }

      stringList.push(v);
      if (tag === 'script') {
        const toPush: IScriptItem = { tag, attrs: { src: v } };
        // TODO: 优化为读取到 module 属性存在就设置 type = 'module'
        if (v.endsWith('.ts')) {
          toPush.attrs.type = 'module'; // support esm
        }
        itemList.push(toPush);
      } else {
        itemList.push({ tag, attrs: { href: v, rel: 'stylesheet' } });
      }
    });
    return { itemList, stringList };
  },
  extractCssList(htmlText: string, host: string) {
    const data = inner.extractAssetList(htmlText, { host, type: 'css' });
    return data;
  },
  extractScriptList(htmlText: string, host: string) {
    const data = inner.extractAssetList(htmlText, { host, type: 'js' });
    return data;
  },
  extactHelMeta(reply: any) {
    const { code, data, msg } = reply;
    if (code && data) { // 符合来着管理台的相应数据特征
      if (code !== '0') {
        throw new Error(msg || 'server error occurred');
      }
      return data;
    }
    // 当作是来自 cdn 存储的元数据
    return reply;
  },
  async getHelMeta(appName: string, apiUrl: string, throwError?: boolean) {
    const msg = (detail = '') => `fetch ${appName} helmeta by url ${apiUrl} failed in custom mode! ${detail}`
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
  const { host, appGroupName, skipFetchHelMeta = false, isApiUrl } = custom;
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
  const cssData = inner.extractCssList(htmlText, host);
  const jsData = inner.extractScriptList(htmlText, host);
  const bodyAssetList = cssData.itemList.concat(jsData.itemList);

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
        headAssetList: [],
        bodyAssetList,
        chunkCssSrcList: cssData.stringList,
        chunkJsSrcList: jsData.stringList,
        staticCssSrcList: [],
        staticJsSrcList: [],
        relativeCssSrcList: [],
        relativeJsSrcList: [],
      },
    },
  } as unknown as IHelMeta;
}
