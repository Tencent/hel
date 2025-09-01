/** @typedef {import('../../types').IPrepareHelEntryFilesOptions} Options */
const { getCWDAppData, helMonoLog } = require('../../util');
const prepareHelAppEntry = require('./prepareHelAppEntry');
const prepareHelSubModEntry = require('./prepareHelSubModEntry');

function prepareHelEntryFiles(/** @type {Options} */ options) {
  const { devInfo } = options;
  const appData = options.appData || getCWDAppData(devInfo);
  const { belongTo, appDir, appPkgName, realAppPkgName, isForRootHelDir } = appData;
  helMonoLog(`prepare hel entry for ${belongTo}/${appDir} (${appPkgName}):`, appData);
  if (isForRootHelDir) {
    helMonoLog(`the entry file is under root hel dir, it will link the target package ${realAppPkgName}`);
  }

  if (!devInfo.appConfs[realAppPkgName]) {
    throw new Error(`package ${realAppPkgName} is not declared in hel-mono.json, please check!`);
  }

  if (appData.isSubMod) {
    return prepareHelSubModEntry(options);
  }

  return prepareHelAppEntry(options);
}

module.exports = {
  prepareHelEntryFiles,
  prepareHelAppEntry,
  prepareHelSubModEntry,
};
