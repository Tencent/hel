/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoInjectedDevInfo} IMonoInjectedDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { helMonoLog, getFileJson } = require('../../util');
const { ensureAppConf } = require('../../util/devInfo');
const { getMonoAppDepDataImpl } = require('../../util/depData');
const { purifyUndefined } = require('../../util/dict');
const { isHelAllBuild } = require('../../util/is');
const { getModMonoDataDict } = require('../../util/monoJson');
const { rewriteFileLine } = require('../../util/rewrite');
const { HOST_NAME } = require('../../consts');
const { jsonObj2Lines } = require('./util');

function getInjectedDevInfo(deps, /** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { realAppPkgName, isSubMod, appSrcDirPath: appSrc, isForRootHelDir, appPkgName } = appData;
  helMonoLog(`trigger getInjectedDevInfo for ${appPkgName}`);
  const start = Date.now();
  const { appConfs, devHostname } = devInfo;
  const injectedDevInfo = {
    mods: {},
    devHostname: devHostname || HOST_NAME,
  };

  const assignMod = (pkgName, isSubMod) => {
    if (injectedDevInfo.mods[pkgName]) {
      return;
    }
    const conf = appConfs[pkgName];
    if (!conf) {
      return;
    }
    const ensuredConf = ensureAppConf({ devInfo, conf, pkgName, isSubMod });
    const { port, hel } = ensuredConf;
    injectedDevInfo.mods[pkgName] = purifyUndefined({
      port,
      groupName: hel.appGroupName,
      names: hel.appNames,
      platform: hel.platform,
    });
  };

  assignMod(realAppPkgName, isSubMod);

  if (!isHelAllBuild()) {
    const { monoDict } = getModMonoDataDict(devInfo);
    Object.keys(deps).forEach((name) => {
      const { isSubMod = false } = monoDict[name] || {};
      assignMod(name, isSubMod);
    });
  }

  const { nmHelPkgNames, nmPkg2HelConf } = getMonoAppDepDataImpl({ appSrc, devInfo, isAllDep: true, isForRootHelDir });
  nmHelPkgNames.forEach((nmPkgName) => {
    const { groupName = nmPkgName, platform } = nmPkg2HelConf[nmPkgName] || {};
    injectedDevInfo.mods[nmPkgName] = purifyUndefined({
      groupName: groupName,
      platform,
      isNm: true,
    });
  });

  helMonoLog(`getInjectedDevInfo for ${appPkgName} costs ${Date.now() - start}ms`);
  return injectedDevInfo;
}

/**
 * @returns {IMonoInjectedDevInfo}
 * 替换胶水代码里的 devInfo 文件
 */
module.exports = function replaceDevInfo(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { helDirPath, isSubMod, realAppPkgJsonPath } = appData;
  const devInfoFile = isSubMod ? path.join(helDirPath, './configs/devInfo.ts') : path.join(helDirPath, './devInfo.ts');
  helMonoLog(`replace content of ${devInfoFile}`);

  const realAppPkgJson = getFileJson(realAppPkgJsonPath);
  const deps = realAppPkgJson.dependencies || {};
  const injectedDevInfo = getInjectedDevInfo(deps, appData, devInfo);

  rewriteFileLine(devInfoFile, (line) => {
    let targetLine = line;
    if (line.includes('{{TO_BE_REPLACED}}')) {
      targetLine = jsonObj2Lines(injectedDevInfo);
    }
    return { line: targetLine };
  });

  return injectedDevInfo;
};
