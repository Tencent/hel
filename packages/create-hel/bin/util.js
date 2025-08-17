/** @typedef {import('./types.d.ts').IArgObj} IArgObj */
const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const { getConfig } = require('./config');
const { TEMPLATE } = require('./consts');

let isDebug = false;

const seLine = '+---------------------------------------------------------------------------+';
const emptyLine = '|                                                                           |';

function getIsDebug() {
  return isDebug;
}

function setIsDebug(isDebugVar) {
  isDebug = isDebugVar;
}

function charByte(mayChar, idx = 0) {
  return mayChar.charCodeAt(idx) < 128 ? 1 : 2;
}

/** 获取字符串的字节长度，注：此方法仅适用于普通字符，不适用于表情符号（例如：👯‍♂️） */
function getByteLength(str) {
  let count = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    count += charByte(str, i);
  }
  return count;
}

function getUsageInfo() {
  const { cliPkgName } = getConfig();
  return (
    'usage with command keyword [create-hel-mono]:\n'
    + '  1: create-hel-mono <your-project-name>\n'
    + '  2: create-hel-mono <your-project-name> -c <template-repo-url>\n'
    + `By the way, you can replace 'create-hel-mono' with 'npx ${cliPkgName}'`
  );
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
    projectName: '',
    template: TEMPLATE,
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

  const maySetProjectName = (i) => {
    const name = args[i];
    if (name.startsWith('-') || skipIdx[i]) {
      return;
    }
    argObj.projectName = name;
  };

  for (let i = 0; i < args.length; i++) {
    mayAssignObj(['-h', '--help'], 'isSeeHelp', i, true);
    mayAssignObj(['-d', '--debug'], 'isDebug', i, true);
    mayAssignObj(['-v', '--version'], 'isSeeVersion', i, true);
    mayAssignObj(['-r', '--remote'], 'isTplRemote', i, true);
    mayAssignObj(['-t', '--template'], 'template', i);
    mayAssignObj(['-u', '--url'], 'customTplUrl', i);
    maySetProjectName(i);
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

function logCreateSuccess({ projectName, dirPath }) {
  console.log(chalk.green(`\n✅ Project of hel-mono [${projectName}] created on ${chalk.bold(dirPath)}`));
  console.log(chalk.cyan(`\nnext:\n  cd ${projectName}\n  pnpm install\n  pnpm start`));
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

function logCliInfo() {
  const { cliPkgName, cliPkgVersion, cliKeyword, basedOn } = getConfig();
  const fixedLen = seLine.length - 1;
  const lgLine = (str, color, inputStrLen) => {
    const mayColoredStr = color ? chalk.hex(color)(str) : str;
    const prefixedStr = `|   ${mayColoredStr}`;
    let strLen = inputStrLen;
    if (!strLen) {
      strLen = Math.ceil(color ? prefixedStr.length / 2 + 2 : prefixedStr.length);
    }
    logTipLine(prefixedStr, fixedLen, { strLen, lastChar: '|' });
  };

  logTip(seLine);
  logTip(emptyLine);
  lgLine(`Cli info: ${cliPkgName}@${cliPkgVersion}`);
  lgLine('Star hel-micro https://github.com/Tencent/hel if you like it ^_^');
  lgLine(`Quick start: ${cliKeyword} <your-project-name>`);
  lgLine(`Help: ${cliKeyword} -h`);
  if (basedOn) {
    lgLine(`Based on: ${basedOn}`);
  }
  logTip(emptyLine);
  logTip(seLine);
}

function logHelpInfo() {
  logCliInfo();
  const { cliFullKeyword, cliKeyword } = getConfig();
  logTip(`Attention: cli cmd ${cliFullKeyword} and ${cliKeyword} is both available, choose any one you like.\n`);
  logTip('--------------- cli cmd use case ------------------');
  logTip('create hel-mono by specified project name:');
  logTip(`${cliKeyword} <project-name>\n`);
  logTip('use -t or --template arg to create hel-mono by specified template type:');
  logTip(`${cliKeyword} <project-name> -t <template-type>\n`);
  logTip('use -u or --url arg to create hel-mono by specified template repo url(-t -r arg will be ignored):');
  logTip(`${cliKeyword} <project-name> -u <template-repo-url>\n`);
}

function getDepPath(name) {
  try {
    return require.resolve(name);
  } catch (err) {
    return err.message;
  }
}

function logDepPath() {
  if (getIsDebug()) {
    const { helMonoTemplates } = getConfig();
    logPurple(`See dep path: chalk ${getDepPath('chalk')}`);
    logPurple(`See dep path: fs-extra ${getDepPath('fs-extra')}`);
    logPurple(`See dep path: hel-mono-templates ${getDepPath(helMonoTemplates)}`);
  }
}

module.exports = {
  getUsageInfo,
  getIsDebug,
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
};
