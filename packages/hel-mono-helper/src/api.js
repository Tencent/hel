// shelljs 相比 child_process.execSync 具有更好的控制台回显交互
// 故 hel-mono-helper 内部使用 shelljs 替代 child_process.execSync
const cst = require('./consts');
const { prepareHelEntry } = require('./entry');
const { getMonoDevData, getPkgMonoDepData, getMonoDepDict } = require('./dev-data');
const { executeStart, executeBuild, executeStartDeps, buildSrvModToHelDist } = require('./exec');
const util = require('./util');

/**
 * 约定内部临时打印用 mlog(...)，提交时搜 mlog 删除即可，
 * 提供给用户看的日志，需要显式导入 helMonoLog 去打印。
 */
global.mlog = (...args) => util.helMonoLogTmp(...args);
/**
 * 约定临时调试的运行日志打印用 mlog2(...)，提交时搜 mlog2 删除即可，
 * 注：此日志会和运行日志打印到一起。
 */
global.mlog2 = util.helMonoLog;

const monoUtil = {
  getBuildDirPath(pkgName, buildDirName) {
    const devInfo = util.inferDevInfo(true);
    return util.getBuildDirPath(devInfo, pkgName, buildDirName);
  },
  helMonoLog: util.helMonoLog,
  helMonoLogTmp: util.helMonoLogTmp,
  helMonoErrorLog: util.helMonoErrorLog,
  setMonoRoot: util.setMonoRoot,
  ensureSlash: util.ensureSlash,
  getPort: util.getPort,
  isHelStart: util.isHelMode,
  isHelMode: util.isHelMode,
  isHelMicroMode: util.isHelMicroMode,
  isHelAllBuild: util.isHelAllBuild,
};

module.exports = {
  executeStart,
  executeBuild,
  executeStartDeps,
  prepareHelEntry,
  getMonoDevData,
  getPkgMonoDepData,
  getMonoDepDict,
  buildSrvModToHelDist,
  monoUtil,
  cst,
};
