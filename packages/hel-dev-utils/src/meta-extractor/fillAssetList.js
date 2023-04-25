/** @typedef {import('../../typings').SrcMap} SrcMap*/
/** @typedef {import('../../typings').IAssetInfo} IAssetInfo */
/** @typedef {import('../../typings').IUserExtractOptions} IUserExtractOptions */
import fs from 'fs';
import util from 'util';
import { ensureSlash } from '../base-utils/index';
import { noDupPush } from '../inner-utils/arr';
import { verbose } from '../inner-utils/index';
import { isNull, purify } from '../inner-utils/obj';
import { pfstr } from '../inner-utils/str';
import { getAllFilePath } from './utils';

const writeFile = util.promisify(fs.writeFile);

function isRelativePath(path) {
  if (path.startsWith('//')) return false;
  return path.startsWith('/') || path.startsWith('./') || path.startsWith('../');
}

function getAssetBase(tag, /** @type {IAssetInfo} */ assetInfo) {
  const { isBuildUrl, isNonBuildAndRelative, canAppend, el } = assetInfo;
  const { dataset = {} } = el;
  const type = el.getAttribute('type');
  const ex = dataset.ex || '';

  let tagVar = '';
  if (isBuildUrl) {
    tagVar = tag;
  } else if (isNonBuildAndRelative) {
    tagVar = tag === 'link' ? 'relativeLink' : 'relativeScript';
  } else {
    tagVar = tag === 'link' ? 'staticLink' : 'staticScript';
  }

  const toReturn = {
    tag: tagVar,
    append: canAppend,
    ex,
  };

  // other attrs may added here in the future
  if (type) {
    toReturn.type = type; // support esm, type may be 'module' for script
  }

  return toReturn;
}

function getLinkAssetBase(/** @type {IAssetInfo} */ assetInfo) {
  return getAssetBase('link', assetInfo);
}

function getScriptAssetBase(/** @type {IAssetInfo} */ assetInfo) {
  return getAssetBase('script', assetInfo);
}

let custScriptIdx = 0;

/**
 * @param {object} parseOptions
 * @param {IUserExtractOptions} extractOptions
 */
async function writeInnerHtml(childDom, fileType, extractOptions) {
  const { appInfo, buildDirFullPath } = extractOptions;
  const { innerHTML } = childDom;
  if (!innerHTML) return '';

  verbose(`found a user customized ${fileType} tag node in html, try extract its content and write them to local fs`);
  custScriptIdx += 1;
  const scriptName = `hel_userChunk_${custScriptIdx}.${fileType}`;
  const fileAbsolutePath = `${buildDirFullPath}/${scriptName}`;
  const fileWebPath = `${ensureSlash(appInfo.homePage, false)}/${scriptName}`;

  await writeFile(fileAbsolutePath, innerHTML);
  verbose(`write done, the web file will be ${fileWebPath} later`);
  return fileWebPath;
}

function getAssetInfo(/** @type string */ url, options) {
  const { homePage, extractMode, enableRelativePath, el } = options;
  const { dataset = {} } = el;
  // 是构建生成的产物路径
  const isBuildUrl = url.startsWith(homePage);
  const isRelative = isRelativePath(url);
  // 是 homePage 之外相对路径导入的产物路径
  const isNonBuildAndRelative = !isBuildUrl && isRelative;
  // 设置了 extractMode 为 build 和 build_no_html 时，当前产物路径是非构建生成的，则直接忽略，不记录到 assetList 数据里
  const ignoreAddToAssetList = !isBuildUrl && (extractMode === 'build' || extractMode === 'build_no_html');
  let allowAddToAssetList = !ignoreAddToAssetList;
  if (!allowAddToAssetList) {
    verbose(` >>> ignore add asset [${url}] to assetList by extractMode=${extractMode}`);
  }

  // 未显式设置 data-helappend 时，helappend 默认值会走内部逻辑来决定如何赋值
  let helAppendValOfDataset = dataset['helappend'];
  let helAppendValOfInnerLogic = '';
  if (helAppendValOfDataset && !['1', '0'].includes(helAppendValOfDataset)) {
    throw new Error(`found invalid helappend value [${helAppendValOfDataset}], only accpet 1 or 0 currently`);
  }

  if (isNonBuildAndRelative) {
    // 如下面错误描述所示，在既没有设置 enableRelativePath=true，又没有显式的标记 data-helappend 的情况下
    // 不允许 homePage 之外的相对路径导入的资源存在
    // 所以对于此类 homePage 之外的相对路径导入的资源，要么用户设置 enableRelativePath=true，要么显式的标记 data-helappend
    // 设置 enableRelativePath=true 后，优先读可能已存在的 data-helappend 值，没有则默认为 0，表示不加载
    // 不设置 enableRelativePath=true 的话，则需要用户一定标记 data-helappend 值
    if (!enableRelativePath && !helAppendValOfDataset) {
      throw new Error(
        pfstr(`
        found asset url [${url}] is a relative path, it is obviously not a valid url for cdn architecture deploy!
        but if you are sure this url is valid, there are 2 ways to skip this error occured, you can choose any one of them:
        1. pass enableRelativePath true to hel-dev-utils.extractHelMetaJson method options.
        2. add data-helappend="0" on the asset dom attribute to tell hel-dev-utils ignore this asset.

        hel-dev-utils will mark this url as relativeLink or relativeScript, and set append as false,
        if you want sdk append this asset, you can explicitly add data-helappend="1" on the asset dom attribute.
        a demo will be like:<script src="./a/b.js" data-helappend="1"></script>,<br/>
        note that the asset will depend on your host site seriously under this situation.
      `),
      );
    }

    // 构建时设置 enableRelativePath=true，则允许此类【homePage之外相对路径导入的产物】加入到资源清单列表里
    allowAddToAssetList = true;
    helAppendValOfInnerLogic = helAppendValOfDataset || '0'; // 没有显示设定 data-helappend 时默认标记为不加载
  } else if (url.endsWith('.ico')) {
    helAppendValOfInnerLogic = '0'; // ico 文件特殊处理，默认是不加载的
  } else {
    helAppendValOfInnerLogic = '1'; // 标记为可加载
  }

  const helAppendVal = helAppendValOfDataset || helAppendValOfInnerLogic;
  const helAppend = helAppendVal === '1';
  const ex = dataset['helex'] || '';

  if (ex && !helAppend) {
    // 设置了 helex 但同时设置了不加载，会造成歧义，当前版本是不允许的
    throw new Error(`found conflict setting: [helex="${ex}"]、[helappend="${helAppendVal}"], remove one of them!`);
  }

  return {
    url,
    el,
    isBuildUrl,
    isNonBuildAndRelative,
    canAppend: helAppend,
    allowAddToAssetList,
  };
}

/**
 * 提取link、script标签数据并填充到目标assetList
 * @param {HTMLCollectionOf<HTMLScriptElement>} doms
 * @param {object} parseOptions
 * @param {SrcMap} parseOptions.srcMap
 * @param {boolean} parseOptions.isHead
 * @param {IUserExtractOptions} parseOptions.extractOptions
 */
export async function fillAssetList(doms, parseOptions) {
  const { srcMap, isHead, extractOptions } = parseOptions;
  const { appInfo, enableReplaceDevJs = true, enableRelativePath = false, enablePrefixHomePage = false } = extractOptions;
  const {
    headAssetList,
    bodyAssetList,
    extractMode,
    chunkCssSrcList,
    staticCssSrcList,
    relativeCssSrcList,
    privCssSrcList,
    chunkJsSrcList,
    staticJsSrcList,
    relativeJsSrcList,
  } = srcMap;
  const { homePage } = appInfo;
  const assetList = isHead ? headAssetList : bodyAssetList;

  const len = doms.length;
  const replaceContentList = [];
  verbose(`extractMode is [${extractMode}]`);

  const pushToSrcList = (assetType, /** @type {IAssetInfo} */ assetInfo) => {
    const { isBuildUrl, isNonBuildAndRelative, url } = assetInfo;
    const isAllExtractMode = extractMode === 'all' || extractMode === 'all_no_html';

    if (assetType === 'css') {
      if (isBuildUrl) {
        return noDupPush(chunkCssSrcList, url);
      }
      if (isAllExtractMode) {
        const list = isNonBuildAndRelative ? relativeCssSrcList : staticCssSrcList;
        return noDupPush(list, url);
      }
    }

    if (isBuildUrl) {
      return noDupPush(chunkJsSrcList, url);
    }
    if (isAllExtractMode) {
      const list = isNonBuildAndRelative ? relativeJsSrcList : staticJsSrcList;
      return noDupPush(list, url);
    }
  };

  const mayPrefixHomePage = (url) => {
    if (enablePrefixHomePage) {
      if (url.startsWith('/') && !url.startsWith('//')) {
        verbose(` >>> prefix homePage [${homePage}] for url [${url}]`);
        const finalUrl = `${ensureSlash(homePage)}${url}`;
        replaceContentList.push({ toMatch: `="${url}"`, toReplace: `="${finalUrl}"` });
        return finalUrl;
      }
    }
    return url;
  };

  for (let i = 0; i < len; i++) {
    const childDom = doms[i];
    const { tagName, crossorigin, dataset = {} } = childDom;
    let toPushAsset = null;
    let allowAddToAssetList = false;
    const assetOptions = { el: childDom, homePage, extractMode, enableRelativePath, type };

    if (!['LINK', 'SCRIPT', 'STYLE'].includes(tagName)) {
      continue;
    }
    if (!isNull(dataset)) {
      verbose(`found ${tagName} dataset`, dataset);
    }

    if (tagName === 'LINK') {
      const { as, rel, hreflang = '' } = childDom;
      if (!childDom.href) continue;

      let href = mayPrefixHomePage(childDom.href);
      verbose(`analyze link href[${href}] as[${as}] rel[${rel}]`);
      // 一些使用了老版本cra的项目，这两个href 在修改了 publicPath 后也不被添加前缀，这里做一下修正
      const legacyHrefs = ['/manifest.json', '/favicon.ico'];
      if (legacyHrefs.includes(href)) {
        href = `${homePage}${href}`;
        replaceContentList.push({ toMatch: href, toReplace: href });
      }

      const assetInfo = getAssetInfo(href, assetOptions);
      allowAddToAssetList = assetInfo.allowAddToAssetList;

      if (hreflang.startsWith('PRIV_CSS')) {
        noDupPush(privCssSrcList, href);
      }
      // 供 shadow-dom 或其他需要知道当前应用所有样式列表的场景用
      if (href.endsWith('.css')) {
        pushToSrcList('css', assetInfo);
      }
      toPushAsset = { ...getLinkAssetBase(assetInfo), attrs: { href, as, rel, crossorigin } };
    } else if (tagName === 'SCRIPT') {
      const { src } = childDom;
      let targetSrc = src;
      if (!targetSrc) {
        targetSrc = await writeInnerHtml(childDom, 'js', extractOptions);
      }
      if (!targetSrc) continue;

      targetSrc = mayPrefixHomePage(targetSrc);
      verbose(`analyze script src[${targetSrc}]`);
      if (enableReplaceDevJs) {
        // 替换用户的 development 模式的 react 相关包体
        if (targetSrc.endsWith('react.dev.js')) {
          const toReplace = targetSrc.replace('react.dev.js', 'react.js');
          replaceContentList.push({ toMatch: targetSrc, toReplace });
          targetSrc = toReplace;
        }
        // 替换用户的 development 模式的 vue 相关包体
        if (targetSrc.endsWith('vue.dev.js')) {
          const toReplace = targetSrc.replace('vue.dev.js', 'vue.js');
          replaceContentList.push({ toMatch: targetSrc, toReplace });
          targetSrc = toReplace;
        }
      }

      const assetInfo = getAssetInfo(targetSrc, assetOptions);
      allowAddToAssetList = assetInfo.allowAddToAssetList;

      pushToSrcList('js', assetInfo);
      toPushAsset = { ...getScriptAssetBase(assetInfo), attrs: { src: targetSrc, crossorigin } };
    } else if (tagName === 'STYLE') {
      // style 标签转换为 css 文件存起来
      let href = await writeInnerHtml(childDom, 'css', extractOptions);
      if (!href) continue;

      href = mayPrefixHomePage(href);
      const assetInfo = getAssetInfo(href, assetOptions);
      allowAddToAssetList = assetInfo.allowAddToAssetList;

      pushToSrcList('css', assetInfo);
      toPushAsset = { ...getLinkAssetBase(assetInfo), attrs: { href, rel: 'stylesheet' } };
    }

    if (toPushAsset && allowAddToAssetList) {
      const judgeValueValid = (value, key) => {
        if (key === 'crossorigin') return !isNull(value, { nullValues: [null, undefined] });
        return !isNull(value);
      };

      toPushAsset.attrs = purify(toPushAsset.attrs, judgeValueValid);
      assetList.push(toPushAsset);
    }
  }

  return replaceContentList;
}

/**
 * @param {{ srcMap:SrcMap, htmlContent:string, hasReplacedContent:boolean }} parsedRet
 * @param {IUserExtractOptions} extractOptions
 */
export async function fillAssetListByDist(parsedRet, extractOptions) {
  const { buildDirFullPath, appInfo } = extractOptions;
  const { homePage } = appInfo;
  const { srcMap } = parsedRet;
  const fileFullPathList = getAllFilePath(buildDirFullPath);
  verbose('filePathList', fileFullPathList);

  fileFullPathList.forEach((fileAbsolutePath) => {
    //  获取文件处于build目录下的相对路径，形如：
    //  /static/js/runtime-main.66c45929.js
    //  /asset-manifest.json
    const filePathUnderBuild = fileAbsolutePath.split(buildDirFullPath)[1];

    // 避免 buildDirFullPath 是以 / 结尾的，导致 filePathUnderBuild 非 / 开头
    const maySlash = filePathUnderBuild.startsWith('/') ? '' : '/';
    // 拼出 web 路径
    const fileWebPath = `${ensureSlash(homePage)}${maySlash}${filePathUnderBuild}`;

    // 补上剩余的 css 文件路径
    if (fileWebPath.endsWith('.css')) {
      noDupPush(srcMap.chunkCssSrcList, fileWebPath);
    } else if (fileWebPath.endsWith('.js')) {
      noDupPush(srcMap.chunkJsSrcList, fileWebPath);
    }
  });
}
