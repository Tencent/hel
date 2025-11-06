const chalk = require('chalk');
const { getConfig } = require('../config');
const { TEMPLATE_REACT_MONO } = require('../consts');
const { getIsDebug } = require('./debug');
const { getDepPath } = require('./dep');
const { logPurple, logError, logTipLine, logTip, logDebug } = require('./log');
const { logUsage } = require('./log-usage');
const { getHelMonoTemplatesVer } = require('./tpl');

const seLine = '+---------------------------------------------------------------------------+';
const emptyLine = '|                                                                           |';

function logDepPath() {
  if (getIsDebug()) {
    const { helMonoTemplates } = getConfig();
    logPurple(`See dep path: chalk ${getDepPath('chalk')}`);
    logPurple(`See dep path: fs-extra ${getDepPath('fs-extra')}`);
    logPurple(`See dep path: hel-mono-templates ${getDepPath(helMonoTemplates)}`);
  }
}

function logCreateSuccess({ projectName, dirPath, template }) {
  console.log(chalk.green(`\n✅ Project of hel-mono [${projectName}] created on ${chalk.bold(dirPath)}`));
  let devTip = `\nnext:\n  cd ${projectName}\n  pnpm install\n  pnpm start`;

  if (TEMPLATE_REACT_MONO === template) {
    devTip += `\n\ndev hint:\n  pnpm start hub (start apps/hub with legacy mode)`;
    devTip += `\n  pnpm start hub:hel (start apps/hub with micro-module mode)`;
    devTip += `\n  pnpm start .test hub (create react lib to packages dir)`;
    devTip += `\n  pnpm start .build hub (build apps/hub with legacy mode)`;
    devTip += `\n  pnpm start .build hub:hel (build apps/hub with micro-module mode)`;
    devTip += `\n  pnpm start .create <some-app> (create an app to apps dir)`;
    devTip += `\n  pnpm start .create-mod <some-lib> (create lib to packages dir)`;
    devTip += `\n  pnpm start .create-mod <some-lib> -t react-lib (create react lib to packages dir)`;
    console.log(chalk.cyan(devTip));
  }
}

/**
 * debug 模式才打印部分关键信息
 */
function logKeyParams(args, argObj) {
  logDepPath();
  logDebug(`See var: argv ${process.argv}`);
  logDebug(`See var: args ${args}`);
  logDebug('See var: argObj', argObj);
  logDebug(`See var: cwd ${process.cwd()}`);
}

function logCliInfo() {
  const { cliPkgName, cliPkgVersion, cliKeyword, basedOn, contactAuthor, contactAuthorReferLen, helMonoTemplates, repoUrlPrefix } =
    getConfig();
  const fixedLen = seLine.length - 1;
  const lgLine = (str, color, inputStrLen) => {
    if (!str) {
      return;
    }

    const mayColoredStr = color ? chalk.hex(color)(str) : str;
    const prefixedStr = `|   ${mayColoredStr}`;
    let strLen = inputStrLen;
    if (!strLen) {
      strLen = Math.ceil(color ? prefixedStr.length / 2 + 2 : prefixedStr.length);
    }
    logTipLine(prefixedStr, fixedLen, { strLen, lastChar: '|' });
  };

  const tplStoreVer = getHelMonoTemplatesVer();

  logTip(seLine);
  logTip(emptyLine);
  lgLine(`Cli info: ${cliPkgName}@${cliPkgVersion}`);
  lgLine('Star hel-micro https://github.com/Tencent/hel if you like it ^_^');
  lgLine(`Quick start: ${cliKeyword} init <project-name>`);
  lgLine(`Help: ${cliKeyword} -h`);
  lgLine(`Local templates store: ${helMonoTemplates}@${tplStoreVer}`);
  lgLine(`Remote templates store prefix: ${repoUrlPrefix}`);
  lgLine(basedOn);
  lgLine(contactAuthor, '#ad4e00', contactAuthorReferLen);
  logTip(emptyLine);
  logTip(seLine);
}

function logHelpInfo() {
  logCliInfo();
  logUsage();
}

function logCliVersion() {
  console.log(getConfig().cliPkgVersion);
}

function logFinalError(e) {
  const errMsg = e.message;
  if (errMsg.includes('Unknown command')) {
    logError(errMsg);
    logUsage();
    return;
  }

  logError(e.message);
  logError(e, true);
  process.exit(1);
}

module.exports = {
  logCreateSuccess,
  logKeyParams,
  logHelpInfo,
  logDepPath,
  logCliInfo,
  logCliVersion,
  logFinalError,
};
