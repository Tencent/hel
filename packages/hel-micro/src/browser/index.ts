import { commonUtil, getGlobalThis, markElFeature } from 'hel-micro-core';
import type { IAssetItem, IAssetItemAttrs, ILinkAttrs, IScriptAttrs, ISubApp, ISubAppVersion, ItemTag } from 'hel-types';
import type { CssAppendType, IInnerPreFetchOptions } from '../types';
import { getAllExtraCssList } from '../util';

const { noop } = commonUtil;

function isAssetExisted(domType: string, src: string) {
  try {
    const doc = getGlobalThis()?.document;
    const el = doc.querySelector(`${domType}[src="${src}"]`);
    return !!el;
  } catch (err: any) {
    return false;
  }
}

interface ICreateScriptOptions {
  platform: string;
  attrs: IScriptAttrs;
  appGroupName: string;
  appendToBody?: boolean;
  onloadCb?: () => void;
}

function createScriptElement(appName: string, options: ICreateScriptOptions) {
  const { platform, attrs, appendToBody = true, appGroupName, onloadCb } = options;
  const { src } = attrs;
  if (!src) {
    return false;
  }

  const doc = getGlobalThis().document;
  if (isAssetExisted('script', src)) {
    return false;
  }

  const scriptDom = doc.createElement('script');
  scriptDom.src = src;
  markElFeature(scriptDom, platform, appGroupName, appName);
  if (onloadCb) scriptDom.onload = onloadCb;

  if (appendToBody) doc.body.appendChild(scriptDom);
  else doc.head.appendChild(scriptDom);

  return true;
}

interface ICreateLinkOptions {
  platform: string;
  attrs: ILinkAttrs;
  appGroupName: string;
  appendToBody?: boolean;
}

function createLinkElement(appName: string, options: ICreateLinkOptions) {
  const { platform, appGroupName, appendToBody = false, attrs } = options;
  const { href, rel, as } = attrs;
  const doc = getGlobalThis().document;
  if (!href) return;

  const linkDom = doc.createElement('link');
  linkDom.rel = rel || 'stylesheet';
  linkDom.href = href;
  markElFeature(linkDom, platform, appGroupName, appName);
  if (as) linkDom.as = as;

  if (appendToBody) doc.body.appendChild(linkDom);
  else doc.head.appendChild(linkDom);
}

interface ICreateDomOptions {
  platform: string;
  appGroupName: string;
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
  noop(attrs);
  return tag === 'link';
}

function isScriptAttrs(tag: ItemTag, attrs: IAssetItemAttrs): attrs is IScriptAttrs {
  noop(attrs);
  return tag === 'script';
}

function createDomByAssetList(appName: string, assetList: IAssetItem[], options: ICreateDomOptions) {
  const { platform, appGroupName, appendToBody, appendCss, webDirPath, cssAppendTypes, excludeCssList } = options;

  assetList.forEach((v) => {
    const { tag, attrs } = v;
    // 处理 link 标签
    if (isLinkAttrs(tag, attrs)) {
      const createLinkOptions = { platform, appGroupName, appendToBody, attrs };
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
      createScriptElement(appName, { platform, appGroupName, appendToBody, attrs });
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
    platform = '',
    useAdditionalScript = false,
    appendCss = true,
    cssAppendTypes = ['static', 'build'],
    getExcludeCssList,
  } = loadOptions;
  const allExtraCssList = getAllExtraCssList(loadOptions);
  const allCssList = commonUtil.merge2List(allExtraCssList, chunkCssSrcList);
  const excludeCssList = getExcludeCssList?.(allCssList, { version }) || [];

  const createAdditionalScripts = (scripts?: string[], appendToBody?: boolean) => {
    if (!scripts) return;
    const optionsCommon = { platform, appGroupName, appendToBody };
    // 严格按照顺序创建
    for (const scriptUrl of scripts) {
      if (scriptUrl.endsWith('.css')) {
        if (appendCss && !excludeCssList.includes(scriptUrl)) {
          createLinkElement(name, { ...optionsCommon, attrs: { href: scriptUrl, rel: 'stylesheet' } });
        }
      } else {
        createScriptElement(name, { ...optionsCommon, attrs: { src: scriptUrl } });
      }
    }
  };

  if (useAdditionalScript) {
    createAdditionalScripts(additionalScripts, false);
    createAdditionalScripts(additionalBodyScripts, true);
  }

  createAdditionalScripts(allExtraCssList, false);

  const optionsCommon = { appGroupName, excludeCssList, webDirPath, appendCss, cssAppendTypes, platform };
  createDomByAssetList(name, headAssetList, { appendToBody: false, ...optionsCommon });
  createDomByAssetList(name, bodyAssetList, { appendToBody: true, ...optionsCommon });
}
