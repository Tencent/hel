import type { ISubApp, ISubAppVersion, IAssetItem, ILinkAttrs, IScriptAttrs, ItemTag, IAssetItemAttrs } from 'hel-types';
import type { IInnerPreFetchOptions, CssAppendType } from '../types';
import { getGlobalThis } from 'hel-micro-core';
import { helScriptId, helLinkId } from '../util';

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
  const doms = getGlobalThis().document.querySelectorAll(`#${scriptId}`);
  const len = doms.length;
  let result = false;
  for (let i = 0; i < len; i++) {
    const dom = doms[i];
    if (dom.nodeName === 'SCRIPT' && isDomSrcEqualSrc(dom as HTMLScriptElement, src)) {
      result = true;
      break;
    }
  }

  return result;
}


function createScriptElement(appName: string, src: string, appendToBody = true, onloadCb?: () => void) {
  if (!src) return;
  const doc = getGlobalThis().document;
  const scriptId = helScriptId(appName);
  if (isScriptExisted(scriptId, src)) {
    return false;
  }

  const scriptDom = doc.createElement('script');
  scriptDom.id = scriptId;
  scriptDom.src = src;
  if (onloadCb) scriptDom.onload = onloadCb;

  if (appendToBody) doc.body.appendChild(scriptDom);
  else doc.head.appendChild(scriptDom);

  return true;
}


function createLinkElement(appName: string, appendToBody = false, linkAttrs: ILinkAttrs) {
  const { href, rel, as } = linkAttrs;
  const doc = getGlobalThis().document;
  if (!href) return;

  const linkDom = doc.createElement('link');
  linkDom.id = helLinkId(appName);
  linkDom.rel = rel;
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
    return 'build'; // 是构建生成的新css文件
  }
  return 'static';
};


// 相比 as 写法，谓词可直接将 attrs 类型缩小并适用于整个 if block 块里
function isLinkAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is ILinkAttrs {
  return tag === 'link';
}


function isScriptAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is IScriptAttrs {
  return tag === 'script';
}


function createDomByAssetList(appName: string, assetList: IAssetItem[], options: ICreateDomOptions) {
  const { appendToBody, appendCss, webDirPath, cssAppendTypes, excludeCssList } = options;

  assetList.forEach(v => {
    const { tag, attrs } = v;
    if (isLinkAttrs(tag, attrs)) {
      const { href } = attrs;
      // .ico 文件默认不加载
      if (href.endsWith('.ico')) {
        return;
      }

      if (href.endsWith('.css')) {
        if (appendCss
          && cssAppendTypes.includes(getCssType(webDirPath, href)) // 当前链接类型是合法的可以附加到 html 文档的链接类型
          && !excludeCssList.includes(href) // 当前链接没有被设置在排除链接列表里
        ) {
          createLinkElement(appName, appendToBody, attrs);
        }
        return;
      }

      createLinkElement(appName, appendToBody, attrs);
    } else if (isScriptAttrs(tag, attrs)) {
      const { src } = attrs;
      createScriptElement(appName, src, appendToBody);
    }
  });
}


/**
 * 加载应用各项资源
 */
export function loadAppAssets(app: ISubApp, version: ISubAppVersion, loadOptions: IInnerPreFetchOptions) {
  // 重命名，避免 @typescript-eslint/naming-convention 警告
  const {
    name, additional_scripts: additionalScripts = [], additional_body_scripts: additionalBodyScripts = [],
  } = app;
  const { headAssetList = [], bodyAssetList = [], webDirPath, chunkCssSrcList } = version.src_map;
  const {
    useAdditionalScript = false, appendCss = true, cssAppendTypes = ['static', 'build'],
    getExcludeCssList,
  } = loadOptions;
  const excludeCssList = getExcludeCssList?.(chunkCssSrcList, { version }) || [];

  const createAdditionalScripts = (scripts?: string[], appendToBody?: boolean) => {
    if (!scripts) return;
    // 严格按照顺序创建
    for (const scriptUrl of scripts) {
      if (scriptUrl.endsWith('.css')) {
        createLinkElement(name, appendToBody, { href: scriptUrl, rel: 'stylesheet' });
      } else {
        createScriptElement(name, scriptUrl, appendToBody);
      }
    }
  };

  if (useAdditionalScript) {
    createAdditionalScripts(additionalScripts, false);
    createAdditionalScripts(additionalBodyScripts, true);
  }

  const optionsCommon = { excludeCssList, webDirPath, appendCss, cssAppendTypes };
  createDomByAssetList(name, headAssetList, { appendToBody: false, ...optionsCommon });
  createDomByAssetList(name, bodyAssetList, { appendToBody: true, ...optionsCommon });
}
