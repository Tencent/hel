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
  const { appInfo, buildDirFullPath, extractMode = 'all' } = extractOptions;
  const { homePage: appHomePage, name: appName } = appInfo;
  verbose(`start to parse ${appName} index.html file`);

  const htmlFilePath = `${buildDirFullPath}/index.html`;
  let htmlContent = await readFile(htmlFilePath, { encoding: 'UTF-8' });
  const srcMap = makeAppVersionSrcMap(appHomePage, extractMode);

  const dom = new JSDOM(htmlContent);
  const { head, body } = dom.window.document;
  const [replaceContentListOfHead, replaceContentLisOfBody] = await Promise.all([
    fillAssetList(head.children, { srcMap, extractOptions, isHead: true }),
    fillAssetList(body.children, { srcMap, extractOptions }),
  ]);

  replaceContentListOfHead.forEach((item) => {
    htmlContent = htmlContent.replace(item.toMatch, item.toReplace);
  });
  replaceContentLisOfBody.forEach((item) => {
    htmlContent = htmlContent.replace(item.toMatch, item.toReplace);
  });

  const shouldRecordHtmlContent = extractMode === 'all' || extractMode === 'build';
  const htmlContentVar = shouldRecordHtmlContent ? htmlContent : '';
  if (!shouldRecordHtmlContent) {
    verbose(`user set extractMode='${extractMode}', dev-utils will ignore write version.html_content`);
  }

  const hasReplacedContent = replaceContentListOfHead.length || replaceContentLisOfBody.length;
  const parsedRet = { srcMap, htmlContent: htmlContentVar, hasReplacedContent };
  verbose(`parse ${appName} index.html file done!`);
  verbose('replaceContentListOfHead: ', replaceContentListOfHead);
  verbose('replaceContentLisOfBody: ', replaceContentLisOfBody);
  verbose('parsedRet: ', parsedRet);
  return parsedRet;
}
