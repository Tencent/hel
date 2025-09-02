// shelljs 相比 child_process.execSync 具有更好的控制台回显交互
// 故 hel-mono-helper 内部使用 shelljs 替代 child_process.execSync
const cst = require('./consts');
const { MOD_TEMPLATE } = require('./consts');
const { prepareHelEntry } = require('./entry');
const { getMonoDevData, getPkgMonoDepData, getPkgMonoDepDataDict } = require('./dev-data');
const { executeStart, executeBuild, executeStartDeps, buildSrvModToHelDist } = require('./exec');
const util = require('./util');
const { helMonoLogAllTmp } = require('./util/log');
const { lastItem } = require('./util/arr');
const { runAppAction, createApp } = require('./util/cmd');
const { getDirData } = require('./util/cwd');
const { getRawMonoJson } = require('./util/monoJson');
const { getMonoAppPkgJsonByCwd, isEXProject } = require('./util/monoPkg');

/**
 * 约定内部临时打印用 mlog(...)，提交时搜 mlog 删除即可，
 * 注：提供给用户看的日志，需要显式导入 helMonoLog 去打印。
 */
global.mlog = (...args) => util.helMonoLogTmp(...args);
/**
 * 约定临时调试的运行日志打印用 mlog2(...)，提交时搜 mlog2 删除即可，
 * 注：此日志会和运行日志打印到一起。
 */
global.mlog2 = util.helMonoLog;

/**
 * 输出到 .all-tmp.log 中，辅助本地调试
 */
global.mlogt = helMonoLogAllTmp;

const monoUtil = {
  getBuildDir(defaultDir) {
    const info = monoUtil.getCWDInfo();
    const pkgJson = getMonoAppPkgJsonByCwd(info.curCwd) || {};
    const hel = pkgJson.hel || {};
    if (hel.isEX) {
      return cst.HEL_DIST;
    }
    if (util.isHelExternalBuild()) {
      return cst.HEL_DIST_EX;
    }
    if (util.isHelMode()) {
      return cst.HEL_DIST;
    }
    return defaultDir || cst.HEL_DIST;
  },
  getCWDAppData(inputCwd) {
    const devInfo = util.inferDevInfo(true);
    return util.getCWDAppData(devInfo, inputCwd);
  },
  getCWDInfo() {
    const argv = process.argv;
    const curCwd = process.cwd();
    let exCwd = '';
    let forEX = false;
    const lastArg = lastItem(argv);
    // startEXS buildEXS，操作应用对应的静态服务
    if (lastArg.endsWith('EXS.js') || lastArg.endsWith('EXS')) {
      exCwd = `${curCwd}-ex`;
      forEX = true;
    }

    return { curCwd, exCwd, forEX };
  },
  runAppScriptWithCWD(appCwd, scriptKey) {
    const devInfo = util.inferDevInfo(true);

    // 运行 ex 项目但项目不存在，则创建一个
    if (isEXProject(appCwd) && !getMonoAppPkgJsonByCwd(appCwd)) {
      const { belongTo } = getDirData(appCwd);
      createApp(getDirData(appCwd).dirName, MOD_TEMPLATE.exProject, belongTo);
    }

    const { appPkgName } = util.getCWDAppData(devInfo, appCwd);
    runAppAction(appPkgName, scriptKey);
  },
  helMonoLog: util.helMonoLog,
  helMonoLogTmp: util.helMonoLogTmp,
  helMonoErrorLog: util.helMonoErrorLog,
  setMonoRoot: util.setMonoRoot,
  ensureSlash: util.ensureSlash,
  getPort: util.getPort,
  getRawMonoJson: getRawMonoJson,
  isHelStart: util.isHelMode,
  isHelMode: util.isHelMode,
  isHelMicroMode: util.isHelMicroMode,
  isHelAllBuild: util.isHelAllBuild,
  isHelExternalBuild: util.isHelExternalBuild,
  hint: util.hint,
};

module.exports = {
  executeStart,
  executeBuild,
  executeStartDeps,
  prepareHelEntry,
  getMonoDevData,
  getPkgMonoDepData,
  getPkgMonoDepDataDict,
  buildSrvModToHelDist,
  monoUtil,
  cst,
};
