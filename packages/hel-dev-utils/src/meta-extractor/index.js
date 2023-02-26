import fs from 'fs';
import { getHelEnvParams } from '../base-utils/index';
import cst from '../configs/consts';
import { verbose } from '../inner-utils/index';
import { fillAssetListByDist } from './fillAssetList';
import { parseIndexHtml } from './parse';
import { makeHelMetaJson } from './utils';

/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('../../typings').IUserExtractOptions} userExtractOptions
 */
export default async function extractHelMetaJson(userExtractOptions) {
  const {
    appHomePage,
    buildDirFullPath,
    writeMetaJsonToDist = true,
    appName,
    packageJson,
    npmCdnType = 'unpkg',
    extractMode = 'build',
    distDir = 'hel_dist',
    platform = cst.DEFAULT_PLAT,
  } = userExtractOptions;

  const envParams = getHelEnvParams(packageJson, { homePage: appHomePage, npmCdnType, platform });
  const { appName: envAppName, appHomePage: envAppHomePage } = envParams;
  const targetHomePage = envAppHomePage;
  const filledExtractOptions = {
    ...userExtractOptions,
    appName: appName || envAppName || packageJson.name,
    appHomePage: targetHomePage,
    buildDirFullPath,
    extractMode,
    platform,
    distDir,
  };
  verbose(`start extractHelMetaJson, appHomePage is ${targetHomePage}`);

  const parsedRet = await parseIndexHtml(filledExtractOptions);
  fillAssetListByDist(parsedRet, filledExtractOptions);

  // 有替换内容生成，则将 index.html 内容重写，让后续上传 cdn 步骤上传的是替换后的文件内容
  if (parsedRet.replaceContentListOfHead.length > 0) {
    const htmlFilePath = `${buildDirFullPath}/index.html`;
    fs.writeFileSync(htmlFilePath, parsedRet.htmlContent, { encoding: 'utf-8' });
  }

  const helMeta = makeHelMetaJson(filledExtractOptions, parsedRet);
  if (writeMetaJsonToDist) {
    const helMetaJsonFile = `${buildDirFullPath}/hel-meta.json`;
    fs.writeFileSync(helMetaJsonFile, JSON.stringify(helMeta, null, 2));
  }

  return helMeta;
}
