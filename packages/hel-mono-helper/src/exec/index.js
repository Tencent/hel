const { INNER_ACTION, INNER_ACTION_NAMES } = require('../consts');
const { getCmdKeywordName, setCurKeyword, getCWD, helMonoLog, helMonoErrorLog, clearMonoLog } = require('../util');
const { execAppAction } = require('./app');
const { startHelDeps } = require('./helDeps');
const { execInit, execInitProxy } = require('./init');
const { execCreate, execCreateStart } = require('./create');
const { execBuild } = require('./build');
const { execLint } = require('./lint');
const { execTsup } = require('./tsup');
const { buildSrvModToHelDist } = require('./srvMod');

const innerActionFns = {
  [INNER_ACTION.init]: execInit,
  [INNER_ACTION.initProxy]: execInitProxy,
  [INNER_ACTION.create]: execCreate,
  [INNER_ACTION.build]: execBuild,
  [INNER_ACTION.lint]: execLint,
  [INNER_ACTION.createStart]: execCreateStart,
  [INNER_ACTION.createStartShort]: execCreateStart,
  [INNER_ACTION.startHelDeps]: startHelDeps,
  [INNER_ACTION.tsup]: execTsup,
};

/**
 * 尝试执行内部预设的动作函数
 */
function tryExecInnerAction(actionName, devInfo) {
  if (INNER_ACTION_NAMES.includes(actionName)) {
    const actionFn = innerActionFns[actionName];
    if (!actionFn) {
      helMonoLog(`currently unsupported inner action ${actionName}`);
    } else {
      helMonoLog(`hit inner action ${actionName}, start to exec preset logic`);
      actionFn(devInfo);
    }
    return;
  }

  const these = INNER_ACTION_NAMES.join(' ');
  helMonoErrorLog(`unknown inner action ${actionName}, it must be one of (${these})`);
  process.exit(1);
}

function execStartOrBuildCmd(/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo, startOrBuild) {
  const cwd = getCWD();
  const rawKeywordName = getCmdKeywordName();
  setCurKeyword(rawKeywordName);
  clearMonoLog();
  clearMonoLog(true, true);
  helMonoLog(`cwd ${cwd}, rawKeywordName ${rawKeywordName}`);

  // 尝试执行内部预设的动作函数
  if (rawKeywordName.startsWith('.')) {
    tryExecInnerAction(rawKeywordName, devInfo);
    return;
  }

  execAppAction(devInfo, rawKeywordName, startOrBuild);
}

/**
 * 基于 npm start xxx 来启动或构建宿主
 */
exports.executeStart = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo) {
  execStartOrBuildCmd(devInfo, 'start');
};

/**
 * 基于 npm build xxx 构建应用
 */
exports.executeBuild = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo) {
  execStartOrBuildCmd(devInfo, 'build');
};

exports.buildSrvModToHelDist = buildSrvModToHelDist;
