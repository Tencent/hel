const { getConfig } = require('../config');
const { TEMPLATE_REACT_MONO, CMD_TYPE, CMD_TYPE_LIST, ALL_CMD_TYPE_LIST, CMD_SHORT_TYPE } = require('../consts');
const { setIsDebug } = require('./debug');
const { logPurple } = require('./log');

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
      const config = getConfig();
      logPurple(
        `You can just type '${config.cliKeyword}',`
        + 'then cli will trigger interactive commands to ask you input project name '
        + 'if you forget the command.',
      );
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
