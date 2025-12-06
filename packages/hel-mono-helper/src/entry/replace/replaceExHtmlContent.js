/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../../types').IMonoDevInfo} DevInfo */
const fs = require('fs');
const path = require('path');
const { HEL_EXTERNAL_HTML_PATH } = require('../../consts');
const { helMonoLog } = require('../../util');
const { getIsEnableEx } = require('../../util/devInfo');
const { getNmPkgJson } = require('../../util/nmPkg');
const { rewriteFileLine } = require('../../util/rewrite');
const { getContentLines } = require('../../util/xplat');

function getExLink(/** @type {{ appData: ICWDAppData, devInfo: DevInfo, isBuildMode: boolean }} */ options) {
  const { appData, devInfo, isBuildMode } = options;
  const { appPkgName } = appData;
  const { exConfs = {}, localExLink, onlineExLink } = devInfo;
  const exConf = exConfs[appPkgName] || {};
  const isEnableEx = getIsEnableEx(appPkgName, devInfo);
  let exLink = '';

  if (isEnableEx) {
    const modOnlineExLink = exConf.onlineExLink || onlineExLink;
    const modLocalExLink = exConf.localExLink || localExLink;
    if (isBuildMode && !modOnlineExLink) {
      throw new Error(`missing onlineExLink for ${appPkgName} under build mode!`);
    }
    if (!modLocalExLink) {
      throw new Error(`missing localExLink for ${appPkgName} under dev mode!`);
    }
    exLink = isBuildMode ? modOnlineExLink : modLocalExLink;
  }

  return exLink;
}

function getHtmlPath(/** @type {{ appData: ICWDAppData, devInfo: DevInfo, isBuildMode: boolean }} */ options, useGlobalHtml) {
  const { appData } = options;
  const { monoRoot, belongTo, appDir } = appData;

  if (useGlobalHtml) {
    const rawAppHtml = path.join(monoRoot, './dev/public/index.html');
    return { rawAppHtml, appHtml: rawAppHtml };
  }

  const appDotHelDir = path.join(monoRoot, `./${belongTo}/${appDir}/.hel`);
  if (!fs.existsSync(appDotHelDir)) {
    fs.mkdirSync(appDotHelDir);
  }
  const rawAppHtml = HEL_EXTERNAL_HTML_PATH;
  const appHtml = path.join(appDotHelDir, 'index.html');

  return { rawAppHtml, appHtml };
}

function handleHtmlForExUser(/** @type {{ appData: ICWDAppData, devInfo: DevInfo, isBuildMode: boolean }} */ options, exLink) {
  const { rawAppHtml, appHtml } = getHtmlPath(options);
  fs.cpSync(rawAppHtml, appHtml);
  rewriteFileLine(appHtml, (line) => {
    let targetLine = line;
    if (line.includes('</head>')) {
      targetLine = [
        `<script id="EX_SLOT" src="${exLink}"></script>`,
        '</head>',
      ];
    }
    return { line: targetLine };
  });

  return { appHtml, rawAppHtml };
}

function handleHtmlForExProjSelf(/** @type {{ appData: ICWDAppData, devInfo: DevInfo, isBuildMode: boolean }} */ options) {
  const { nmL1ExternalDeps, appData } = options;
  const { rawAppHtml, appHtml } = getHtmlPath(options);
  const { appDir, appDirPath } = appData;
  const serveFor = appDir.substring(0, appDir.length - 3);

  fs.cpSync(rawAppHtml, appHtml);
  helMonoLog(`replace content of ${appHtml}`);
  const genPreContent = (list, dict) => {
    list.push('<pre style="margin:0">');
    const str = JSON.stringify(dict, null, 2);
    const rawLines = getContentLines(str);
    rawLines.forEach((v) => list.push(v));
    list.push('</pre>');
  };

  rewriteFileLine(appHtml, (line) => {
    let targetLine = line;
    if (line.includes('<body>')) {
      targetLine = [
        '<body>',
        `<h1>this is a local hel-ex static server for project <span style="color:red">${serveFor}</span></h1>`,
        `<h4 style="color:gray">ex project path: ${appDirPath}</h4>`,
        '<h4 style="color:gray">supply these externals below (extracted by hel-mono-helper):</h4>',
      ];
      targetLine.push('<div style="color:blue;font-weight:600">External dependencies:</div>');
      genPreContent(targetLine, nmL1ExternalDeps);

      targetLine.push('<div style="color:blue;font-weight:600">Real versions:</div>');
      const nmPkgNames = Object.keys(nmL1ExternalDeps);
      const realVers = {};
      const pkgPaths = {};
      nmPkgNames.forEach((name) => {
        const { pkgJson, pkgJsonPath } = getNmPkgJson(name);
        realVers[name] = pkgJson.version;
        pkgPaths[name] = pkgJsonPath;
      });
      genPreContent(targetLine, realVers);

      targetLine.push('<div style="color:blue;font-weight:600">Package.json Paths:</div>');
      genPreContent(targetLine, pkgPaths);
    }
    return { line: targetLine };
  });

  return { rawAppHtml, appHtml };
}

/**
 * 替换 html 里的内容，提示用户正在提供哪些 external 模块
 */
module.exports = function replaceExHtmlContent(/** @type {{ appData: ICWDAppData, devInfo: DevInfo }} */ options) {
  const { appData, forEX, devInfo } = options;

  if (!forEX) {
    const exLink = getExLink(options);
    // 是一个需要 ex 链接的项目
    if (exLink) {
      return handleHtmlForExUser(options, exLink);
    }
    if (devInfo.allowEmptySrcIndex) {
      const rawAppHtml = path.join(appData.monoRoot, './dev/public/index.html');
      return { appHtml: rawAppHtml, rawAppHtml };
    }

    return getHtmlPath(options, true);
  }

  // 自身是 ex 项目
  // rawAppHtml = HEL_EXTERNAL_HTML_PATH;
  return handleHtmlForExProjSelf(options);
};
