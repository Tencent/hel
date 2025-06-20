/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const shell = require('shelljs');
const { getCmdKeywordName, getNameData, helMonoLog } = require('../util');
const { getPnpmRunCmd } = require('./cmd');

/**
 * 执行 npm start .tsup xx-lib 命令
 */
exports.execTsup = function (/** @type {IMonoDevInfo} */ devInfo) {
  const keywordName = getCmdKeywordName(3);
  const { pkgName } = getNameData(keywordName, devInfo);
  const tsupCmd = getPnpmRunCmd(pkgName, { scriptCmdKey: 'tsup' });
  helMonoLog(tsupCmd);
  shell.exec(tsupCmd);
};
