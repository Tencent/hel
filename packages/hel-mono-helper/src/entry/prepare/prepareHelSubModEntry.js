const r = require('../replace');
const prepareTplFiles = require('./prepareTplFiles');
const prepareNodeModules = require('./prepareNodeModules');

module.exports = function prepareHelSubModEntry(appData, devInfo, depData) {
  prepareTplFiles(appData);
  r.replacePkgJson(appData, depData);
  r.replaceSubModIndex(appData, devInfo);
  r.replaceSubModModulesIndex(appData);
  r.replaceSubModLibTypes(appData, devInfo);
  const injectedDevInfo = r.replaceDevInfo(appData, devInfo);
  r.replaceSubApp(appData);
  r.replaceUtil(appData, devInfo);
  prepareNodeModules(appData);

  return injectedDevInfo;
};
