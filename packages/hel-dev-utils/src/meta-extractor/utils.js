/** @typedef {import('types/domain-inner').SrcMap} SrcMap*/
import * as fs from 'fs';
import { PLUGIN_VER } from '../configs/consts';

/**
 * 递归获得某个目录下的所有文件绝对路径
 * @param {string} dirPath 形如:/user/zzk/log/build
 * @return {string[]} filePathList
 * 形如 ['/user/zzk/log/build/js/xx.js', '/user/zzk/log/build/img/xx.png']
 */
export function getAllFilePath(dirPath) {
  const _getAllFilePath = (dirPath, filePathList) => {
    const names = fs.readdirSync(dirPath);
    names.forEach(function (name) {
      const stats = fs.statSync(`${dirPath}/${name}`);
      if (stats.isDirectory()) {
        _getAllFilePath(`${dirPath}/${name}`, filePathList);
      } else {
        filePathList.push(`${dirPath}/${name}`);
      }
    });
  };

  const filePathList = [];
  _getAllFilePath(dirPath, filePathList);
  return filePathList;
}

/**
 *
 * @param {string} homePage
 * @return {SrcMap}
 */
export function makeAppVersionSrcMap(homePage, iframeSrc = '') {
  // 用于更新到数据库的app信息，通常来说在构建机器上触发
  // 从上往下的key顺序也是在html创建的顺序
  return {
    webDirPath: homePage,
    htmlIndexSrc: `${homePage}/index.html`,
    iframeSrc,
    chunkCssSrcList: [], // app's all css files
    privCssSrcList: [], // 独立放置 hreflang 为 PRIV_CSS 的文件
    headAssetList: [],
    bodyAssetList: [],
  };
}

/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('types/biz').IUserExtractOptions} userExtractOptions
 */
export function makeHelMetaJson(userExtractOptions, parsedRet) {
  const { appName, packageJson, extractMode = 'build' } = userExtractOptions;
  const appGroupName = packageJson.appGroupName || appName;
  const version = packageJson.version;
  const repo = packageJson.repository || {};

  return {
    app: {
      name: appName,
      app_group_name: appGroupName,
      git_repo_url: repo.url || packageJson.homepage || '',
      extract_mode: extractMode,
      online_version: version,
      build_version: version,
    },
    version: {
      plugin_ver: PLUGIN_VER,
      sub_app_name: appName,
      sub_app_version: version,
      src_map: parsedRet.srcMap,
      html_content: parsedRet.htmlContent,
    },
  };
}
