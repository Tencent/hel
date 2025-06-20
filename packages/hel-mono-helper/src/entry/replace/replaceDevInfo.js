const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog, getPkgjson } = require('../../util');
const { HOST_NAME } = require('../../consts');
const { jsonObj2Lines } = require('./util');

function getInjectedDevInfo(deps, /** @type {import('../../types').ICWDAppData} */ appData, devInfo) {
  const { realAppPkgName } = appData;
  const { appConfs, devHostname } = devInfo;
  const injectedDevInfo = {
    appConfs: {},
    devHostname: devHostname || HOST_NAME,
  };
  const assignConf = (name) => {
    const conf = appConfs[name];
    if (!conf) {
      return;
    }
    const { alias, ...rest } = conf;
    injectedDevInfo.appConfs[name] = rest;
  };

  assignConf(realAppPkgName);
  Object.keys(deps).forEach((name) => assignConf(name));

  return injectedDevInfo;
}

module.exports = function replaceDevInfo(/** @type {import('../../types').ICWDAppData} */ appData, devInfo) {
  const { helDirPath, isSubMod, realAppPkgJsonPath } = appData;
  const devInfoFile = isSubMod ? path.join(helDirPath, './configs/devInfo.ts') : path.join(helDirPath, './devInfo.ts');
  helMonoLog(`replace content of file(${devInfoFile})`);

  const realAppPackjson = getPkgjson(realAppPkgJsonPath);
  const deps = realAppPackjson.dependencies || {};

  rewriteFileLine(devInfoFile, (line) => {
    let targetLine = line;
    if (line.includes('{{TO_BE_REPLACED}}')) {
      const injectedDevInfo = getInjectedDevInfo(deps, appData, devInfo);
      targetLine = jsonObj2Lines(injectedDevInfo);
    }
    return { line: targetLine };
  });
};
