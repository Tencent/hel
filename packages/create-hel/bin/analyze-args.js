const shell = require('shelljs');
const { getConfig } = require('./config');
const { CMD_TYPE_LIST, CMD_TYPE } = require('./consts');
const { createTemplate } = require('./create-template');
const util = require('./util');

/**
 * debug 模式才打印关键信息
 */
function logKeyParams(args, argObj) {
  util.logDepPath();
  util.logDebug(`See var: args ${args}`);
  util.logDebug('See var: argObj', argObj);
  util.logDebug(`See var: cwd ${process.cwd()}`);
}

/**
 * 触发 hel-moon 大仓里的命令
 */
function execHelMonoCmd(helMonoStartCmd) {
  util.logDebug(`See var: helMonoStartCmd ${helMonoStartCmd}`);
  if (helMonoStartCmd === 'start'
    || helMonoStartCmd.startsWith('start:')
    || helMonoStartCmd === 'build'
    || helMonoStartCmd.startsWith('build:')
  ) {
    // 推测是在子目录下执行
    // hel -s 'start:hel' --> pnpm run start:hel
    shell.exec(`pnpm run ${helMonoStartCmd}`);
  } else {
    // hel -s hub --> pnpm start hub
    // hel -s '.create hub2' --> pnpm start .create hub2
    shell.exec(`pnpm start ${helMonoStartCmd}`);
  }
}

async function tryExecCmd(argObj) {
  const { cmdType } = argObj;

  if (!CMD_TYPE_LIST.includes(cmdType)) {
    throw new Error(`Unknown command: "${cmdType}", it must be one of (${Object.keys(CMD_TYPE)})`);
  }

  if (CMD_TYPE.init === cmdType) {
    await createTemplate(argObj);
    return;
  }

  console.log(`Unhandled command: "${cmdType}"`);
}

/**
 * 解析命令行参数，创建 hel-mono 模板项目
 */
exports.analyzeArgs = async function analyzeArgs(forHels) {
  const args = process.argv.slice(2);
  const argObj = util.getArgObject(args);
  const { isSeeVersion, isSeeHelp, helMonoStartCmd } = argObj;

  if (isSeeVersion) {
    return console.log(getConfig().cliPkgVersion);
  }

  if (isSeeHelp) {
    return util.logHelpInfo();
  }

  util.logCliInfo();
  logKeyParams(args, argObj);

  // for hels bin
  if (forHels) {
    // 触发 hels bin 命令，表示全部走 hel-mono 大仓命令
    const pureArgs = args.filter(v => v !== '-d' && v !== '--debug');
    return execHelMonoCmd(pureArgs.join(' ') || 'start');
  }

  if (helMonoStartCmd) {
    return execHelMonoCmd(helMonoStartCmd);
  }

  try {
    await tryExecCmd(argObj);
  } catch (e) {
    util.logError(e.message);
    util.logError(e, true);
    process.exit(1);
  }
};
