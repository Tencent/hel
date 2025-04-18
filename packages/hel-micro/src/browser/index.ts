import { commonUtil, getGlobalThis } from 'hel-micro-core';
import type { IAssetItem, IAssetItemAttrs, IAttrsBase, ILinkAttrs, IScriptAttrs, ISubApp, ISubAppVersion, ItemTag } from 'hel-types';
import type { AssetUrlType, IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList } from '../util';
import { getAssetUrlType } from './helper';

const { noop, okeys } = commonUtil;
const assign = Object.assign;

/**
 * hel-iso 4.4.0+ 会读取此变量，用于辅助判断载入的应用是否是子应用
 */
function markHelLoadAssetsFlag() {
  const g: any = getGlobalThis();
  g.__HEL_LOAD_ASSETS_FLAG__ = 1;
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

/**
 * 识别 data-helappend data-helex 原语来确定资源是否能加载
 */
function canAppendByHelMark(attrs: Record<string, any>, tag: string) {
  const ex = attrs['data-helex'];
  const helAppend = attrs['data-helappend'];
  const g = getGlobalThis();

  if (helAppend === '0') {
    return false;
  }

  // check is ex loaded，此功能用于支持需延迟加载的 externals
  if (ex) {
    // @ts-ignore avoid error: type {xxx} was found on type 'typeof globalThis'.
    if (tag === 'script' && g[ex]) {
      // script 型的 ex，优先查 globalThis 上是否已绑定，已绑定则不能加载相同 ex 标记的资源了
      return false;
    }
    // 查 helex 特征值对应的资源是否存在
    const isExisted = isAssetExisted(`${tag}[data-helex="${ex}"]`);
    return !isExisted; // 不存在才加载
  }

  return true;
}

function appendEl(el: HTMLElement, attrs: Record<string, string>, appendToBody: boolean) {
  const doc = getGlobalThis().document;
  okeys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
  if (appendToBody) doc.body.appendChild(el);
  else doc.head.appendChild(el);
}

function setInnerText(el: HTMLScriptElement, innerText: string) {
  // 优先追加为 textContent 属性值，避免无效的 html 元素产生
  // @see https://github.com/Tencent/hel/issues/105
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  if (el.textContent === '') {
    el.textContent = innerText;
  } else {
    el.innerText = innerText;
  }
}

interface ICreateScriptOptions {
  attrs: IScriptAttrs;
  innerText?: string;
  appendToBody?: boolean;
  onloadCb?: () => void;
}

function createScriptElement(options: ICreateScriptOptions) {
  const { attrs, innerText, appendToBody = true, onloadCb } = options;
  const { src, ...rest } = attrs;
  const restObj: Record<string, any> = rest;
  if (!src && !innerText) {
    return false;
  }

  const doc = getGlobalThis().document;
  if (src && isAssetExisted(`script[src="${src}"]`)) {
    return false;
  }
  if (!canAppendByHelMark(restObj, 'script')) {
    return false;
  }

  const el = doc.createElement('script');
  if (src) el.setAttribute('src', src);
  okeys(restObj).forEach((key) => el.setAttribute(key, restObj[key]));
  if (onloadCb) el.onload = onloadCb;
  if (innerText) setInnerText(el, innerText);

  appendEl(el, restObj, appendToBody);
  return true;
}

interface ICreateLinkOptions {
  attrs: ILinkAttrs;
  innerText?: string;
  appendToBody?: boolean;
}

function createLinkElement(options: ICreateLinkOptions) {
  const { appendToBody = false, innerText, attrs } = options;
  const { href, rel, ...rest } = attrs;
  const restObj: Record<string, any> = rest;
  const doc = getGlobalThis().document;
  if (!href && !innerText) return;
  if (!canAppendByHelMark(restObj, 'link')) {
    return false;
  }

  const el = doc.createElement('link');
  if (href) {
    el.setAttribute('href', href);
    el.setAttribute('rel', rel || 'stylesheet');
  } else if (rel) {
    // 无 href 时，不默认 rel 为 'stylesheet'
    el.setAttribute('rel', rel);
  }
  if (innerText) el.innerText = innerText;

  appendEl(el, restObj, appendToBody);
}

interface ICreateStyleOptions {
  attrs: IAttrsBase;
  innerText?: string;
  appendToBody?: boolean;
}

function createStyleElement(options: ICreateStyleOptions) {
  const { appendToBody = false, innerText = '', attrs } = options;
  const doc = getGlobalThis().document;
  const el = doc.createElement('style');
  el.innerText = innerText;

  appendEl(el, attrs, appendToBody);
}

interface ICreateDomOptions {
  webDirPath: string;
  appendToBody: boolean;
  appendCss: boolean;
  cssAppendTypes: AssetUrlType[];
  excludeCssList: string[];
}

// 相比 as 写法，谓词可直接将 attrs 类型缩小并适用于整个 if block 块里
function isLinkAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is ILinkAttrs {
  noop(attrs);
  return ['link', 'staticLink', 'relativeLink'].includes(tag);
}

function isScriptAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is IScriptAttrs {
  noop(attrs);
  return ['script', 'staticScript', 'relativeScript'].includes(tag);
}

function createDomByAssetList(assetList: IAssetItem[], options: ICreateDomOptions) {
  const { appendToBody, appendCss, webDirPath, cssAppendTypes, excludeCssList } = options;

  assetList.forEach((v) => {
    // 兼容历史元数据，无 append 的话就默认为 true
    const { tag, attrs, append = true, innerText = '' } = v;
    if (!append) {
      return;
    }
    // 处理 link 标签
    if (isLinkAttrs(tag, attrs)) {
      const createLinkOptions = { appendToBody, attrs, innerText };
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
          createLinkElement(createLinkOptions);
        }
        return;
      }

      createLinkElement(createLinkOptions);
      return;
    }
    // 处理 script 标签
    if (isScriptAttrs(tag, attrs)) {
      createScriptElement({ appendToBody, attrs, innerText });
    }
    // 处理 style 标签
    if (tag === 'style') {
      createStyleElement({ appendToBody, attrs, innerText });
    }
  });
}

/**
 * 加载应用首屏的各项资源
 */
export function loadAppAssets(app: ISubApp, version: ISubAppVersion, loadOptions: IInnerPreFetchOptions) {
  markHelLoadAssetsFlag();
  // 重命名，避免 @typescript-eslint/naming-convention 警告
  const { additional_scripts: additionalScripts = [], additional_body_scripts: additionalBodyScripts = [] } = app;
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

  const createAdditionalAssets = (scripts?: string[], appendToBody?: boolean) => {
    if (!scripts) return;
    // 严格按照顺序创建
    for (const scriptUrl of scripts) {
      if (scriptUrl.endsWith('.css')) {
        if (appendCss && !excludeCssList.includes(scriptUrl)) {
          createLinkElement({ appendToBody, attrs: { href: scriptUrl } });
        }
      } else {
        createScriptElement({ appendToBody, attrs: { src: scriptUrl } });
      }
    }
  };

  if (useAdditionalScript) {
    createAdditionalAssets(additionalScripts, false);
    createAdditionalAssets(additionalBodyScripts, true);
  }

  createAdditionalAssets(allExtraCssList, false);

  const optionsCommon = { excludeCssList, webDirPath, appendCss, cssAppendTypes };
  // Object.assign is much faster than spread operator
  createDomByAssetList(headAssetList, assign(optionsCommon, { appendToBody: false }));
  createDomByAssetList(bodyAssetList, assign(optionsCommon, { appendToBody: true }));
}
