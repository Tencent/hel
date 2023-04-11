/** @typedef {import('../../typings').SrcMap} SrcMap*/
/** @typedef {{isBuildUrl:boolean, isNonBuildAndRelative: boolean, url:string}} UrlInfo */
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

function getAssetBase(tag, /** @type UrlInfo */ urlInfo, dataset) {
  const { isBuildUrl, isNonBuildAndRelative, url } = urlInfo;
  // 仅当显式设置了 data-helappend="1" 时，才标识为 hel-micro sdk 加载首屏应用时需要载入的资源
  const canAppend = dataset['helappend'] === '1';

  if (isBuildUrl) {
    return {
      tag,
      // 非ico文件一定是true，ico 文件需要显式设置 helappend
      append: url.endsWith('.ico') ? canAppend : true,
    };
  }

  const ex = dataset['helex'] || '';
  const append = !!(canAppend || ex);

  if (isNonBuildAndRelative) {
    return {
      tag: tag === 'link' ? 'relativeLink' : 'relativeScript',
      append,
      ex,
    };
  }

  return {
    tag: tag === 'link' ? 'staticLink' : 'staticScript',
    append,
    ex,
  };
}

function getLinkAssetBase(/** @type UrlInfo */ urlInfo, dataset) {
  return getAssetBase('link', urlInfo, dataset);
}

function getScriptAssetBase(/** @type UrlInfo */ urlInfo, dataset) {
  return getAssetBase('script', urlInfo, dataset);
}

let custScriptIdx = 0;

/**
 * @param {object} parseOptions
 * @param {import('../../typings').IUserExtractOptions} extractOptions
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

/**
 * 提取link、script标签数据并填充到目标assetList
 * @param {HTMLCollectionOf<HTMLScriptElement>} doms
 * @param {object} parseOptions
 * @param {SrcMap} parseOptions.srcMap
 * @param {boolean} parseOptions.isHead
 * @param {import('../../typings').IUserExtractOptions} parseOptions.extractOptions
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

  const getUrlInfo = (/** @type string */ url) => {
    // 是构建生成的产物路径
    const isBuildUrl = url.startsWith(homePage);
    const isRelative = isRelativePath(url);
    // 是homePage之外相对路径导入的产物路径
    const isNonBuildAndRelative = !isBuildUrl && isRelative;
    // 设置了 extractMode 为 build 和 build_no_html 时，当前产物路径是非构建生成的，直接忽略
    const shouldIgnore = !isBuildUrl && (extractMode === 'build' || extractMode === 'build_no_html');
    if (shouldIgnore) {
      verbose(` >>> ignore asset [${url}] by extractMode=${extractMode}`);
    }

    return {
      url,
      isBuildUrl,
      isNonBuildAndRelative,
      shouldIgnore,
    };
  };

  const pushToSrcList = (assetType, /** @type UrlInfo */ urlInfo) => {
    const { isBuildUrl, isNonBuildAndRelative, url } = urlInfo;
    if (assetType === 'css') {
      if (isBuildUrl) {
        return noDupPush(chunkCssSrcList, url);
      }
      if (extractMode === 'all' || extractMode === 'all_no_html') {
        const list = isNonBuildAndRelative ? relativeCssSrcList : staticCssSrcList;
        return noDupPush(list, url);
      }
    }

    if (isBuildUrl) {
      return noDupPush(chunkJsSrcList, url);
    }
    if (extractMode === 'all' || extractMode === 'all_no_html') {
      const list = isNonBuildAndRelative ? relativeJsSrcList : staticJsSrcList;
      return noDupPush(list, url);
    }
  };

  const checkRelativePath = (/** @type string */ url, /** @type UrlInfo */ urlInfo) => {
    if (urlInfo.isNonBuildAndRelative && !enableRelativePath) {
      throw new Error(
        pfstr(`
        found asset url [${url}] is a elative path,
        it is obviously not a valid url for cdn architecture deploy!
        but if you are sure this url is valid, there are 2 ways to skip this error occured, you can choose any one of them:
        1. pass enableRelativePath true to hel-dev-utils.extractHelMetaJson method options.
        2. add data-helignore="1" on the asset dom attribute to tell hel-dev-utils ignore this asset.

        hel-dev-utils will mark this url as relativeLink or relativeScript, and set append as false,
        but if you want sdk append this asset, you must explicitly add data-helappend="1" on the asset dom attribute.
        a demo will be like:<script src="./a/b.js" data-helappend="1"></script>,<br/>
        note that the asset will depend on your host site seriously under this situation.
      `),
      );
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
    if (!['LINK', 'SCRIPT', 'STYLE'].includes(tagName)) {
      continue;
    }
    if (!isNull(dataset)) {
      verbose(`found ${tagName} dataset`, dataset);
    }
    if (dataset['helignore'] === '1') {
      verbose(` >>> ignore asset [${childDom.href || childDom.src || ''}] by data-helignore="1"`);
      continue;
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

      const urlInfo = getUrlInfo(href);
      if (urlInfo.shouldIgnore) {
        continue;
      }

      checkRelativePath(href, urlInfo);
      if (hreflang.startsWith('PRIV_CSS')) {
        noDupPush(privCssSrcList, href);
      }
      // 供 shadow-dom 或其他需要知道当前应用所有样式列表的场景用
      if (href.endsWith('.css')) {
        pushToSrcList('css', urlInfo);
      }
      toPushAsset = { ...getLinkAssetBase(urlInfo, dataset), attrs: { href, as, rel, crossorigin } };
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

      const urlInfo = getUrlInfo(targetSrc);
      if (urlInfo.shouldIgnore) {
        continue;
      }

      checkRelativePath(targetSrc, urlInfo);
      pushToSrcList('js', urlInfo);
      toPushAsset = { ...getScriptAssetBase(urlInfo, dataset), attrs: { src: targetSrc, crossorigin } };
    } else if (tagName === 'STYLE') {
      // style 标签转换为 css 文件存起来
      let href = await writeInnerHtml(childDom, 'css', extractOptions);
      if (!href) continue;

      href = mayPrefixHomePage(href);
      const urlInfo = getUrlInfo(href);
      if (urlInfo.shouldIgnore) {
        continue;
      }

      pushToSrcList('css', urlInfo);
      toPushAsset = { ...getLinkAssetBase(urlInfo, dataset), attrs: { href, rel: 'stylesheet' } };
    }

    if (toPushAsset) {
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
 * @param {import('../../typings').IUserExtractOptions} extractOptions
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
