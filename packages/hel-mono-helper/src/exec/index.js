/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const path = require('path');
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

function tryRecordKeywordForLog(/** @type {IDevInfo} */ devInfo) {
  const argv = process.argv;
  const last1Str = lastNItem(argv);

  const th3Item = argv[2] || '';
  // 是 ['/xx/bin/node', '/xx/root-scripts/executeStart', '<dirOrPkg>:for', '...']
  const [pureLocation = ''] = th3Item.split(':');
  if (pureLocation) {
    const { monoDict } = devInfo;
    // 暂定统一用二级目录名作为日志名称
    // TODO：后续统一用包名？普通的 yyy 转为 yyy.log 带 scope 的 @xxx/yyy 转为 @xxx+yyy.log
    let dirName = pureLocation;
    if (monoDict[pureLocation]) {
      dirName = monoDict[pureLocation].dirName;
    }

    if (trySetLogName(dirName)) {
      return true;
    }
  }

  if (trySetLogName(last1Str)) {
    return true;
  }
  const last2Str = lastNItem(argv, 2);
  return trySetLogName(last2Str);
}

function getRawKeywordName(/** @type {IDevInfo} */ devInfo) {
  const isSuccess = tryRecordKeywordForLog(devInfo);
  const cwd = getCWD();
  let rawKeywordName = getCmdKeywordName();
  if (!rawKeywordName) {
    const last1Str = lastNItem(cwd.split(path.sep));
    if (devInfo.dirDict[last1Str]) {
      rawKeywordName = last1Str;
    } else {
      rawKeywordName = inferDirFromDevInfo(devInfo);
    }
  }
  if (!isSuccess) {
    trySetLogName(rawKeywordName);
  }

  return rawKeywordName;
}

function execCmdByActionName(/** @type {IDevInfo} */ devInfo, options) {
  const { appAction, innerAction } = options;
  const rawKeywordName = getRawKeywordName(devInfo);
  clearMonoLog();
  clearMonoLog(true, true);
  helMonoLog(`execCmdByActionName ${appAction}: cwd ${getCWD()}, rawKeywordName ${rawKeywordName}`);

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
exports.executeStart = function (/** @type {IDevInfo} */ devInfo, options) {
  execCmdByActionName(devInfo, { appAction: ACTION_NAME.start, ...(options || {}) });
};

/**
 * 基于 npm build xxx 构建应用
 */
exports.executeBuild = function (/** @type {IDevInfo} */ devInfo) {
  execCmdByActionName(devInfo, { appAction: ACTION_NAME.build });
};

/**
 * 基于 npm start xxx:deps 启动hel子模块依赖
 */
exports.executeStartDeps = function (/** @type {IDevInfo} */ devInfo) {
  execCmdByActionName(devInfo, { innerAction: INNER_ACTION.startHelDeps });
};

exports.buildSrvModToHelDist = buildSrvModToHelDist;
