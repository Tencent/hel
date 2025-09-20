/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { HEL_EXTERNAL_HTML_PAH } = require('../../consts');
const { helMonoLog } = require('../../util');
const { rewriteFileLine } = require('../../util/rewrite');

/**
 * 替换 html 里的内容，提示用户正在提供哪些 external 模块
 */
module.exports = function replaceExHtmlContent(/** @type {{appData:ICWDAppData }} */ options) {
  // const { nmL1ExternalPkgNames, nmL1ExternalDeps, appData, forEX } = options;
  const { nmL1ExternalDeps, appData, forEX } = options;
  const { monoRoot } = appData;
  let rawAppHtml = path.join(monoRoot, './dev/public/index.html');
  let appHtml = rawAppHtml;

  if (!forEX) {
    return { appHtml, rawAppHtml };
  }

  // rawAppHtml = HEL_EXTERNAL_HTML_PAH;
  const { belongTo, appDir, appDirPath } = appData;
  const appDotHelDir = path.join(monoRoot, `./${belongTo}/${appDir}/.hel`);
  if (!fs.existsSync(appDotHelDir)) {
    fs.mkdirSync(appDotHelDir);
  }
  appHtml = path.join(appDotHelDir, 'index.html');
  fs.cpSync(rawAppHtml, appHtml);

  helMonoLog(`replace content of ${appHtml}`);
  rewriteFileLine(appHtml, (line) => {
    let targetLine = line;
    if (line.includes('<body>')) {
      targetLine = [
        '<body>',
        `<h1>this is a local hel-ex static server for ${appDir}</h1>`,
        `<h2>app path: ${appDirPath}</h2>`,
        '<h2>serve these externals below (extracted by hel-mono-helper):</h2>',
      ];
      targetLine.push('<pre>');
      const str = JSON.stringify(nmL1ExternalDeps, null, 2);
      const rawLines = str.split(os.EOL);
      rawLines.forEach((v) => targetLine.push(v));
      targetLine.push('</pre>');
    }
    return { line: targetLine };
  });

  return { appHtml, rawAppHtml };
};
