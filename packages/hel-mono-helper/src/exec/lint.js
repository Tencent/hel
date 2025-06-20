/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const shell = require('shelljs');
const { getCmdKeywordName, getNameData, helMonoLog } = require('../util');
const { getLintCmd } = require('./cmd');

/**
 * 执行 npm start .init xx-hub 命令
 */
exports.execLint = function (/** @type {IMonoDevInfo} */ devInfo) {
  const keywordName = getCmdKeywordName(3);
  const { dirName } = getNameData(keywordName, devInfo);
  const lintCmd = getLintCmd(dirName);
  helMonoLog(lintCmd);
  shell.exec(lintCmd);
};
