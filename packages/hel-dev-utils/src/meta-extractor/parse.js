/** @typedef {import('../../typings').SrcMap} SrcMap*/
import * as fs from 'fs';
import jsdom from 'jsdom';
import * as util from 'util';
import { verbose } from '../inner-utils/index';
import { fillAssetList } from './fillAssetList';
import { makeAppVersionSrcMap } from './utils';

const readFile = util.promisify(fs.readFile);
const { JSDOM } = jsdom;

/**
 * @param {import('../../typings').IUserExtractOptions} extractOptions
 */
export async function parseIndexHtml(extractOptions) {
  const { appInfo, extractMode = 'build', buildDirFullPath } = extractOptions;
  const { homePage: appHomePage, name: appName } = appInfo;
  verbose(`homePage [${appHomePage}]`);
  verbose(`start to parse ${appName} index.html file`);

  const htmlFilePath = `${buildDirFullPath}/index.html`;
  let htmlContent = await readFile(htmlFilePath, { encoding: 'UTF-8' });
  const srcMap = makeAppVersionSrcMap(appHomePage);

  const dom = new JSDOM(htmlContent);
  const { head, body } = dom.window.document;
  const [replaceContentListOfHead, replaceContentLisOfBody] = await Promise.all([
    fillAssetList(head.children, srcMap, { extractMode, buildDirFullPath, appHomePage, isHead: true }),
    fillAssetList(body.children, srcMap, { extractMode, buildDirFullPath, appHomePage }),
  ]);

  replaceContentListOfHead.forEach((item) => {
    htmlContent = htmlContent.replace(item.toMatch, item.toReplace);
  });
  replaceContentLisOfBody.forEach((item) => {
    htmlContent = htmlContent.replace(item.toMatch, item.toReplace);
  });

  const parsedRet = { srcMap, htmlContent, replaceContentListOfHead };
  verbose(`parse ${appName} index.html file done!`);
  verbose('replaceContentListOfHead: ', replaceContentListOfHead);
  verbose('parsedRet: ', parsedRet);
  return parsedRet;
}
