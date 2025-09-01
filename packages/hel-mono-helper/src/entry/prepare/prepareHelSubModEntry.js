/** @typedef {import('../../types').IPrepareHelEntryFilesOptions} Options */
const { isHelExternalBuild } = require('../../util');
const r = require('../replace');
const prepareTplFiles = require('./prepareTplFiles');
const prepareNodeModules = require('./prepareNodeModules');
const { ensureExAppProject } = require('./share');

function prepareFiles(devInfo, depData, appData) {
  prepareTplFiles(appData);
  if (isHelExternalBuild()) {
    return r.replaceIndexEXFile(appData, devInfo);
  }

  r.replacePkgJson(appData, depData);
  r.replaceSubModIndex(appData, devInfo);
  r.replaceSubModModulesIndex(appData);
  r.replaceSubModLibTypes(appData, devInfo);
  const injectedDevInfo = r.replaceDevInfo(appData, devInfo);
  r.replaceSubApp(appData);
  r.replaceDeployEnv(appData, devInfo);
  r.replaceUtil(appData, devInfo);
  prepareNodeModules(appData);

  return injectedDevInfo;
}

module.exports = function prepareHelSubModEntry(/** @type {Options} */options) {
  const { appData, devInfo, depData, forEx } = options;

  if (forEx) {
    return ensureExAppProject(devInfo, appData);
  }

  return prepareFiles(devInfo, depData, appData)
};
