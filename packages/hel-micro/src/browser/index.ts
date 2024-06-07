import { getGlobalThis } from '../deps/helMicroCore';
import type { IAssetItem, IAssetItemAttrs, ILinkAttrs, IScriptAttrs, ISubApp, ISubAppVersion, ItemTag } from '../deps/helTypes';
import type { AssetUrlType, IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList, merge2List, noop, okeys } from '../util';
import { getAssetUrlType } from './helper';

function isAssetExisted(selectors: string) {
  try {
    const doc = getGlobalThis()?.document;
    const el = doc.querySelector(selectors);
    return !!el;
  } catch (err: any) {
    return false;
  }
}

function isExLoaded(attrs: Record<string, any>, tag: string) {
  const ex = attrs['data-helex'];
  const g = getGlobalThis();
  if (ex) {
    // @ts-ignore, avoid error: expression of type 'any' can't be used to index type 'typeof globalThis'
    if (tag === 'script' && g[ex]) {
      // script 型的 ex，优先查 globalThis 上是否已绑定
      return true;
    }
    // 查 helex 特征值对应的资源是否存在
    return isAssetExisted(`${tag}[data-helex="${ex}"]`);
  }
  return false;
}

interface ICreateScriptOptions {
  attrs: IScriptAttrs;
  appGroupName: string;
  appendToBody?: boolean;
  onloadCb?: () => void;
}

function createScriptElement(appName: string, options: ICreateScriptOptions) {
  noop(appName);
  const { attrs, appendToBody = true, onloadCb } = options;
  const { src, ...rest } = attrs;
  const restObj: Record<string, any> = rest;
  if (!src) {
    return false;
  }

  const doc = getGlobalThis().document;
  if (isAssetExisted(`script[src="${src}"]`)) {
    return false;
  }
  if (isExLoaded(restObj, 'script')) {
    return false;
  }

  const el = doc.createElement('script');
  el.setAttribute('src', src);
  okeys(restObj).forEach((key) => el.setAttribute(key, restObj[key]));
  if (onloadCb) el.onload = onloadCb;

  if (appendToBody) doc.body.appendChild(el);
  else doc.head.appendChild(el);

  return true;
}

interface ICreateLinkOptions {
  attrs: ILinkAttrs;
  appGroupName: string;
  appendToBody?: boolean;
}

function createLinkElement(appName: string, options: ICreateLinkOptions) {
  noop(appName);
  const { appendToBody = false, attrs } = options;
  const { href, rel, ...rest } = attrs;
  const restObj: Record<string, any> = rest;
  const doc = getGlobalThis().document;
  if (!href) return;
  if (isExLoaded(restObj, 'link')) {
    return false;
  }

  const el = doc.createElement('link');
  el.setAttribute('rel', rel || 'stylesheet');
  el.setAttribute('href', href);
  okeys(restObj).forEach((key) => el.setAttribute(key, restObj[key]));

  if (appendToBody) doc.body.appendChild(el);
  else doc.head.appendChild(el);
}

interface ICreateDomOptions {
  appGroupName: string;
  webDirPath: string;
  appendToBody: boolean;
  appendCss: boolean;
  cssAppendTypes: AssetUrlType[];
  excludeCssList: string[];
}

// 相比 as 写法，谓词可直接将 attrs 类型缩小并适用于整个 if block 块里
function isLinkAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is ILinkAttrs {
  noop(attrs);
  return tag === 'link';
}

function isScriptAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is IScriptAttrs {
  noop(attrs);
  return tag === 'script';
}

function createDomByAssetList(appName: string, assetList: IAssetItem[], options: ICreateDomOptions) {
  const { appGroupName, appendToBody, appendCss, webDirPath, cssAppendTypes, excludeCssList } = options;

  assetList.forEach((v) => {
    // 兼容历史元数据，无 append 的话就默认为 true
    const { tag, attrs, append = true } = v;
    if (!append) {
      return;
    }
    // 处理 link 标签
    if (isLinkAttrs(tag, attrs)) {
      const createLinkOptions = { appGroupName, appendToBody, attrs };
      const { href } = attrs;
      // .ico 文件默认不加载（ 除非显式地记录了 append 为 true ）
      if (href.endsWith('.ico') && v.append !== true) {
        return;
      }

      if (href.endsWith('.css')) {
        if (
          appendCss
          && cssAppendTypes.includes(getAssetUrlType(webDirPath, href)) // 当前链接类型是合法的可以附加到 html 文档的链接类型
          && !excludeCssList.includes(href) // 当前链接没有被设置在排除链接列表里
        ) {
          createLinkElement(appName, createLinkOptions);
        }
        return;
      }

      createLinkElement(appName, createLinkOptions);
      return;
    }
    // 处理 script 标签
    if (isScriptAttrs(tag, attrs)) {
      createScriptElement(appName, { appGroupName, appendToBody, attrs });
    }
  });
}

/**
 * 加载应用各项资源
 */
export function loadAppAssets(app: ISubApp, version: ISubAppVersion, loadOptions: IInnerPreFetchOptions) {
  // 重命名，避免 @typescript-eslint/naming-convention 警告
  const {
    name,
    app_group_name: appGroupName,
    additional_scripts: additionalScripts = [],
    additional_body_scripts: additionalBodyScripts = [],
  } = app;
  const { headAssetList = [], bodyAssetList = [], webDirPath, chunkCssSrcList = [] } = version.src_map;
  const { useAdditionalScript = false, appendCss = true, cssAppendTypes = ['static', 'build'], getExcludeCssList } = loadOptions;
  const allExtraCssList = getAllExtraCssList(loadOptions);
  const allCssList = merge2List(allExtraCssList, chunkCssSrcList);
  const excludeCssList = getExcludeCssList?.(allCssList, { version }) || [];

  const createAdditionalScripts = (scripts?: string[], appendToBody?: boolean) => {
    if (!scripts) return;
    // 严格按照顺序创建
    for (const scriptUrl of scripts) {
      if (scriptUrl.endsWith('.css')) {
        if (appendCss && !excludeCssList.includes(scriptUrl)) {
          createLinkElement(name, { appGroupName, appendToBody, attrs: { href: scriptUrl } });
        }
      } else {
        createScriptElement(name, { appGroupName, appendToBody, attrs: { src: scriptUrl } });
      }
    }
  };

  if (useAdditionalScript) {
    createAdditionalScripts(additionalScripts, false);
    createAdditionalScripts(additionalBodyScripts, true);
  }

  createAdditionalScripts(allExtraCssList, false);

  const optionsCommon = { appGroupName, excludeCssList, webDirPath, appendCss, cssAppendTypes };
  createDomByAssetList(name, headAssetList, { appendToBody: false, ...optionsCommon });
  createDomByAssetList(name, bodyAssetList, { appendToBody: true, ...optionsCommon });
}
