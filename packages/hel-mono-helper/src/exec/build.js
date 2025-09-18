/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const { getCmdKeywordName, helMonoLog, getNameData } = require('../util');
const { ACTION_NAME } = require('../consts');
const { genPnpmCmdAndRun } = require('./cmd');

/**
 * 执行 pnpm start .build xxx, pnpm start .build xxx:yyy 时触发
 */
exports.execBuild = function (/** @type {IDevInfo} */ devInfo) {
  let scriptCmdKey = ACTION_NAME.build;
  let keywordName = getCmdKeywordName(3);

  let mayPkgOrDir = keywordName;
  if (keywordName.includes(':')) {
    // 执行的是 pnpm start .build xxx:hel
    const strList = keywordName.split(':');
    mayPkgOrDir = strList[0];
    scriptCmdKey = `${ACTION_NAME.build}:${strList.slice(1).join(':')}`;
  }

  const { pkgName, belongTo, dirName, isSubMod } = getNameData(mayPkgOrDir, devInfo);
  genPnpmCmdAndRun(pkgName, { belongTo, dirName, isSubMod, scriptCmdKey });
};
