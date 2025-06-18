const r = require('../replace');
const prepareTplFiles = require('./prepareTplFiles');
const prepareNodeModules = require('./prepareNodeModules');

module.exports = function prepareHelSubModEntry(appData, devInfo, depData) {
  prepareTplFiles(appData);
  r.replacePkgJson(appData, depData);
  r.replaceSubModModulesIndex(appData);
  r.replaceSubModLibTypes(appData);
  r.replaceDevInfo(appData, devInfo);
  r.replaceSubApp(appData);
  prepareNodeModules(appData);
};
