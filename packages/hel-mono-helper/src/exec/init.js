/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const { getCmdKeywordName, getNameData, helMonoLog } = require('../util');
const { prepareHelEntrys } = require('./common');

/**
 * 执行 npm start .init xx-hub 命令
 */
exports.execInit = function (/** @type {IMonoDevInfo} */ devInfo) {
  helMonoLog('isForRootHelDir false');
  const mayPkgOrDir = getCmdKeywordName(3);
  const nameData = getNameData(mayPkgOrDir, devInfo);
  prepareHelEntrys(false, devInfo, nameData);
};

/**
 * 执行 npm start .init-proxy xx-hub 命令
 */
exports.execInitProxy = function (/** @type {IMonoDevInfo} */ devInfo) {
  helMonoLog('isForRootHelDir true');
  const mayPkgOrDir = getCmdKeywordName(3);
  const nameData = getNameData(mayPkgOrDir, devInfo);
  prepareHelEntrys(true, devInfo, nameData);
};
