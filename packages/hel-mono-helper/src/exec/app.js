/** @typedef {import('../types').ICWDAppData} ICWDAppData*/
/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const { getNameData, getCWDAppData } = require('../util');
const { inferDirData, getCwdByPrefixedDir } = require('../util/cwd');
const { buildExAppData } = require('../util/ex');
const { ensureExAppProject } = require('../entry/prepare/share');
const { extractCmdData } = require('./common');
const { genPnpmCmdAndRun } = require('./cmd');

/**
 * 执行应用启动的动作函数
 */
exports.execAppAction = function (/** @type {IDevInfo} */ devInfo, rawKeywordName, startOrBuild) {
  const { keywordName, scriptCmdKey, forEX } = extractCmdData(devInfo, rawKeywordName, startOrBuild);

  if (forEX) {
    // 根目录执行 pnpm start <dir-name>:helex 时
    const { prefixedDir } = inferDirData(devInfo);
    const masterAppCwd = getCwdByPrefixedDir(prefixedDir);
    const masterAppData = getCWDAppData(devInfo, masterAppCwd);

    /** @type ICWDAppData */
    let exAppData;
    const exAppDataCwd = `${masterAppCwd}-ex`;
    if (!fs.existsSync(exAppDataCwd)) {
      exAppData = buildExAppData(masterAppData);
    } else {
      exAppData = getCWDAppData(devInfo, exAppDataCwd);
    }

    ensureExAppProject(devInfo, { masterAppData, exAppData });
    const { appPkgName, appDir, belongTo, isSubMod } = exAppData;
    genPnpmCmdAndRun(appPkgName, { belongTo, dirName: appDir, isSubMod, scriptCmdKey: 'start:hel' });
    return;
  }

  const { pkgName, dirName, belongTo, isSubMod } = getNameData(keywordName, devInfo);
  genPnpmCmdAndRun(pkgName, { belongTo, dirName, isSubMod, scriptCmdKey });
};
