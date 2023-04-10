import { commonUtil, getGlobalThis } from 'hel-micro-core';
import type { IAssetItem, IAssetItemAttrs, ILinkAttrs, IScriptAttrs, ISubApp, ISubAppVersion, ItemTag } from 'hel-types';
import type { CssAppendType, IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList } from '../util';

const { noop } = commonUtil;
const assign = Object.assign;

function isRelativePath(path: string) {
  if (path.startsWith('//')) return false;
  return path.startsWith('/') || path.startsWith('./') || path.startsWith('../');
}

function isAssetExisted(selectors: string) {
  try {
    const doc = getGlobalThis()?.document;
    const el = doc.querySelector(selectors);
    return !!el;
  } catch (err: any) {
    return false;
  }
}

interface ICreateScriptOptions {
  attrs: IScriptAttrs;
  appendToBody?: boolean;
  onloadCb?: () => void;
  ex?: string;
}

function createScriptElement(options: ICreateScriptOptions) {
  const { attrs, appendToBody = true, onloadCb, ex } = options;
  const { src } = attrs;
  if (!src) {
    return false;
  }

  const doc = getGlobalThis().document;
  if (isAssetExisted(`script[src="${src}"]`)) {
    return false;
  }
  if (ex && isAssetExisted(`script[data-helex="${ex}"]`)) {
    return false;
  }

  const scriptDom = doc.createElement('script');
  scriptDom.src = src;
  if (onloadCb) scriptDom.onload = onloadCb;

  if (appendToBody) doc.body.appendChild(scriptDom);
  else doc.head.appendChild(scriptDom);

  return true;
}

interface ICreateLinkOptions {
  attrs: ILinkAttrs;
  appendToBody?: boolean;
  ex?: string;
}

function createLinkElement(options: ICreateLinkOptions) {
  const { appendToBody = false, attrs, ex } = options;
  const { href, rel, as } = attrs;
  const doc = getGlobalThis().document;
  if (!href) return;
  if (ex && isAssetExisted(`link[data-helex="${ex}"]`)) {
    return;
  }

  const linkDom = doc.createElement('link');
  linkDom.rel = rel || 'stylesheet';
  linkDom.href = href;
  if (as) linkDom.as = as;

  if (appendToBody) doc.body.appendChild(linkDom);
  else doc.head.appendChild(linkDom);
}

interface ICreateDomOptions {
  webDirPath: string;
  appendToBody: boolean;
  appendCss: boolean;
  cssAppendTypes: CssAppendType[];
  excludeCssList: string[];
}

const getCssType = (webDirPath: string, cssUrl: string): CssAppendType => {
  if (cssUrl.startsWith(webDirPath)) {
    return 'build'; // 是构建生成的 css 文件
  }
  if (isRelativePath(cssUrl)) {
    return 'relative';
  }
  return 'static';
};

// 相比 as 写法，谓词可直接将 attrs 类型缩小并适用于整个 if block 块里
function isLinkAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is ILinkAttrs {
  noop(attrs);
  return ['link', 'staticLink', 'relativeLink'].includes(tag);
}

function isScriptAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is IScriptAttrs {
  noop(attrs);
  return ['script', 'staticScript', 'relativeScript'].includes(tag);
}

function getAppend(assetItem: IAssetItem) {
  const { tag, append } = assetItem;
  if (['link', 'script'].includes(tag)) {
    return true;
  }
  return append === true;
}

function createDomByAssetList(assetList: IAssetItem[], options: ICreateDomOptions) {
  const { appendToBody, appendCss, webDirPath, cssAppendTypes, excludeCssList } = options;

  assetList.forEach((v) => {
    const { tag, attrs, ex } = v;
    const append = getAppend(v);
    if (!append) {
      return;
    }
    // 处理 link 标签
    if (isLinkAttrs(tag, attrs)) {
      // Object.assign is much faster than spread operator
      const createLinkOptions = { appendToBody, attrs, ex };
      const { href } = attrs;
      // .ico 文件默认不加载
      if (href.endsWith('.ico')) {
        return;
      }

      if (href.endsWith('.css')) {
        if (
          appendCss
          && cssAppendTypes.includes(getCssType(webDirPath, href)) // 当前链接类型是合法的可以附加到 html 文档的链接类型
          && !excludeCssList.includes(href) // 当前链接没有被设置在排除链接列表里
        ) {
          createLinkElement(createLinkOptions);
        }
        return;
      }

      createLinkElement(createLinkOptions);
      return;
    }
    // 处理 script 标签
    if (isScriptAttrs(tag, attrs)) {
      createScriptElement({ appendToBody, attrs, ex });
    }
  });
}

/**
 * 加载应用各项资源
 */
export function loadAppAssets(app: ISubApp, version: ISubAppVersion, loadOptions: IInnerPreFetchOptions) {
  // 重命名，避免 @typescript-eslint/naming-convention 警告
  const { name, additional_scripts: additionalScripts = [], additional_body_scripts: additionalBodyScripts = [] } = app;
  const { headAssetList = [], bodyAssetList = [], webDirPath, chunkCssSrcList = [] } = version.src_map;
  const {
    useAdditionalScript = false,
    appendCss = true,
    cssAppendTypes = ['build', 'static', 'relative'],
    getExcludeCssList,
  } = loadOptions;
  const allExtraCssList = getAllExtraCssList(loadOptions);
  const allCssList = commonUtil.merge2List(allExtraCssList, chunkCssSrcList);
  const excludeCssList = getExcludeCssList?.(allCssList, { version }) || [];

  const createAdditionalScripts = (scripts?: string[], appendToBody?: boolean) => {
    if (!scripts) return;
    // 严格按照顺序创建
    for (const scriptUrl of scripts) {
      if (scriptUrl.endsWith('.css')) {
        if (appendCss && !excludeCssList.includes(scriptUrl)) {
          createLinkElement({ appendToBody, attrs: { href: scriptUrl, rel: 'stylesheet' } });
        }
      } else {
        createScriptElement({ appendToBody, attrs: { src: scriptUrl } });
      }
    }
  };

  if (useAdditionalScript) {
    createAdditionalScripts(additionalScripts, false);
    createAdditionalScripts(additionalBodyScripts, true);
  }

  createAdditionalScripts(allExtraCssList, false);

  const optionsCommon = { excludeCssList, webDirPath, appendCss, cssAppendTypes };
  createDomByAssetList(headAssetList, assign(optionsCommon, { appendToBody: false }));
  createDomByAssetList(bodyAssetList, assign(optionsCommon, { appendToBody: true }));
}
