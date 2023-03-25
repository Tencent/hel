import { getGlobalThis, commonUtil } from 'hel-micro-core';
import type { IAssetItem, IAssetItemAttrs, ILinkAttrs, IScriptAttrs, ISubApp, ISubAppVersion, ItemTag } from 'hel-types';
import type { CssAppendType, IChangeAttrs, IInnerPreFetchOptions, ILinkInfo, IScriptInfo } from '../types';
import { getAllExtraCssList, helLinkId, helScriptId } from '../util';

const { noop } = commonUtil;

/**
 * 做一下净化处理
 * @param domBaseURI - http://localhost:3000/ or http://localhost:3000/xx/yy/copyright
 * @returns
 */
function pureDomBaseURI(domBaseURI: string) {
  // http://localhost:3000/xx/yy/copyright --> localhost:3000/xx/yy/copyright
  const [protocolStr, restStr] = domBaseURI.split('//');

  const arr = restStr.split('/'); // arr2[0]---> localhost:3000
  // 'http:' + '//' + 'localhost:3000' + '/';
  return `${protocolStr}//${arr[0]}/`;
}

/**
 *
 * @param dom
 * @param src - /xx/yy/static/js/runtime-main.fe4e0898.js
 * @returns
 */
function isDomSrcEqualSrc(dom: HTMLScriptElement, src: string) {
  /**
    if same origin
    dom.src http://localhost:3000/xx/yy/static/js/runtime-main.fe4e0898.js
    dom.baseURI http://localhost:3000/

    if different origin
    dom.src https://xxx.cdn.com/js/libs/lib-name/lib-bundle-v1.0.0.min.js
    dom.baseURI http://localhost:3000/
   *
   */
  const domSrc = dom.src;
  const domBaseURI = pureDomBaseURI(dom.baseURI);

  let toCompareSrc = domSrc;
  if (domSrc.startsWith(domBaseURI)) {
    // if no length - 1:  toCompareSrc will be "xx/yy/static/js/runtime-main.fe4e0898.js"
    // but src is "/xx/yy/static/js/runtime-main.fe4e0898.js"
    toCompareSrc = domSrc.substring(domBaseURI.length - 1);
  }
  return toCompareSrc === src;
}

function isScriptExisted(scriptId: string, src: string) {
  // avoid error: '#helScript_@xxx/yyy' is not a valid selector.
  const doc = getGlobalThis()?.document;
  let result = false;
  if (!doc) {
    return result;
  }

  try {
    // 为跳过其他错误干扰正常运行，此处不适合单独 try querySelectorAll
    const doms = doc.querySelectorAll(`#${scriptId}`);
    const len = doms.length;
    for (let i = 0; i < len; i++) {
      const dom = doms[i];
      if (dom.nodeName === 'SCRIPT' && isDomSrcEqualSrc(dom as HTMLScriptElement, src)) {
        result = true;
        break;
      }
    }

    return result;
  } catch (err: any) {
    return result;
  }
}

function tryCallChangeAttrs(
  tag: 'link' | 'script',
  tryOptions: {
    appName: string;
    appGroupName: string;
    el: HTMLLinkElement | HTMLScriptElement;
    attrs: ILinkAttrs | IScriptAttrs;
    changeAttrs?: IChangeAttrs;
  },
) {
  const { changeAttrs } = tryOptions;
  if (changeAttrs) {
    const { appName, appGroupName, el, attrs } = tryOptions;
    const isLink = <Tag extends 'link' | 'script'>(
      tag: Tag,
      info: { el: HTMLLinkElement | HTMLScriptElement; attrs: ILinkAttrs | IScriptAttrs },
    ): info is Tag extends 'link' ? ILinkInfo : IScriptInfo => {
      noop(info);
      return tag === 'link';
    };
    changeAttrs(el, { appName, appGroupName, attrs, tag, isLink });
  }
}

interface ICreateScriptOptions {
  attrs: IScriptAttrs;
  appGroupName: string;
  appendToBody?: boolean;
  changeAttrs?: IChangeAttrs;
  onloadCb?: () => void;
}

function createScriptElement(appName: string, options: ICreateScriptOptions) {
  const { attrs, appendToBody = true, appGroupName, onloadCb, changeAttrs } = options;
  const { src } = attrs;
  if (!src) {
    return false;
  }

  const doc = getGlobalThis().document;
  const scriptId = helScriptId(appName);
  if (isScriptExisted(scriptId, src)) {
    return false;
  }

  const scriptDom = doc.createElement('script');
  scriptDom.id = scriptId;
  scriptDom.src = src;
  if (onloadCb) scriptDom.onload = onloadCb;
  tryCallChangeAttrs('script', { appName, appGroupName, el: scriptDom, attrs, changeAttrs });

  if (appendToBody) doc.body.appendChild(scriptDom);
  else doc.head.appendChild(scriptDom);

  return true;
}

interface ICreateLinkOptions {
  attrs: ILinkAttrs;
  appGroupName: string;
  appendToBody?: boolean;
  changeAttrs?: IChangeAttrs;
}

function createLinkElement(appName: string, options: ICreateLinkOptions) {
  const { appGroupName, appendToBody = false, attrs, changeAttrs } = options;
  const { href, rel, as } = attrs;
  const doc = getGlobalThis().document;
  if (!href) return;

  const linkDom = doc.createElement('link');
  linkDom.id = helLinkId(appName);
  linkDom.rel = rel || 'stylesheet';
  linkDom.href = href;
  if (as) linkDom.as = as;
  tryCallChangeAttrs('link', { appName, appGroupName, el: linkDom, attrs, changeAttrs });

  if (appendToBody) doc.body.appendChild(linkDom);
  else doc.head.appendChild(linkDom);
}

interface ICreateDomOptions {
  appGroupName: string;
  webDirPath: string;
  appendToBody: boolean;
  appendCss: boolean;
  cssAppendTypes: CssAppendType[];
  excludeCssList: string[];
  changeAttrs?: IChangeAttrs;
}

const getCssType = (webDirPath: string, cssUrl: string): CssAppendType => {
  if (cssUrl.startsWith(webDirPath)) {
    return 'build'; // 是构建生成的新css文件
  }
  return 'static';
};

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
  const { appGroupName, appendToBody, appendCss, webDirPath, cssAppendTypes, excludeCssList, changeAttrs } = options;

  assetList.forEach((v) => {
    const { tag, attrs } = v;
    // 处理 link 标签
    if (isLinkAttrs(tag, attrs)) {
      const createLinkOptions = { appGroupName, appendToBody, attrs, changeAttrs };
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
          createLinkElement(appName, createLinkOptions);
        }
        return;
      }

      createLinkElement(appName, createLinkOptions);
      return;
    }
    // 处理 script 标签
    if (isScriptAttrs(tag, attrs)) {
      createScriptElement(appName, { appGroupName, appendToBody, attrs, changeAttrs });
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
  const {
    useAdditionalScript = false,
    appendCss = true,
    changeAttrs,
    cssAppendTypes = ['static', 'build'],
    getExcludeCssList,
  } = loadOptions;
  const allExtraCssList = getAllExtraCssList(loadOptions);
  const allCssList = commonUtil.merge2List(allExtraCssList, chunkCssSrcList);
  const excludeCssList = getExcludeCssList?.(allCssList, { version }) || [];

  const createAdditionalScripts = (scripts?: string[], appendToBody?: boolean) => {
    if (!scripts) return;
    // 严格按照顺序创建
    for (const scriptUrl of scripts) {
      if (scriptUrl.endsWith('.css') && appendCss && !excludeCssList.includes(scriptUrl)) {
        createLinkElement(name, { appGroupName, appendToBody, attrs: { href: scriptUrl, rel: 'stylesheet' }, changeAttrs });
      } else {
        createScriptElement(name, { appGroupName, appendToBody, attrs: { src: scriptUrl }, changeAttrs });
      }
    }
  };

  if (useAdditionalScript) {
    createAdditionalScripts(additionalScripts, false);
    createAdditionalScripts(additionalBodyScripts, true);
  }

  createAdditionalScripts(allExtraCssList, false);

  const optionsCommon = { appGroupName, excludeCssList, webDirPath, appendCss, cssAppendTypes, changeAttrs };
  createDomByAssetList(name, headAssetList, { appendToBody: false, ...optionsCommon });
  createDomByAssetList(name, bodyAssetList, { appendToBody: true, ...optionsCommon });
}
