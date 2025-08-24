/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const shell = require('shelljs');
const { getCmdKeywordName, helMonoLog, getNameData } = require('../util');
const { inferDirFromArgv2ndItem } = require('../util/mono-dir');
const { extractCmdData } = require('./common');
const { getPnpmRunCmd } = require('./cmd');

/**
 * 是否工作在 <hel-mono-proj>/.hel 根目录下
 */
function getIsForRootHelDir(devInfo) {
  const dirKeyword2nd = inferDirFromArgv2ndItem(devInfo);
  const dirKeyword3rd = getCmdKeywordName(3);
  const isForRootHelDir = dirKeyword2nd.endsWith(':proxy') || dirKeyword3rd.endsWith(':proxy');
  return isForRootHelDir;
}

/**
 * 执行应用启动的动作函数
 */
exports.execAppAction = function (/** @type {IMonoDevInfo} */ devInfo, rawKeywordName, startOrBuild) {
  const { keywordName, scriptCmdKey } = extractCmdData(devInfo, rawKeywordName, startOrBuild);
  const { pkgName, dirName, isSubMod } = getNameData(keywordName, devInfo);
  const isForRootHelDir = getIsForRootHelDir(devInfo);
  helMonoLog(`isForRootHelDir ${isForRootHelDir}`);

  const exeCmd = getPnpmRunCmd(pkgName, { isForRootHelDir, dirName, scriptCmdKey, isSubMod });
  helMonoLog(exeCmd);
  shell.exec(exeCmd);
};
