
import fs from 'fs';
import { verbose, getNpmCdnHomePage } from '../inner-utils/index';
import { getHelEnvParams } from '../base-utils/index';
import { parseIndexHtml } from './parse';
import { makeHelMetaJson } from './utils';
import { fillAssetListByDist } from './fillAssetList';

/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('types/biz').IUserExtractOptions} userExtractOptions
 */
export default async function extractHelMetaJson(userExtractOptions) {
  const {
    appHomePage, buildDirFullPath, writeMetaJsonToDist = true, appName,
    packageJson, npmCdnType = 'unpkg', extractMode = 'build', distDir = 'hel_dist',
  } = userExtractOptions;

  const targetHomePage = appHomePage || getNpmCdnHomePage(packageJson, npmCdnType, distDir);
  const envParams = getHelEnvParams(packageJson);
  const filledExtractOptions = {
    ...userExtractOptions,
    appName: appName || envParams.appName || packageJson.name,
    appHomePage: targetHomePage, buildDirFullPath, extractMode,
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
