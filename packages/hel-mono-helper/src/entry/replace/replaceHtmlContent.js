/** @typedef {import('hel-mono-types').IExLink} IExLink */
/** @typedef {import('../../types').IReplaceExHtmlContentOptions} Options */
const fs = require('fs');
const path = require('path');
const { baseUtils } = require('hel-dev-utils-base');
const { HEL_REPO_EXTERNAL_HTML_PATH } = require('../../consts');
const { HTML_PATH, VALID_EX_SUFFIXES } = require('../../consts/inner');
const { helMonoLog, getCWDAppData } = require('../../util');
const { lastItem } = require('../../util/arr');
const { getIsEnableRepoEx } = require('../../util/devInfo');
const { chooseValList, isDict } = require('../../util/dict');
const { getExJson } = require('../../util/ex');
const { cpSync, resolveAppRelPath, getFileJson } = require('../../util/file');
const { isHelAllOrMicroBuild, isHelAllBuild } = require('../../util/is');
const { getExternalBoundName } = require('../../util/monoPkg');
const { rewriteFileLine } = require('../../util/rewrite');
const { getContentLines } = require('../../util/xplat');

const EReuseStrategy = {
  UseAppHtml: 1,
  CopyAppHtml: 2,
  CopyEmptyExHtml: 3,
};

/**
 * 处理某个标签关键字不是独立一行的情况
 */
function handleNotOneLine(tagKeyWord, rawLine, lineList) {
  const pureLine = rawLine.trim();
  if (pureLine !== tagKeyWord) {
    const [keywordBefore, keywordAfter] = pureLine.split(tagKeyWord);
    lineList.unshift(keywordBefore);
    lineList.push(keywordAfter);
  }
}

function getScriptLine(options) {
  const { idPrefix, idx, helEx, link } = options;
  const dataHelEx = helEx ? `data-helex="${helEx}" ` : '';
  return `  <script id="${idPrefix}${idx}" ${dataHelEx}src="${link}"></script>`;
}

function getMasterAppData(/** @type {Options} */ options) {
  const { appData, devInfo, isCurProjectEx } = options;
  if (isCurProjectEx) {
    const { appDirPath } = appData;
    // /path/to/hel-mono/apps/hub-ex ---> /path/to/hel-mono/apps/hub
    const suffix = VALID_EX_SUFFIXES.find((v) => appDirPath.endsWith(v)) || '';
    const masterAppCwd = appDirPath.substring(0, appDirPath.length - suffix.length);
    return getCWDAppData(devInfo, masterAppCwd);
  }

  return appData;
}

function getMasterAppHtml(/** @type {Options} */ options) {
  const appData = getMasterAppData(options);
  const conf = options.devInfo.appConfs[appData.appPkgName] || {};
  const htmlPath = conf.htmlPath || HTML_PATH;
  const masterAppHtml = path.join(appData.monoRoot, htmlPath);
  return masterAppHtml;
}

function getBaseExScriptList(masterAppHtml, allowEmptyExList) {
  const content = fs.readFileSync(masterAppHtml, { encoding: 'utf-8' });
  const lines = getContentLines(content);
  let scriptStrList = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 包含id="BASE_EX 的节点都收集起来，例如 id="BASE_EX1", id="BASE_EX2" ...
    if (line.includes('id="BASE_EX') && !line.includes('<!--')) {
      scriptStrList.push(line);

      // 确保 script 正常闭合
      let curLine = line;
      let curIdx = i;
      while (!curLine.includes('</script>')) {
        curIdx += 1;
        curLine = lines[curIdx];
        scriptStrList.push(curLine);
      }
    }
  }

  if (!scriptStrList.length && !allowEmptyExList) {
    throw new Error(
      `Cannot find baseExternals link, please check your html file to make sure including a id="BASE_EX" or id="BASE_EX{number}" script node`,
    );
  }

  return scriptStrList;
}

function mayInferEx(/** @type {Options} */ options, inferOptions) {
  /** @type {{link:string}} */
  const { link, ex, onlyOne } = inferOptions;
  if (ex) {
    return ex;
  }

  let targetEx = '';
  // http://localhost:3001/xx.js ---> 3001
  const firstColon = link.indexOf(':');
  const lastColon = link.lastIndexOf(':');
  const canFindPort = firstColon >= 0 && firstColon !== lastColon;
  if (!canFindPort) {
    return targetEx;
  }

  const strItem = lastItem(link.split(':'));
  const [port] = strItem.split('/');
  const { appConfs } = options.devInfo;
  const pkgName = Object.keys(appConfs).find((pkgName) => appConfs[pkgName].port === port);
  if (!pkgName) {
    return targetEx;
  }

  let exProjDeps = appConfs[pkgName].exProjDeps;
  if (!exProjDeps) {
    exProjDeps = options.pkg2Deps[pkgName];
  }
  if (exProjDeps) {
    targetEx = Object.keys(exProjDeps)
      .map((v) => getExternalBoundName(v))
      .join(',');
  }

  if (!targetEx && onlyOne) {
    const { appData, pkg2CanBeExternals } = options;
    const pkgName = appData.appPkgName;
    const canBeExternals = pkg2CanBeExternals[pkgName] || {};
    targetEx = Object.keys(canBeExternals)
      .map((pkgName) => getExternalBoundName(pkgName))
      .join(',');
  }

  return targetEx;
}

function formatRepoExLinks(options, rawLinks) {
  /** @type {IExLink[]} */
  const newLinks = [];
  const onlyOne = rawLinks.length === 1;
  rawLinks.forEach((v) => {
    if (typeof v === 'string' && v) {
      const ex = mayInferEx(options, { link: v, onlyOne });
      newLinks.push({ ex, link: v });
      return;
    }

    if (isDict(v) && v.link) {
      const { link } = v;
      const ex = mayInferEx(options, { ex: v.ex, link, onlyOne });
      newLinks.push({ ex, link });
      return;
    }
  });

  const oneItem = newLinks[0];
  // 仅填写域名时，尝试修正为本地开发模式下的 ex 链接
  if (newLinks.length === 1 && oneItem.link.includes('localhost:') && !oneItem.link.endsWith('.js')) {
    oneItem.link = `${baseUtils.slash.noEnd(oneItem.link)}/static/js/bundle.js`;
  }

  return newLinks;
}

function getRepoExLinks(/** @type {Options} */ options) {
  const { appData, devInfo } = options;
  const { appPkgName } = appData;
  const { appConfs, exConfs = {}, devRepoExLink, prodRepoExLink } = devInfo;
  const appConf = appConfs[appPkgName] || {};
  const exConf = exConfs[appPkgName] || {};
  const isEnableRepoEx = getIsEnableRepoEx(appPkgName, devInfo);
  let exLinks = [];

  if (isHelAllBuild()) {
    return exLinks;
  }

  if (isEnableRepoEx) {
    const isHelBuild = isHelAllOrMicroBuild();
    const modProdRepoExLinks = chooseValList([appConf.prodRepoExLink, exConf.prodRepoExLink, prodRepoExLink]);
    const modDevRepoExLinks = chooseValList([appConf.devRepoExLink, exConf.devRepoExLink, devRepoExLink]);
    if (isHelBuild && !modProdRepoExLinks.length) {
      throw new Error(`missing prodAutoExLink for ${appPkgName} under build mode!`);
    }
    if (!modDevRepoExLinks.length) {
      throw new Error(`missing devAutoExLink for ${appPkgName} under dev mode!`);
    }
    exLinks = isHelBuild ? modProdRepoExLinks : modDevRepoExLinks;
  }
  exLinks = formatRepoExLinks(options, exLinks);

  return exLinks;
}

/**
 * 当 options.appData 非ex项目自身时，返回的 masterAppHtml 和 rawAppHtml 是同一个值
 */
function getHtmlPath(/** @type {Options} */ options, strategy = EReuseStrategy.UseAppHtml) {
  const { appData } = options;
  const masterAppHtml = getMasterAppHtml(options);

  if (EReuseStrategy.UseAppHtml === strategy) {
    return { rawAppHtml: masterAppHtml, appHtml: masterAppHtml, masterAppHtml };
  }

  const appDotHelDir = resolveAppRelPath(appData, '.hel', true);
  const appHtml = path.join(appDotHelDir, 'index.html');

  if (EReuseStrategy.CopyAppHtml === strategy) {
    cpSync(masterAppHtml, appHtml);
    return { rawAppHtml: masterAppHtml, appHtml, masterAppHtml };
  }

  cpSync(HEL_REPO_EXTERNAL_HTML_PATH, appHtml);
  return { rawAppHtml: HEL_REPO_EXTERNAL_HTML_PATH, appHtml, masterAppHtml };
}

function addPeerEx(/** @type {Options} */ options, lineList) {
  const { appPkgName } = options.appData;
  const { appConfs } = options.devInfo;
  const peerExList = appConfs[appPkgName].peerExList || [];

  peerExList.forEach((item, idx) => {
    lineList.push(`  <script id="PEER_EX${idx}" data-helex="${item.ex}" src="${item.link}"></script>`);
  });
}

function handleHtmlForExUser(/** @type {Options} */ options, /** @type IExLink[] */ repoExLinks) {
  const { rawAppHtml, appHtml } = getHtmlPath(options, EReuseStrategy.CopyAppHtml);

  helMonoLog(`replace content of ${appHtml}`);
  // TODO 自动感知 helEx
  // 如果 link 包含 : 取出端口号，尝试找到对应的 appConf 下的 exProjDeps
  rewriteFileLine(appHtml, (/** @type string */ line) => {
    let targetLine = line;
    if (line.includes('</head>')) {
      targetLine = [];
      repoExLinks.forEach((item, idx) => {
        targetLine.push(getScriptLine({ idPrefix: 'REPO_EX', idx, link: item.link, helEx: item.ex }));
      });

      addPeerEx(options, targetLine);
      targetLine.push('</head>');
      handleNotOneLine('</head>', line, targetLine);
    }

    return { line: targetLine };
  });

  return { appHtml, rawAppHtml };
}

function handleHtmlForExProjSelf(/** @type {Options} */ options) {
  const { appData, nmL1ExternalPkgNames = [], devInfo } = options;
  const { rawAppHtml, appHtml, masterAppHtml } = getHtmlPath(options, EReuseStrategy.CopyEmptyExHtml);
  const { appDirPath } = appData;
  const masterAppData = getMasterAppData(options);
  const serveFor = masterAppData.appPkgName;
  const exJson = getExJson({ exAppData: appData, devInfo, masterAppData });

  const appPkgJson = getFileJson(appData.realAppPkgJsonPath, true) || {};
  const helConf = appPkgJson.hel || {};

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
      genPreContent(targetLine, exJson.semVers);

      targetLine.push('<div style="color:blue;font-weight:600">External global names:</div>');
      const globalNames = {};
      nmL1ExternalPkgNames.forEach((v) => (globalNames[v] = getExternalBoundName(v)));
      genPreContent(targetLine, globalNames);

      targetLine.push('<div style="color:blue;font-weight:600">Real versions:</div>');
      genPreContent(targetLine, exJson.vers);

      // 将 exJson 写入 ex 项目的 .hel/ex.json
      const exJsonPath = resolveAppRelPath(appData, '.hel/ex.json');
      fs.writeFileSync(exJsonPath, JSON.stringify(exJson, null, 2));

      targetLine.push('<div style="color:blue;font-weight:600">Package.json paths:</div>');
      genPreContent(targetLine, exJson.pkgJsonPaths);

      targetLine.push('<div style="text-align:center"><a target="_blank" href="https://github.com/Tencent/hel">Powered by Hel</a></div>');
      handleNotOneLine('<body>', line, targetLine);
    } else if (line.includes('id="BASE_EX')) {
      const allowEmptyExList = helConf.isFixed;
      // 此处可能将 masterAppHtml 里的多个 baseEx 都提取出来给 ex-project 的 html 使用
      targetLine = getBaseExScriptList(masterAppHtml, allowEmptyExList);
    }

    return { line: targetLine };
  });

  return { rawAppHtml, appHtml };
}

function handleHtmlForNormalProj(/** @type {Options} */ options) {
  const { appData, devInfo } = options;
  const { appPkgName } = appData;
  const { appConfs } = devInfo;
  const peerExList = appConfs[appPkgName].peerExList || [];
  if (!peerExList.length) {
    return getHtmlPath(options);
  }

  const { rawAppHtml, appHtml } = getHtmlPath(options, EReuseStrategy.CopyAppHtml);
  helMonoLog(`replace content of ${appHtml}`);
  rewriteFileLine(appHtml, (line) => {
    let targetLine = line;
    if (line.includes('</head>')) {
      targetLine = [];
      addPeerEx(options, targetLine);
      targetLine.push('</head>');
      handleNotOneLine('</head>', line, targetLine);
    }
    return { line: targetLine };
  });

  return { appHtml, rawAppHtml };
}

/**
 * 替换 html 里的内容，提示用户正在提供哪些 external 模块
 */
module.exports = function replaceHtmlContent(/** @type {Options} */ options) {
  const { isCurProjectEx, devInfo } = options;
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
    const rawAppHtml = getMasterAppHtml(options);
    return { appHtml: rawAppHtml, rawAppHtml };
  }

  return handleHtmlForNormalProj(options);
};
