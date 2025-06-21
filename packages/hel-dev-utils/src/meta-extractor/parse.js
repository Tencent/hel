/** @typedef {import('../types').SrcMap} SrcMap */
/** @typedef {import('../types').IUserExtractOptions} IUserExtractOptions */
/** @typedef {import('../types').IInnerFillAssetListOptions} IInnerFillAssetListOptions */
import * as fs from 'fs';
import jsdom from 'jsdom';
import * as util from 'util';
import cst from '../configs/consts';
import { verbose } from '../inner-utils/index';
import { fillAssetList } from './fillAssetList';
import { makeAppVersionSrcMap } from './utils';

const readFile = util.promisify(fs.readFile);
const { JSDOM } = jsdom;

/**
 * @param {IUserExtractOptions} extractOptions
 */
export async function parseIndexHtml(extractOptions) {
  const { appInfo, buildDirFullPath, extractMode = 'all', indexHtmlName = cst.DEFAULT_HTML_INDEX_NAME } = extractOptions;
  const { name, homePage } = appInfo;
  const htmlFilePath = `${buildDirFullPath}/${indexHtmlName}`;
  verbose(`start to parse ${name} index.html file [${htmlFilePath}]`);

  let htmlContent = await readFile(htmlFilePath, { encoding: 'UTF-8' });
  const srcMap = makeAppVersionSrcMap(extractOptions);

  const dom = new JSDOM(htmlContent);
  const { head, body } = dom.window.document;
  /** @type {IInnerFillAssetListOptions} */
  const fillAssetListOptions = { srcMap, homePage, ...extractOptions };
  const [replaceContentListOfHead, replaceContentLisOfBody] = await Promise.all([
    fillAssetList(head.children, { ...fillAssetListOptions, isHead: true }),
    fillAssetList(body.children, fillAssetListOptions),
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
  verbose(`parse app [${name}] index.html file done!`);
  verbose('replaceContentListOfHead: ', replaceContentListOfHead);
  verbose('replaceContentLisOfBody: ', replaceContentLisOfBody);
  return parsedRet;
}
