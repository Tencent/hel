/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const { getCmdKeywordName, getNameData } = require('../util');
const { prepareHelEntryForMainAndDeps } = require('../entry');

/**
 * 执行 npm start .deps xx-hub 命令
 */
exports.startHelDeps = function (/** @type {IMonoDevInfo} */ devInfo) {
  const mayPkgOrDir = getCmdKeywordName(3);
  const nameData = getNameData(mayPkgOrDir, devInfo);
  prepareHelEntryForMainAndDeps({ isForRootHelDir: false, devInfo, nameData, startDeps: true });
};
