/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const shell = require('shelljs');
const { helMonoLog, getNameData, getCWDAppData } = require('../util');
const { inferDirData, getCwdByPrefixedDir } = require('../util/cwd');
const { buildExAppData } = require('../util/ex');
const { ensureExAppProject } = require('../entry/prepare/share');
const { extractCmdData } = require('./common');
const { getPnpmRunCmd } = require('./cmd');

/**
 * 执行应用启动的动作函数
 */
exports.execAppAction = function (/** @type {IMonoDevInfo} */ devInfo, rawKeywordName, startOrBuild) {
  const { keywordName, scriptCmdKey, forEX } = extractCmdData(devInfo, rawKeywordName, startOrBuild);

  if (forEX) {
    // 根目录执行 pnpm start <dir-name>:helex 时
    const { prefixedDir } = inferDirData(devInfo);
    const masterAppCwd = getCwdByPrefixedDir(prefixedDir);
    const masterAppData = getCWDAppData(devInfo, masterAppCwd);

    let exAppData;
    const exAppDataCwd = `${masterAppCwd}-ex`;
    if (!fs.existsSync(exAppDataCwd)) {
      exAppData = buildExAppData(masterAppData);
    } else {
      exAppData = getCWDAppData(devInfo, exAppDataCwd);
    }

    ensureExAppProject(devInfo, { masterAppData, exAppData });
    const { appPkgName, appDir, isSubMod } = exAppData;
    const exProjRunCmd = getPnpmRunCmd(appPkgName, { dirName: appDir, scriptCmdKey: 'start:hel', isSubMod });

    shell.exec(exProjRunCmd);
    return;
  }

  const { pkgName, dirName, isSubMod } = getNameData(keywordName, devInfo);
  const exeCmd = getPnpmRunCmd(pkgName, { dirName, scriptCmdKey, isSubMod });
  helMonoLog('shell cmd:', exeCmd);
  shell.exec(exeCmd);
};
