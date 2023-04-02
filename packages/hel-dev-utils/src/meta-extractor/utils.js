/** @typedef {import('../../typings').SrcMap} SrcMap*/
import * as fs from 'fs';
import { ensureSlash } from '../base-utils/index';
import cst from '../configs/consts';

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
 *
 * @param {string} homePage
 * @return {SrcMap}
 */
export function makeAppVersionSrcMap(homePage, iframeSrc = '') {
  // 用于更新到数据库的app信息，通常来说在构建机器上触发
  // 从上往下的key顺序也是在html创建的顺序
  return {
    webDirPath: homePage,
    htmlIndexSrc: `${ensureSlash(homePage, false)}/index.html`,
    iframeSrc,
    chunkCssSrcList: [], // app's all css files
    chunkJsSrcList: [], // app's all js files
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
  const { packageJson, extractMode = 'build', appInfo } = userExtractOptions;
  const { homePage, groupName, name: appName, semverApi } = appInfo;

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
      extract_mode: extractMode,
      online_version: version,
      build_version: version,
    },
    version: {
      plugin_ver: cst.PLUGIN_VER,
      sub_app_name: appName,
      sub_app_version: version,
      src_map: parsedRet.srcMap,
      html_content: parsedRet.htmlContent,
    },
  };
}
