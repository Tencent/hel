const { getConfig } = require('../config');
const { TPL_REACT_MONO, CMD_TYPE, CMD_TYPE_LIST, ALL_CMD_TYPE_LIST, CMD_SHORT_TYPE } = require('../consts');
const { setIsDebug } = require('./debug');
const { logPurple } = require('./log');

/** 获取描述 args 的对象 */
function getArgObject(args) {
  let isCmdTypeChanged = false;
  const argObj = {
    cmdType: CMD_TYPE.init,
    cmdValue: '',
    projectName: '',
    template: TPL_REACT_MONO,
    helMonoStartCmd: '',
    isBumpTplStore: false,
    isViewTplStoreVerByPkgManager: false,
    isTplRemote: false,
    isSeeHelp: false,
    isInstall: false,
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

  const maySetCmdTypeAndValue = (idx) => {
    if (isCmdTypeChanged) {
      return false;
    }
    const [cmdType = '', cmdValue] = args.slice(idx);
    if (cmdType.startsWith('-') || cmdType.startsWith('--')) {
      return false;
    }

    // 未命中内置命令时则报错
    if (!ALL_CMD_TYPE_LIST.includes(cmdType)) {
      const config = getConfig();
      logPurple(
        `You can just type '${config.cliKeyword}', `
        + 'then cli will trigger interactive commands to ask you to input project name '
        + 'if you forget the command.',
      );
      throw new Error(`Unknown command: "${cmdType}", it must be one of (${CMD_TYPE_LIST.join(', ')})`);
    }

    // 命中了内置命令
    const targetCmdType = CMD_SHORT_TYPE[cmdType] || cmdType;
    argObj.cmdType = targetCmdType;
    isCmdTypeChanged = true;
    skipIdx[0] = true;
    if (CMD_TYPE.init === targetCmdType) {
      argObj.projectName = cmdValue;
      skipIdx[1] = true;
    }
    if (CMD_TYPE.help === targetCmdType) {
      argObj.isSeeHelp = true;
    }
    if (CMD_TYPE.install === targetCmdType) {
      argObj.isInstall = true;
    }

    argObj.cmdValue = cmdValue;

    return true;
  };

  for (let i = 0; i < args.length; i++) {
    // 可能出现以下两种情况，故检查 0 和 1 两个位置
    // hel -d build ...
    // hel build ...
    if ((i === 0 || i === 1) && maySetCmdTypeAndValue(i)) {
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

function getRestArgsStr(keyword, excludes = []) {
  const argv = process.argv;
  const pure = argv.filter((v) => !excludes.includes(v));
  const keywordIdx = pure.findIndex((v) => v === keyword);
  const restArgs = pure.slice(keywordIdx + 1);
  return restArgs.join(' ');
}

module.exports = {
  getArgObject,
  getRestArgsStr,
};
