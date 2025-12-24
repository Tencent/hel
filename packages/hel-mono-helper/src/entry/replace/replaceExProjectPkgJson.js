/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { helMonoLog } = require('../../util');
const { safeGet } = require('../../util/dict');

function installDeps(/** @type {ICWDAppData} */ appData) {
  shell.exec(`cd ${appData.appDirPath}`);
  helMonoLog(`install node modules for ${appData.appDirPath}`);
  shell.exec('pnpm i');
}

function writeAndInstall(pkgJson, deps, pkgFilePath, /** @type {ICWDAppData} */ appData) {
  pkgJson.dependencies = deps;
  const str = JSON.stringify(pkgJson, null, 2);
  fs.writeFileSync(pkgFilePath, str);
  installDeps(appData);
}

module.exports = function replaceExProjectPkgJson(/** @type {ICWDAppData} */ appData, newDeps) {
  const pkgFilePath = path.join(appData.appDirPath, 'package.json');
  const pkgJson = require(pkgFilePath);
  const oldDeps = safeGet(pkgJson, 'dependencies');
  pkgJson.name = appData.appPkgName;
  const helConf = safeGet(pkgJson, 'hel');

  const oldPkgNames = Object.keys(oldDeps).sort();
  const newPkgNames = Object.keys(newDeps).sort();

  if (helConf.isEX !== true) {
    helConf.isEX = true;
    writeAndInstall(pkgJson, newDeps, pkgFilePath, appData);
    return true;
  }

  if (oldPkgNames.length !== newPkgNames) {
    writeAndInstall(pkgJson, newDeps, pkgFilePath, appData);
    return true;
  }
  if (newPkgNames.some((v) => !oldPkgNames.includes(v))) {
    writeAndInstall(pkgJson, newDeps, pkgFilePath, appData);
    return true;
  }
  if (newPkgNames.some((v) => oldDeps[v] !== newDeps[v])) {
    writeAndInstall(pkgJson, newDeps, pkgFilePath, appData);
    return true;
  }

  return false;
};
