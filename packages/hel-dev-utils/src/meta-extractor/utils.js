/** @typedef {import('types/domain-inner').SrcMap} SrcMap*/
import { PLUGIN_VER } from '../configs/consts';

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
 * @param {import('../types/biz').IUserExtractOptions} userExtractOptions
 */
export function makeHelMetaJson(userExtractOptions, parsedRet) {
  const { appName, packageJson, extractMode = 'build' } = userExtractOptions;
  const name = appName || packageJson.name;
  const version = packageJson.version;

  return {
    app: {
      name,
      app_group_name: name,
      git_repo_url: packageJson.repository?.url || packageJson.homepage || '',
      extract_mode: extractMode,
      online_version: version,
      build_version: version,
    },
    version: {
      sub_app_name: name,
      sub_app_version: version,
      src_map: parsedRet.srcMap,
      html_content: parsedRet.htmlContent,
      plugin_ver: PLUGIN_VER,
    }
  };
}
