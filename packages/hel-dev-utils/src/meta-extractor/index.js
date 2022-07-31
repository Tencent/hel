
import fs from 'fs';
import { verbose, getNpmCdnHomePage } from '../inner-utils/index';
import { parseIndexHtml } from './parse';
import { makeHelMetaJson } from './utils';



/**
 * 从 index.html 提取资源的描述数据，包含 htmlContent、srcMap
 * @param {import('../types/biz').IUserExtractOptions} userExtractOptions
 */
export default async function extractHelMetaJson(userExtractOptions) {
  const {
    appHomePage, buildDirFullPath, writeMetaJsonToDist = true, appName,
    packageJson, npmCdnType = 'unpkg', extractMode = 'build', distDir,
  } = userExtractOptions;

  const targetHomePage = appHomePage || getNpmCdnHomePage(packageJson, npmCdnType, distDir);
  const innerExtractOptions = {
    appName: appName || packageJson.appGroupName || packageJson.name,
    appHomePage: targetHomePage, buildDirFullPath, extractMode
  };
  verbose(`start extractHelMetaJson, appHomePage is ${targetHomePage}`);

  const parsedRet = await parseIndexHtml(innerExtractOptions);

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
