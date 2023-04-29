/** @typedef {import('../../typings').SrcMap} SrcMap*/
import * as fs from 'fs';
import { slash } from '../base-utils/index';
import cst from '../configs/consts';

export function getIndexHtmlFileName(dirPath) {
  const names = fs.readdirSync(dirPath);
  let indexHtmlName = '';
  let matchCount = 0;
  names.forEach((name) => {
    if (name.endsWith('.html')) {
      matchCount += 1;
      indexHtmlName = name;
    }
  });
  if (!matchCount) {
    throw new Error('no index.html found');
  }
  if (matchCount > 1) {
    throw new Error(`there are more than one indexHtml file under [${dirPath}]!`);
  }
  return indexHtmlName;
}

/**
 * 递归获得某个目录下的所有文件绝对路径
 * @param {string} dirPath 形如:/user/zzk/log/build
 * @return {string[]} filePathList
 * 形如 ['/user/zzk/log/build/js/xx.js', '/user/zzk/log/build/img/xx.png']
 */
export function getAllFilePath(dirPath) {
  const _getAllFilePath = (dirPath, filePathList) => {
    const names = fs.readdirSync(dirPath);
    names.forEach((name) => {
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
 * @param {import('../../typings').IUserExtractOptions} extractOptions
 */
export function makeAppVersionSrcMap(extractOptions) {
  const { appInfo, indexHtmlName = cst.DEFAULT_HTML_INDEX_NAME, extractMode = 'all' } = extractOptions;
  const { homePage } = appInfo;
  // 用于更新到数据库的app信息，通常来说在构建机器上触发
  // 从上往下的key顺序也是在html创建的顺序
  return {
    webDirPath: homePage,
    htmlIndexSrc: `${slash.end(homePage)}${indexHtmlName}`,
    extractMode,
    iframeSrc: '',
    chunkCssSrcList: [], //  all build css files
    chunkJsSrcList: [], // all build js files
    staticCssSrcList: [], // all static css files
    staticJsSrcList: [], // all static js files
    relativeCssSrcList: [], // all relative js files
    relativeJsSrcList: [], // all relative js files
    privCssSrcList: [], // 独立放置 hreflang 为 PRIV_CSS 的文件
    headAssetList: [],
    bodyAssetList: [],
  };
}

/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('../../typings').IUserExtractOptions} userExtractOptions
 */
export function makeHelMetaJson(userExtractOptions, parsedRet) {
  const { packageJson, extractMode = 'build', subApp } = userExtractOptions;
  const { homePage, groupName, name: appName, semverApi } = subApp;

  /**
   *  构建版本号，当指定了 homePage 且不想采用默认的版本号生成规则时，才需要透传 buildVer 值
   *  默认生成规则：
   *  内网包：裁出 homePage ${cdnHost}/${appZone}/${appName}_${dateStr} 里的 ${appName}_${dateStr} 作为版本号
   *  外网包：pkg.version
   */
  let version = userExtractOptions.buildVer;
  const packVer = packageJson.version;
  if (!version) {
    if (semverApi) {
      version = packVer;
    } else {
      try {
        // ${cdnHost}/${appZone}/${appName}_${dateStr}
        const [, restStr] = homePage.split('//');
        const [, , versionMakeOnPipeline] = restStr.split('/');
        if (versionMakeOnPipeline) {
          const arr = versionMakeOnPipeline.split('_');
          const lastItem = arr[arr.length - 1];
          // 特征符合 helpack 的版本号
          if (lastItem && lastItem.length === 14 && new RegExp('^[1-9]+[0-9]*$').test(lastItem)) {
            version = versionMakeOnPipeline;
          }
        }
      } catch (err) {}

      if (!version) {
        // 自定义 homePage 后，版本未必能推导出来，降级为使用 package.json 版本号
        version = packVer;
      }
    }
  }
  const repo = packageJson.repository || {};

  return {
    app: {
      name: appName,
      app_group_name: groupName,
      git_repo_url: repo.url || packageJson.homepage || '',
      online_version: version,
      build_version: version,
    },
    version: {
      plugin_ver: cst.PLUGIN_VER,
      extract_mode: extractMode,
      sub_app_name: appName,
      sub_app_version: version,
      src_map: parsedRet.srcMap,
      html_content: parsedRet.htmlContent,
    },
  };
}
