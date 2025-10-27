/** @typedef {import('../../types').IArgvOptions} IArgvOptions*/
/** @typedef {import('../../types').IMonoDevInfo} IDevInfo */
const path = require('path');
const fs = require('fs');
const { clone, safeGet } = require('../../util/dict');
const { toMonoJson } = require('../../util/devInfo');
const { getMonoJsonFilePath, getModMonoDataDict } = require('../../util/monoJson');
const { getPortByDevInfo } = require('../../util/port');

function rewriteMonoJson(/** @type {IDevInfo} */ devInfo) {
  const monoJson = toMonoJson(devInfo);
  const filePath = getMonoJsonFilePath();
  fs.writeFileSync(filePath, JSON.stringify(monoJson, null, 2));
}

function rewriteMonoJsonForArgv(/** @type {IDevInfo} */ devInfo, /** @type {IArgvOptions} */ argvOptions, isSubMod) {
  const { pkgName, alias } = argvOptions;

  const appConf = safeGet(devInfo.appConfs, pkgName);
  appConf.port = getPortByDevInfo(devInfo, isSubMod);
  appConf.alias = alias;
  const monoJson = toMonoJson(devInfo);
  const filePath = getMonoJsonFilePath();
  fs.writeFileSync(filePath, JSON.stringify(monoJson, null, 2));
}

function rewriteMonoJsonForChange(/** @type {IDevInfo} */ devInfo, changeOptions) {
  const { oldPkgName, newPkgName, newAlias } = changeOptions;
  const devInfoCopy = clone(devInfo);
  const { monoDict } = getModMonoDataDict(devInfoCopy);
  const { isSubMod } = monoDict[oldPkgName];

  const { appConfs } = devInfoCopy;
  if (appConfs[oldPkgName]) {
    const conf = appConfs[oldPkgName];
    delete appConfs[oldPkgName];
    appConfs[newPkgName] = conf;
    if (newAlias) {
      conf.alias = newAlias;
    }
  }
  const monoJson = toMonoJson(devInfoCopy, { isSubMod });
  const filePath = getMonoJsonFilePath();

  fs.writeFileSync(filePath, JSON.stringify(monoJson, null, 2));
}

module.exports = {
  rewriteMonoJson,
  rewriteMonoJsonForArgv,
  rewriteMonoJsonForChange,
};
