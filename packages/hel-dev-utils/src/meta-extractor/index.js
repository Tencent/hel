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
  const { buildDirFullPath, writeMetaJsonToDist = true, subApp, appInfo } = userExtractOptions;
  const appInfoVar = appInfo || subApp;

  if (!appInfoVar) {
    throw new Error('appInfo should be supplied in ver 3.0+ hel-dev-utils: extractHelMetaJson({appInfo, ...})');
  }

  verbose(`start extractHelMetaJson, appHomePage is ${appInfoVar.homePage}`);

  const parsedRet = await parseIndexHtml(userExtractOptions);
  fillAssetListByDist(parsedRet, userExtractOptions);

  // 有替换内容生成，则将 index.html 内容重写，让后续上传 cdn 步骤上传的是替换后的文件内容
  if (parsedRet.replaceContentListOfHead.length > 0) {
    const htmlFilePath = `${buildDirFullPath}/index.html`;
    fs.writeFileSync(htmlFilePath, parsedRet.htmlContent, { encoding: 'utf-8' });
  }

  const helMeta = makeHelMetaJson(userExtractOptions, parsedRet);
  if (writeMetaJsonToDist) {
    const helMetaJsonFile = `${buildDirFullPath}/hel-meta.json`;
    fs.writeFileSync(helMetaJsonFile, JSON.stringify(helMeta, null, 2));
  }

  return helMeta;
}
