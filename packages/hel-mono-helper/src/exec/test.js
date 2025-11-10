/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const shell = require('shelljs');
const { getCmdKeywordName, getNameData, helMonoLog } = require('../util');
const { getTestCmd } = require('./cmd');

/**
 * 执行 npm start .test xx-hub 命令
 */
exports.execTest = function (/** @type {IDevInfo} */ devInfo) {
  const keywordName = getCmdKeywordName(3);
  const { pkgName } = getNameData(keywordName, devInfo);
  const testScriptKey = devInfo.defaultTest || 'test';
  const lintCmd = getTestCmd(pkgName, testScriptKey);
  helMonoLog(lintCmd);
  shell.exec(lintCmd);
};
