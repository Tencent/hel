/** @typedef {import('../../types').IReplaceExHtmlContentOptions} Options */
const fs = require('fs');
const path = require('path');
const { baseUtils } = require('hel-dev-utils-base');
const { HEL_REPO_EXTERNAL_HTML_PATH } = require('../../consts');
const { helMonoLog } = require('../../util');
const { getIsEnableRepoEx } = require('../../util/devInfo');
const { chooseStrOrStrList } = require('../../util/dict');
const { isHelAllOrMicroBuild, isHelAllBuild } = require('../../util/is');
const { getNmPkgJson } = require('../../util/nmPkg');
const { getExternalBoundName } = require('../../util/monoPkg');
const { rewriteFileLine } = require('../../util/rewrite');
const { getContentLines } = require('../../util/xplat');

const EReuseStrategy = {
  UseGlobalHtml: 1,
  CopyGlobalHtml: 2,
  CopyEmptyHtml: 3,
};

function getBaseExScriptList(globalHtml) {
  const content = fs.readFileSync(globalHtml, { encoding: 'utf-8' });
  const lines = getContentLines(content);
  let scriptStrList = [];
  for (const line of lines) {
    // 包含i d="BASE_EX 的节点都收集起来，例如 id="BASE_EX1", id="BASE_EX2" ...
    if (line.includes('id="BASE_EX') && !line.includes('<!--')) {
      scriptStrList.push(line);
    }
  }
  if (!scriptStrList.length) {
    throw new Error(
      `Cannot find baseExternals link, please check your html file to make sure including a id="BASE_EX" or id="BASE_EX{number}" script node`,
    );
  }

  return scriptStrList;
}

function getRepoExLinks(/** @type {Options} */ options) {
  const { appData, devInfo } = options;
  const { appPkgName } = appData;
  const { exConfs = {}, devRepoExLink, prodRepoExLink } = devInfo;
  const exConf = exConfs[appPkgName] || {};
  const isEnableRepoEx = getIsEnableRepoEx(appPkgName, devInfo);
  let exLinks = [];

  if (isHelAllBuild()) {
    return exLinks;
  }

  if (isEnableRepoEx) {
    const isHelBuild = isHelAllOrMicroBuild();
    const modProdRepoExLinks = chooseStrOrStrList([exConf.prodRepoExLink, prodRepoExLink]);
    const modDevRepoExLinks = chooseStrOrStrList([exConf.devRepoExLink, devRepoExLink]);
    if (isHelBuild && !modProdRepoExLinks.length) {
      throw new Error(`missing prodAutoExLink for ${appPkgName} under build mode!`);
    }
    if (!modDevRepoExLinks.length) {
      throw new Error(`missing devAutoExLink for ${appPkgName} under dev mode!`);
    }
    exLinks = isHelBuild ? modProdRepoExLinks : modDevRepoExLinks;
  }

  // 仅填写域名时，尝试修正为本地开发模式下的 ex 链接
  if (exLinks.length === 1 && exLinks[0].includes('localhost:') && !exLinks[0].endsWith('.js')) {
    exLinks = [`${baseUtils.slash.noEnd(exLinks[0])}/static/js/bundle.js`];
  }

  return exLinks;
}

function getHtmlPath(/** @type {Options} */ options, strategy = EReuseStrategy.UseGlobalHtml) {
  const { appData } = options;
  const { monoRoot, belongTo, appDir } = appData;
  const globalHtml = path.join(monoRoot, './dev/public/index.html');

  if (EReuseStrategy.UseGlobalHtml === strategy) {
    return { rawAppHtml: globalHtml, appHtml: globalHtml, globalHtml };
  }

  const appDotHelDir = path.join(monoRoot, `./${belongTo}/${appDir}/.hel`);
  if (!fs.existsSync(appDotHelDir)) {
    fs.mkdirSync(appDotHelDir);
  }
  const appHtml = path.join(appDotHelDir, 'index.html');

  if (EReuseStrategy.CopyGlobalHtml === strategy) {
    return { rawAppHtml: globalHtml, appHtml, globalHtml };
  }

  return { rawAppHtml: HEL_REPO_EXTERNAL_HTML_PATH, appHtml, globalHtml };
}

function handleHtmlForExUser(/** @type {Options} */ options, repoExLinks) {
  const { pkg2CanBeExternals, appData } = options;
  const { rawAppHtml, appHtml } = getHtmlPath(options, EReuseStrategy.CopyGlobalHtml);
  fs.cpSync(rawAppHtml, appHtml);

  const pkgName = appData.appPkgName;
  const canBeExternals = pkg2CanBeExternals[pkgName] || {};
  const helEx = Object.keys(canBeExternals)
    .map((pkgName) => getExternalBoundName(pkgName))
    .join(',');

  rewriteFileLine(appHtml, (line) => {
    let targetLine = line;
    if (line.includes('</head>')) {
      targetLine = [];
      repoExLinks.forEach((link) => {
        targetLine.push(`  <script id="EX_L1" data-helex="${helEx}" src="${link}"></script>`);
      });
      targetLine.push('</head>');
    }
    return { line: targetLine };
  });

  return { appHtml, rawAppHtml };
}

function handleHtmlForExProjSelf(/** @type {Options} */ options) {
  const { nmL1ExternalDeps, appData } = options;
  const { rawAppHtml, appHtml, globalHtml } = getHtmlPath(options, EReuseStrategy.CopyEmptyHtml);
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
        `<h1>This is a local static server for supplying repo externals of project <span style="color:red">${serveFor}</span></h1>`,
        `<h4 style="color:gray;margin:8px;">ex project path: ${appDirPath}</h4>`,
        '<h4 style="color:gray;margin:8px;">supply these externals below (extracted by hel-mono-helper):</h4>',
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

      targetLine.push('<div style="color:blue;font-weight:600">Package.json paths:</div>');
      genPreContent(targetLine, pkgPaths);
      targetLine.push('<div style="text-align:center"><a target="_blank" href="https://github.com/Tencent/hel">Powered by Hel</a></div>');
    } else if (line.includes('id="BASE_EX"')) {
      // 此处可能将 ex-project 的 baseEx 一个链接节点换为多个 节点
      targetLine = getBaseExScriptList(globalHtml);
    }

    return { line: targetLine };
  });

  return { rawAppHtml, appHtml };
}

/**
 * 替换 html 里的内容，提示用户正在提供哪些 external 模块
 */
module.exports = function replaceExHtmlContent(/** @type {Options} */ options) {
  const { appData, isCurProjectEx, devInfo } = options;
  // 自身是 ex 项目
  if (isCurProjectEx) {
    return handleHtmlForExProjSelf(options);
  }

  const repoExLinks = getRepoExLinks(options);
  // 是一个需要 ex 链接的项目
  if (repoExLinks.length) {
    return handleHtmlForExUser(options, repoExLinks);
  }
  if (devInfo.allowEmptySrcIndex) {
    const rawAppHtml = path.join(appData.monoRoot, './dev/public/index.html');
    return { appHtml: rawAppHtml, rawAppHtml };
  }

  return getHtmlPath(options);
};
