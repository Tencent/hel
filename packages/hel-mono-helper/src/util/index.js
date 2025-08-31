const { buildAppAlias, inferConfAlias } = require('./appSrc');
const { getCWD, getCWDPkgDir, getCWDPkgPrefixedDir, getCWDIsForRootHelDir, getFileJson, getDevInfoDirs, ensureSlash } = require('./base');
const { getMonoAppDepData } = require('./depData');
const { inferDevInfo } = require('./devInfo');
const { getCmdKeywordName, getCmdKeywords } = require('./keyword');
const { getMonoNameMap, getBuildDirPath } = require('./monoName');
const { getMonoDirOrFilePath, getMonoSubModSrc, getUnderDirSubPath } = require('./monoPath');
const { getMonoAppPkgJson } = require('./monoPkg');
const { getNameData } = require('./nameData');
const { isHelStart, isHelMicroMode, isHelMode, isHelAllBuild, isHelExternalBuild } = require('./is');
const { clearMonoLog, helMonoLog, helMonoErrorLog, helMonoLogTmp, trySetLogName } = require('./log');
const { getCWDAppData } = require('./opCwd');
const { getMonoRootInfo, setMonoRoot } = require('./rootInfo');
const { getPort } = require('./port');

module.exports = {
  helMonoLog,
  helMonoErrorLog,
  helMonoLogTmp,
  clearMonoLog,
  ensureSlash,
  buildAppAlias,
  inferConfAlias,
  getBuildDirPath,
  getCmdKeywordName,
  getCmdKeywords,
  trySetLogName,
  getCWD,
  getCWDAppData,
  getCWDPkgDir,
  getCWDPkgPrefixedDir,
  getCWDIsForRootHelDir,
  getDevInfoDirs,
  getMonoRootInfo,
  getNameData,
  getMonoDirOrFilePath,
  getMonoSubModSrc,
  getMonoAppPkgJson,
  getUnderDirSubPath,
  getFileJson,
  getPort,
  getMonoNameMap,
  getMonoAppDepData,
  isHelStart,
  isHelMode,
  isHelMicroMode,
  isHelAllBuild,
  isHelExternalBuild,
  setMonoRoot,
  inferDevInfo,
};
