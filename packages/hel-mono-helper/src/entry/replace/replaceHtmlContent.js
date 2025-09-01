/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { helMonoLog } = require('../../util');
const { rewriteFileLine } = require('../../util/rewrite');

/**
 * 替换 indexEX.ts 文件内容为 externals 构建做准备
 */
module.exports = function replaceHtmlContent(/** @type {{appData:ICWDAppData }} */options) {
  // const { nmL1ExternalPkgNames, nmL1ExternalDeps, appData, forEX } = options;
  const { nmL1ExternalDeps, appData, forEX } = options;
  const { monoRoot } = appData
  const rawAppHtml = path.join(monoRoot, './dev/public/index.html');
  let appHtml = rawAppHtml;

  mlogt('replaceHtmlContent forEX', forEX);
  if (!forEX) {
    return { appHtml, rawAppHtml };
  }

  const { belongTo, appDir, appDirPath } = appData;
  appHtml = path.join(monoRoot, `./${belongTo}/${appDir}/.hel/index.html`);
  fs.cpSync(rawAppHtml, appHtml);

  helMonoLog(`replace content of ${appHtml}`);
  rewriteFileLine(appHtml, (line) => {
    let targetLine = line;
    if (line.includes('<div id=')) {
      targetLine = [
        `<h1>this is a local hel-ex static server for ${appDir}`,
        `<h2>app path: ${appDirPath}</h2>`,
        '<h2>serve externals below:</h2>',
      ];
      targetLine.push('<pre>')
      const str = JSON.stringify(nmL1ExternalDeps, null, 2);
      const rawLines = str.split(os.EOL);
      rawLines.forEach(v => targetLine.push(v));
      targetLine.push('</pre>')
    }
    return { line: targetLine };
  });

  // 此处返回值不影响流程正确性
  return { appHtml, rawAppHtml };
};
