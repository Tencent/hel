/** @typedef {import('../../typings').SrcMap} SrcMap*/
import fs from 'fs';
import util from 'util';
import { ensureSlash } from '../base-utils/index';
import { noDupPush } from '../inner-utils/arr';
import { verbose } from '../inner-utils/index';
import { isNull, purify } from '../inner-utils/obj';
import { getAllFilePath } from './utils';

const writeFile = util.promisify(fs.writeFile);

function isRelativePath(path) {
  if (path.startsWith('//')) return false;
  return path.startsWith('/') || path.startsWith('./') || path.startsWith('../');
}

function getLinkType(appHomePage, srcOrHref) {
  if (isRelativePath(appHomePage) || srcOrHref.startsWith(appHomePage)) {
    return 'link';
  }
  return 'staticLink';
}

function getScriptType(appHomePage, srcOrHref) {
  if (isRelativePath(appHomePage) || srcOrHref.startsWith(appHomePage)) {
    return 'script';
  }
  return 'staticScript';
}

/**
 * 是否忽略此文件
 * true：忽略，则不加入到首屏的资源清单里
 * false：不忽略，则加入到首屏的资源清单里
 * 注意，加入后也不一定会使用，目前 hel-micro sdk 不会加载 staticLink staticScript 型资源
 * @returns
 */
function needIgnore(url, options) {
  const { parseOptions, hreflang = '', id } = options;
  const { extractMode, appHomePage } = parseOptions;
  if (url) {
    // 这种类型的css文件不忽略
    if (hreflang.startsWith('PRIV_CSS')) {
      return false;
    }
    // 用户标记此文件为静态资源文件且不忽略它，dev-utils 会记录到js入口清单里
    // 如后续步骤不满足 homePage 匹配，会被标记为 staticLink staticScript
    // 目前 hel-micro sdk 不会加载 staticLink staticScript 型资源
    if (id === 'HelStatic') {
      return false;
    }
    // 用户标记此文件为静态资源文件且忽略它，dev-utils 会不记录该js入口清单里
    if (id === 'HelStaticIgnore') {
      return true;
    }
    if (url.startsWith('http')) {
      if (extractMode === 'build') {
        return !url.startsWith(appHomePage); // 不是以 appHomePage 开头的都忽略掉
      }
      if (extractMode === 'bu_st') {
        // 都不忽略，全部记录到记录到js入口清单里，如后续步骤不满足homePage匹配，会被标记为 staticLink staticScript，
        // 目前 hel-micro sdk 不会加载 staticLink staticScript 型资源
        return false;
      }
      throw new Error(`unknown extract_mode [${extractMode}]`);
    }
    // 以双斜杠开头的script引用直接忽略
    if (url.startsWith('//')) return true;

    if (isRelativePath(url)) {
      return false; // 允许将 /xx/bb.js 格式的值写入到元数据里，适用于资源随主站点部署的情况
    }

    // 用户的子应用未能正确埋入 CMS_APP_HOME_PAGE，需要修改构建脚本的 publicPath 获取方式
    throw new Error(`src or href is invalid, it must refer to a cdn host, now it is ${url}.`);
  }
  // 控制不忽略，会尝试提取 innerHtml
  return false;
}

let custScriptIdx = 0;
async function writeInnerHtml(childDom, fileType, parseOptions) {
  const { buildDirFullPath, appHomePage } = parseOptions;
  const { innerHTML } = childDom;
  if (!innerHTML) return '';

  verbose(`found a user customized ${fileType} tag node in html, try extract its content and write them to local fs`);
  custScriptIdx += 1;
  const scriptName = `hel_userChunk_${custScriptIdx}.${fileType}`;
  const fileAbsolutePath = `${buildDirFullPath}/${scriptName}`;
  const fileWebPath = `${ensureSlash(appHomePage, false)}/${scriptName}`;

  await writeFile(fileAbsolutePath, innerHTML);
  verbose(`write done, the web file will be ${fileWebPath} later`);
  return fileWebPath;
}

/**
 * 提取link、script标签数据并填充到目标assetList
 * @param {HTMLCollectionOf<HTMLScriptElement>} doms
 * @param {SrcMap} fillTargets
 * @param {object} parseOptions
 * @param {string} parseOptions.buildDirFullPath
 * @param {boolean} parseOptions.isHead
 * @param {boolean} parseOptions.enableReplaceDevJs
 * @param {string} parseOptions.appHomePage  - http://s.inews.gtimg.com/om_20200408203828
 */
export async function fillAssetList(doms, fillTargets, parseOptions) {
  const { headAssetList, bodyAssetList, chunkCssSrcList, chunkJsSrcList, privCssSrcList } = fillTargets;
  const { appHomePage, enableReplaceDevJs, isHead } = parseOptions;
  const assetList = isHead ? headAssetList : bodyAssetList;
  const cssList = chunkCssSrcList;
  const privCssList = privCssSrcList;

  const len = doms.length;
  const replaceContentList = [];

  for (let i = 0; i < len; i++) {
    const childDom = doms[i];
    const { tagName, crossorigin, id } = childDom;
    let toPush = null;
    if (tagName === 'LINK') {
      const { as, rel, hreflang = '' } = childDom;
      let { href } = childDom;
      if (!href) continue;
      if (needIgnore(href, { parseOptions, hreflang, id })) {
        verbose(`ignore href ${href}`);
        continue;
      }

      verbose(`analyze link href[${href}] as[${as}] rel[${rel}]`);
      // 一些使用了老版本cra的项目，这两个href 在修改了 publicPath 后也不被添加前缀，这里做一下修正
      const legacyHrefs = ['/manifest.json', '/favicon.ico'];
      if (legacyHrefs.includes(href)) {
        href = `${appHomePage}${href}`;
        replaceContentList.push({ toMatch: href, toReplace: href });
      }

      // 供 shadow-dom 或其他需要知道当前应用所有样式列表的场景用
      if (href.endsWith('.css')) {
        noDupPush(cssList, href);
      }
      if (hreflang.startsWith('PRIV_CSS')) {
        noDupPush(privCssList, href);
      }
      toPush = { tag: getLinkType(appHomePage, href), attrs: { href: href, as, rel, crossorigin } };
    } else if (tagName === 'SCRIPT') {
      const { src } = childDom;
      let targetSrc = src;
      if (!targetSrc) {
        targetSrc = await writeInnerHtml(childDom, 'js', parseOptions);
      }
      if (!targetSrc) continue;

      if (needIgnore(targetSrc, { parseOptions, id })) {
        verbose(`ignore script ${targetSrc}`);
        continue;
      }

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

      noDupPush(chunkJsSrcList, targetSrc);
      toPush = { tag: getScriptType(appHomePage, targetSrc), attrs: { src: targetSrc, crossorigin } };
    } else if (tagName === 'STYLE') {
      // style 标签转换为 css 文件存起来
      const linkHref = await writeInnerHtml(childDom, 'css', parseOptions);
      if (!linkHref) continue;

      verbose(`upload style content to ${linkHref} done`);
      toPush = { tag: getLinkType(appHomePage, linkHref), attrs: { href: linkHref, rel: 'stylesheet' } };
    }

    if (toPush) {
      const judgeValueValid = (value, key) => {
        if (key === 'crossorigin') return !isNull(value, { nullValues: [null, undefined] });
        return !isNull(value);
      };

      toPush.attrs = purify(toPush.attrs, judgeValueValid);
      assetList.push(toPush);
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
