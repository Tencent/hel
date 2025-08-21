const shell = require('shelljs');
const { HEL_MONO_CMD_TYPE_LIST, CMD_TYPE } = require('./consts');
const { createTemplate } = require('./create-template');
const util = require('./util');


/**
 * 触发 hel-moon 大仓里的命令
 */
function execHelMonoCmd(helMonoStartCmd) {
  util.logDebug(`See var: helMonoStartCmd ${helMonoStartCmd}`);
  if (
    helMonoStartCmd === 'start'
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
  const { cmdType, cmdValue } = argObj;

  if (CMD_TYPE.init === cmdType) {
    await createTemplate(argObj);
    return;
  }

  if (CMD_TYPE.start === cmdType) {
    const helMonoStartCmd = cmdValue ? `start ${cmdValue}` : 'start';
    return shell.exec(`pnpm run ${helMonoStartCmd}`);
  }

  if (HEL_MONO_CMD_TYPE_LIST.includes(cmdType)) {
    const helMonoStartCmd = cmdValue ? `start .${cmdType} ${cmdValue}` : 'build';
    return shell.exec(`pnpm run ${helMonoStartCmd}`);
  }

  console.log(`Unhandled command: "${cmdType}"`);
}

/**
 * 解析命令行参数，创建 hel-mono 模板项目
 */
exports.analyzeArgs = async function analyzeArgs(forHels) {
  const args = process.argv.slice(2);
  try {
    const argObj = util.getArgObject(args);
    const { isSeeVersion, isSeeHelp, helMonoStartCmd, isBumpTplStore, isViewTplStoreVerByPkgManager } = argObj;

    if (isSeeVersion) {
      return util.logCliVersion();
    }

    if (isSeeHelp) {
      return util.logHelpInfo();
    }

    util.logCliInfo();

    if (isViewTplStoreVerByPkgManager) {
      return util.viewTplStoreVerByPkgManager();
    }

    if (isBumpTplStore) {
      return util.bumpTplStore();
    }

    // for hels bin
    if (forHels) {
      // 触发 hels bin 命令，表示全部走 hel-mono 大仓命令
      const pureArgs = args.filter((v) => v !== '-d' && v !== '--debug');
      return execHelMonoCmd(pureArgs.join(' ') || 'start');
    }

    if (helMonoStartCmd) {
      return execHelMonoCmd(helMonoStartCmd);
    }


    await tryExecCmd(argObj);
  } catch (e) {
    util.logFinalError(e);
  }
};
