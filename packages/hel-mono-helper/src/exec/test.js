/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const shell = require('shelljs');
const { getCmdKeywordName, getNameData, helMonoLog } = require('../util');
const { getTestCmd } = require('./cmd');

/**
 * 执行 npm start .test xx-hub 命令
 */
exports.execTestWatch = function (/** @type {IDevInfo} */ devInfo) {
  const keywordName = getCmdKeywordName(3);
  const { pkgName } = getNameData(keywordName, devInfo);
  const lintCmd = getTestCmd(pkgName);
  helMonoLog(lintCmd);
  shell.exec(lintCmd);
};

exports.execTestOnce = function (/** @type {IDevInfo} */ devInfo) {
  const keywordName = getCmdKeywordName(3);
  const { pkgName } = getNameData(keywordName, devInfo);
  const lintCmd = getTestCmd(pkgName, 'test:once');
  helMonoLog(lintCmd);
  shell.exec(lintCmd);
};
