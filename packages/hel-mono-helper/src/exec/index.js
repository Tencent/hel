const { ACTION_NAME, INNER_ACTION, INNER_ACTION_NAMES } = require('../consts');
const { getCmdKeywordName, trySetLogName, getCWD, helMonoLog, helMonoErrorLog, clearMonoLog } = require('../util');
const { lastNItem } = require('../util/arr');
const { inferDirFromDevInfo } = require('../util/monoDir');
const { execAppAction } = require('./app');
const { changeMod } = require('./change');
const { delMod } = require('./del');
const { startHelDeps } = require('./helDeps');
const { execInit, execInitProxy } = require('./init');
const { initMono } = require('./initMono');
const { execCreate, execCreateMod, execCreateStart } = require('./create');
const { execBuild } = require('./build');
const { execLint } = require('./lint');
const { execTsup } = require('./tsup');
const { execTestWatch, execTestOnce } = require('./test');
const { buildSrvModToHelDist } = require('./srvMod');

const innerActionFns = {
  [INNER_ACTION.init]: execInit,
  [INNER_ACTION.initProxy]: execInitProxy,
  [INNER_ACTION.initMono]: initMono,
  [INNER_ACTION.change]: changeMod,
  [INNER_ACTION.create]: execCreate,
  [INNER_ACTION.createShort]: execCreate,
  [INNER_ACTION.createMod]: execCreateMod,
  [INNER_ACTION.createModShort]: execCreateMod,
  [INNER_ACTION.build]: execBuild,
  [INNER_ACTION.del]: delMod,
  [INNER_ACTION.lint]: execLint,
  [INNER_ACTION.createStart]: execCreateStart,
  [INNER_ACTION.createStartShort]: execCreateStart,
  [INNER_ACTION.startHelDeps]: startHelDeps,
  [INNER_ACTION.tsup]: execTsup,
  [INNER_ACTION.test]: execTestOnce,
  [INNER_ACTION.testOnce]: execTestOnce,
  [INNER_ACTION.testWatch]: execTestWatch,
};

/**
 * 尝试执行内部预设的动作函数
 */
function tryExecInnerAction(actionName, devInfo, options) {
  if (INNER_ACTION_NAMES.includes(actionName)) {
    const actionFn = innerActionFns[actionName];
    if (!actionFn) {
      helMonoLog(`currently unsupported inner action ${actionName}`);
    } else {
      helMonoLog(`hit inner action ${actionName}, start to exec preset logic`);
      actionFn(devInfo, options);
    }
    return;
  }

  const these = INNER_ACTION_NAMES.join(' ');
  helMonoErrorLog(`unknown inner action ${actionName}, it must be one of (${these})`);
  process.exit(1);
}

function tryRecordKeywordForLog() {
  const argv = process.argv;
  const last1Str = lastNItem(argv);
  if (trySetLogName(last1Str)) {
    return;
  }
  const last2Str = lastNItem(argv, 2);
  trySetLogName(last2Str);
}

function execCmdByActionName(/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo, options) {
  tryRecordKeywordForLog();
  const { appAction, innerAction } = options;
  const cwd = getCWD();
  let rawKeywordName = getCmdKeywordName();
  if (!rawKeywordName) {
    rawKeywordName = inferDirFromDevInfo(devInfo);
  }

  clearMonoLog();
  clearMonoLog(true, true);
  helMonoLog(`execCmdByActionName ${appAction}: cwd ${cwd}, rawKeywordName ${rawKeywordName}`);

  const innerActionVar = innerAction || rawKeywordName || '';
  // 尝试执行内部预设的动作函数
  if (innerActionVar.startsWith('.')) {
    tryExecInnerAction(innerActionVar, devInfo, options);
    return;
  }

  execAppAction(devInfo, rawKeywordName, appAction);
}

/**
 * 基于 npm start xxx 来启动或构建宿主
 */
exports.executeStart = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo, options) {
  execCmdByActionName(devInfo, { appAction: ACTION_NAME.start, ...(options || {}) });
};

/**
 * 基于 npm build xxx 构建应用
 */
exports.executeBuild = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo) {
  execCmdByActionName(devInfo, { appAction: ACTION_NAME.build });
};

/**
 * 基于 npm start xxx:deps 启动hel子模块依赖
 */
exports.executeStartDeps = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo) {
  execCmdByActionName(devInfo, { innerAction: INNER_ACTION.startHelDeps });
};

exports.buildSrvModToHelDist = buildSrvModToHelDist;
