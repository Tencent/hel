import fs from 'fs';
import { verbose } from '../inner-utils/index';
import { fillAssetListByDist } from './fillAssetList';
import { parseIndexHtml } from './parse';
import { makeHelMetaJson } from './utils';

/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('../../typings').IUserExtractOptions} userExtractOptions
 */
export default async function extractHelMetaJson(userExtractOptions) {
  const { buildDirFullPath, writeMetaJsonToDist = true } = userExtractOptions;
  const appInfo = userExtractOptions.appInfo || userExtractOptions.subApp;

  if (!appInfo) {
    throw new Error('appInfo should be supplied in ver 3.0+ hel-dev-utils: extractHelMetaJson({appInfo, ...})');
  }
  const options = { ...userExtractOptions, appInfo, subApp: appInfo };

  verbose(`start extractHelMetaJson, appHomePage is ${appInfo.homePage}`);
  // 分析 html 入口，提取 sdk 加载需要的资源清单
  const parsedRet = await parseIndexHtml(options);
  // 分析构建产物目录，提取剩余的资源清单补充到 chunkJsSrcList chunkCssSrcList 下，以便描述出应用的所有构建产物的资源路径
  fillAssetListByDist(parsedRet, options);

  // 有替换内容生成，则将 index.html 内容重写，让后续上传 cdn 步骤上传的是替换后的文件内容
  if (parsedRet.hasReplacedContent) {
    const htmlFilePath = `${buildDirFullPath}/index.html`;
    fs.writeFileSync(htmlFilePath, parsedRet.htmlContent, { encoding: 'utf-8' });
  }

  const helMeta = makeHelMetaJson(options, parsedRet);
  if (writeMetaJsonToDist) {
    const helMetaJsonFile = `${buildDirFullPath}/hel-meta.json`;
    fs.writeFileSync(helMetaJsonFile, JSON.stringify(helMeta, null, 2));
  }

  return helMeta;
}
