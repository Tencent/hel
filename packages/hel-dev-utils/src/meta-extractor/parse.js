/** @typedef {import('types/domain-inner').SrcMap} SrcMap*/
import jsdom from 'jsdom';
import * as  fs from 'fs';
import * as  util from 'util';
import { verbose } from '../inner-utils/index';
import { makeAppVersionSrcMap } from './utils';
import { fillAssetList } from './fillAssetList';

const readFile = util.promisify(fs.readFile);
const { JSDOM } = jsdom;

/**
 * @param {import('types/biz').IUserExtractOptions} extractOptions
 */
export async function parseIndexHtml(extractOptions) {
  const { appHomePage, appName, extractMode, buildDirFullPath } = extractOptions;
  verbose(`homePage [${appHomePage}]`);
  verbose(`start to parse ${appName} index.html file`);

  const htmlFilePath = `${buildDirFullPath}/index.html`;
  let htmlContent = await readFile(htmlFilePath, { encoding: 'UTF-8' });
  const srcMap = makeAppVersionSrcMap(appHomePage);

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const [replaceContentListOfHead, replaceContentLisOfBody] = await Promise.all([
    fillAssetList(
      document.head.children, srcMap,
      { extractMode, buildDirFullPath, appHomePage, isHead: true },
    ),
    fillAssetList(
      document.body.children, srcMap,
      { extractMode, buildDirFullPath, appHomePage },
    ),
  ]);

  replaceContentListOfHead.forEach(item => {
    htmlContent = htmlContent.replace(item.toMatch, item.toReplace);
  });
  replaceContentLisOfBody.forEach(item => {
    htmlContent = htmlContent.replace(item.toMatch, item.toReplace);
  });

  const parsedRet = { srcMap, htmlContent, replaceContentListOfHead };
  verbose(`parse ${appName} index.html file done!`);
  verbose('replaceContentListOfHead: ', replaceContentListOfHead);
  verbose('parsedRet: ', parsedRet);
  return parsedRet;
}
