/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoInjectedDevInfo} IMonoInjectedDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog, getFileJson } = require('../../util');
const { ensureAppConf } = require('../../util/devInfo');
const { HOST_NAME } = require('../../consts');
const { jsonObj2Lines } = require('./util');

function getInjectedDevInfo(deps, /** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { realAppPkgName } = appData;
  const { appConfs, devHostname } = devInfo;
  const injectedDevInfo = {
    appConfs: {},
    devHostname: devHostname || HOST_NAME,
  };
  const assignConf = (name) => {
    if (injectedDevInfo.appConfs[name]) {
      return;
    }
    const conf = appConfs[name];
    if (!conf) {
      return;
    }
    injectedDevInfo.appConfs[name] = ensureAppConf(devInfo, conf, name);
  };

  assignConf(realAppPkgName);
  Object.keys(deps).forEach((name) => assignConf(name));

  return injectedDevInfo;
}

/**
 * @returns {IMonoInjectedDevInfo}
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
