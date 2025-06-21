const { cst } = require('hel-dev-utils');
const { prepareHelEntry } = require('./entry');
const { getMonoDevData } = require('./dev-data');
const { executeStart, buildSrvModToHelDist } = require('./exec');
const util = require('./util');

/**
 * 约定内部临时打印用 mlog(...)，提交时搜 mlog 删除即可，
 * 提供给用户看的日志，需要显式导入 helMonoLog 去打印。
 */
global.mlog = (...args) => util.helMonoLogTmp(...args);
/**
 * 约定内部临时打印用 mlog2(...)，提交时搜 mlog2 删除即可，
 * 此日志会和运行日志打印到一起。
 */
global.mlog2 = util.helMonoLog;

module.exports = {
  executeStart,
  prepareHelEntry,
  getMonoDevData,
  buildSrvModToHelDist,
  monoUtil: util,
  HEL_DIST: cst.HEL_DIST_DIR,
};
