/** @typedef {import('./types.d.ts').IArgObj} IArgObj */
const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const shell = require('shelljs');
const { getConfig } = require('./config');
const { TEMPLATE_REACT_MONO, CMD_TYPE, CMD_TYPE_LIST, ALL_CMD_TYPE_LIST, CMD_SHORT_TYPE } = require('./consts');

let isDebug = false;

const seLine = '+---------------------------------------------------------------------------+';
const emptyLine = '|                                                                           |';

function getIsDebug() {
  return isDebug;
}

function setIsDebug(isDebugVar) {
  isDebug = isDebugVar;
}

function logUsage() {
  const usageStr = '\nHel <command> usage:\n\n'
    + 'hel init <project-name>              create hel project\n'
    + 'hel init <project-name> -t <type>    create hel project by type (Default:react-mono)\n'
    + 'hel init <project-name> -u <url>     create hel project by url\n'
    + 'hel -v,--version                     see cli version\n'
    + 'hel -d,--debug                       execute hel cli command (init, help etc) with debug log\n'
    + 'hel help                             see help info\n\n'
    + '# The following usage is only available under the hel-mono type project\n'
    + 'hel start <mod-name-or-dir>          start hel mod with legacy mode\n'
    + 'hel start <mod-name-or-dir>:hel      start hel mod with micro-module mode\n'
    + 'hel build <mod-name-or-dir>          build hel mod with legacy mode\n'
    + 'hel build <mod-name-or-dir>:hel      build hel mod with micro-module mode\n'
    + 'hel create <dir-name>                create a hel app\n'
    + 'hel create <dir-name> -t             create a hel app with type (Default:react-app)\n'
    + 'hel create <dir-name> -n             create a hel app with package name\n'
    + 'hel create <dir-name> -a             create a hel app with alias\n'
    + 'hel create-mod <dir-name>            create a hel mod\n'
    + 'hel create-mod <dir-name> -t         create a hel mod with type (Default:ts-lib)\n'
    + 'hel create-mod <dir-name> -n         create a hel mod with package name\n'
    + 'hel create-mod <dir-name> -a         create a hel mod with package alias\n'
    + 'hel test <mod-name-or-dir>           test hel mod\n'
    + 'hel test-watch <mod-name-or-dir>     test hel mod witch watch mode\n'
    + 'hel deps <mod-name-or-dir>           start micro-module dev servers of hel mod deps\n'
    + '';
  console.log(usageStr);
}

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    // 监听error事件以处理可能的输入流异常
    rl.on('error', (err) => {
      console.error('Readline interface encountered an error:', err);
      rl.close();
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function getProjectNameByAsk() {
  const projectName = await askQuestion(chalk.cyan('Enter your project name: '));
  if (!projectName) {
    throw new Error('Project name is empty!');
  }
  return projectName;
}

function getTemplateRepoUrl(templateType) {
  const { repoUrlDict, repoUrlPrefix } = getConfig();
  let repoUrl = repoUrlDict[templateType];
  if (!repoUrl) {
    repoUrl = `${repoUrlPrefix}${templateType}.git`;
  }
  return repoUrl;
}

/** 获取描述 args 的对象 */
function getArgObject(args) {
  const argObj = {
    cmdType: CMD_TYPE.init,
    cmdValue: '',
    projectName: '',
    template: TEMPLATE_REACT_MONO,
    helMonoStartCmd: '',
    isBumpTplStore: false,
    isViewTplStoreVerByPkgManager: false,
    isTplRemote: false,
    isSeeHelp: false,
    isDebug: false,
    customTplUrl: '',
    isSeeVersion: false,
  };
  const skipIdx = {};
  const mayAssignObj = (argKeys, objKey, i, isBoolValue) => {
    if (skipIdx[i] || !argKeys.includes(args[i])) {
      return;
    }

    skipIdx[i] = true;
    if (isBoolValue) {
      // -x --xx 自身就表示设置布尔值为 true
      argObj[objKey] = true;
      return;
    }

    if (!args[i + 1]) {
      return;
    }

    skipIdx[i + 1] = true;
    argObj[objKey] = args[i + 1];
  };

  const maySetCmdTypeAndValue = () => {
    const [cmdType = '', cmdValue] = args;

    if (cmdType.startsWith('-') || cmdType.startsWith('--')) {
      return false;
    }

    // 未命中内置命令时则报错
    if (!ALL_CMD_TYPE_LIST.includes(cmdType)) {
      logPurple("You can just type 'hel',"
        + "then cli will trigger interactive commands to ask you input project name "
        + "if you forget the command."
      )
      throw new Error(`Unknown command: "${cmdType}", it must be one of (${CMD_TYPE_LIST.join(', ')})`);
    }

    // 命中了内置命令
    const targetCmdType = CMD_SHORT_TYPE[cmdType] || cmdType;
    argObj.cmdType = targetCmdType;
    skipIdx[0] = true;
    if (CMD_TYPE.init === targetCmdType) {
      argObj.projectName = cmdValue;
      skipIdx[1] = true;
    }
    if (CMD_TYPE.help === targetCmdType) {
      argObj.isSeeHelp = true;
    }

    argObj.cmdValue = cmdValue;

    return true;
  };

  for (let i = 0; i < args.length; i++) {
    if (i === 0 && maySetCmdTypeAndValue()) {
      continue;
    }

    mayAssignObj(['-h', '--help'], 'isSeeHelp', i, true);
    mayAssignObj(['-d', '--debug'], 'isDebug', i, true);
    mayAssignObj(['-v', '--version'], 'isSeeVersion', i, true);
    mayAssignObj(['-r', '--remote'], 'isTplRemote', i, true);
    mayAssignObj(['-b', '--bump'], 'isBumpTplStore', i, true);
    mayAssignObj(['-vs', '--view-store-ver'], 'isViewTplStoreVerByPkgManager', i, true);
    mayAssignObj(['-t', '--template'], 'template', i);
    mayAssignObj(['-u', '--url'], 'customTplUrl', i);
    mayAssignObj(['-s', '--start'], 'helMonoStartCmd', i);
  }

  if (argObj.isDebug) {
    setIsDebug(true);
  }

  return argObj;
}

async function modifyPkgInfo({ projectName, dirPath }) {
  const pkgPath = path.join(dirPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}

/**
 * 推导 hel-mono-templates 包位置，如不存在则尝试安装
 */
function ensureHelMonoTemplates() {
  const { helMonoTemplates } = getConfig();
  /**
   * 不同版本 npx 安装的 hel-mono-templates 包路径不一样，可能为
   * 1 /Users/soul/.npm/_npx/ace083ee75254b22/node_modules/chalk/source/index.js
   * 2 /Users/soul/.npm/_npx/32399/lib/node_modules/create-hel-mono/node_modules/chalk/source/index.js
   */
  const createHelMonoPkgPath = path.join(__dirname, '../');

  let nodeModulesPath = path.join(createHelMonoPkgPath, './node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    nodeModulesPath = path.join(createHelMonoPkgPath, '../../node_modules');
  }

  let helMonoTemplatesPkgPath = path.join(nodeModulesPath, helMonoTemplates);
  if (!fs.existsSync(helMonoTemplatesPkgPath)) {
    helMonoTemplatesPkgPath = path.join(createHelMonoPkgPath, '../../node_modules');
  }

  if (!fs.existsSync(helMonoTemplatesPkgPath)) {
    logTip(`First time to use create-hel-mono, try install inner templates to local`);
    logDebug(`Execute cmd: cd ${createHelMonoPkgPath}`);
    execSync(`cd ${createHelMonoPkgPath}`);

    const argv = process.argv;
    logDebug(`See var: argv ${argv}`);

    let npmKey = argv.some((v) => v.includes('.npm')) ? 'npm' : 'pnpm';

    if (argv[0].includes('/bin/node') && npmKey !== 'pnpm') {
      npmKey = argv[0].replace('/bin/node', '/bin/npm');
      logDebug(`Use new var: npmKey ${npmKey}`);
    }

    logDebug(`Execute cmd: ${npmKey} --version`);
    execSync(`${npmKey} --version`);

    logDebug(`Execute cmd: ${npmKey} install`);
    execSync(`${npmKey} install ${helMonoTemplates}`);
  } else {
    // TODO 支持 hel-mono --update 来更新模板
    logDebug(`Reuse template store ${helMonoTemplatesPkgPath}`);
  }

  return helMonoTemplatesPkgPath;
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

function getProjectDirPath(/** @type IArgObj */ argObj) {
  const cwd = process.cwd();
  const { projectName } = argObj;
  logDebug(`See Var: cwd ${cwd}`);
  const targetDirPath = path.resolve(cwd, projectName);
  if (fs.existsSync(targetDirPath)) {
    throw new Error(`Project [${projectName}] already exists at ${cwd}`);
  }

  return targetDirPath;
}

function logTip(str) {
  console.log(chalk.cyan(str));
}

function logError(str, useRawErrorLogHandler) {
  if (useRawErrorLogHandler) {
    return console.error(str);
  }
  // log with dark red color
  console.log(chalk.hex('#c03b28')(str));
}

function logPurple(str, strOrObj) {
  // log with purple color
  console.log(chalk.hex('#800080')(str));
  if (strOrObj) {
    console.log(strOrObj);
  }
}

function logDebug(str, strOrObj) {
  if (!getIsDebug()) {
    return;
  }
  logPurple(str, strOrObj);
}

function getInfoLine(str, fixedLen, options) {
  const optVar = options || {};
  const strLen = optVar.strLen || str.length;
  const lastChar = optVar.lastChar || '';

  let toFillStr = '';
  if (strLen < fixedLen) {
    const charArr = new Array(fixedLen - strLen).fill(' ');
    toFillStr = charArr.join('');
  }

  return `${str}${toFillStr}${lastChar}`;
}

/** log tip line */
function logTipLine(str, fixedLen, options) {
  logTip(getInfoLine(str, fixedLen, options));
}

function getHelMonoTemplatesVerByPath(mayModIndexPath, clearCache) {
  let modPath = mayModIndexPath;
  if (modPath.endsWith('/index.js')) {
    // 去掉末尾的 /index.js
    modPath = modPath.substring(0, modPath.length - 9);
  }

  const pkgJsonPath = path.join(modPath, './package.json');
  if (clearCache) {
    delete require.cache[mayModIndexPath];
    delete require.cache[pkgJsonPath];
  }

  const ver = require(pkgJsonPath).version;
  return ver;
}

function getHelMonoTemplatesVer() {
  const { helMonoTemplates } = getConfig();
  const { modPath, isSuccess, err } = getDepPathStat(helMonoTemplates);
  let ver = '';
  if (isSuccess) {
    ver = getHelMonoTemplatesVerByPath(modPath);
  } else {
    console.error(err);
  }

  return ver;
}

/**
 * debug 模式才打印部分关键信息
 */
function logKeyParams(args, argObj) {
  logDepPath();
  logDebug(`See var: args ${args}`);
  logDebug('See var: argObj', argObj);
  logDebug(`See var: cwd ${process.cwd()}`);
}

function logCliInfo() {
  logKeyParams();
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

function getDepPathStat(name) {
  try {
    return { modPath: require.resolve(name), isSuccess: true, err: '' };
  } catch (err) {
    return { modPath: '', isSuccess: false, err: err.message };
  }
}

function getDepPath(name) {
  const { modPath } = getDepPathStat(name);
  return modPath;
}

function logDepPath() {
  if (getIsDebug()) {
    const { helMonoTemplates } = getConfig();
    logPurple(`See dep path: chalk ${getDepPath('chalk')}`);
    logPurple(`See dep path: fs-extra ${getDepPath('fs-extra')}`);
    logPurple(`See dep path: hel-mono-templates ${getDepPath(helMonoTemplates)}`);
  }
}

function logCliVersion() {
  console.log(getConfig().cliPkgVersion);
  logKeyParams();
}

function bumpTplStore() {
  const { pkgManager, helMonoTemplates } = getConfig();
  const { isSuccess, modPath, err } = getDepPathStat(helMonoTemplates);
  if (!isSuccess) {
    return console.error(err);
  }

  const oldVer = getHelMonoTemplatesVerByPath(modPath);
  const parentDir = modPath.split(`/${helMonoTemplates}`)[0];
  logPurple(`Hel cli will bump ${helMonoTemplates} at ${parentDir}`);
  shell.cd(parentDir);

  const npmCmd = `${pkgManager} install ${helMonoTemplates}@latest`;
  logPurple(`Bump ${helMonoTemplates} by '${npmCmd}'...`);

  shell.exec(npmCmd);
  const newVer = getHelMonoTemplatesVerByPath(modPath, true);

  logPurple(`Bump ${helMonoTemplates} from ${oldVer} to ${newVer}`);
}

function viewTplStoreVerByPkgManager() {
  const { pkgManager, helMonoTemplates } = getConfig();
  shell.exec(`${pkgManager} view ${helMonoTemplates}`);
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
  getIsDebug,
  setIsDebug,
  askQuestion,
  ensureHelMonoTemplates,
  getProjectNameByAsk,
  getProjectDirPath,
  getTemplateRepoUrl,
  modifyPkgInfo,
  logCliInfo,
  logCreateSuccess,
  getArgObject,
  logError,
  logPurple,
  logDebug,
  logHelpInfo,
  logTip,
  logDepPath,
  logKeyParams,
  logCliVersion,
  logFinalError,
  bumpTplStore,
  viewTplStoreVerByPkgManager,
};
