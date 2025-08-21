const { getCWDAppData, helMonoLog } = require('../../util');
const prepareHelAppEntry = require('./prepareHelAppEntry');
const prepareHelSubModEntry = require('./prepareHelSubModEntry');

exports.prepareHelEntryFiles = function (
  /** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo,
  /** @type {import('../../types').IMonoAppDepData} */ depData,
  /** @type {import('../../types').ICWDAppData} */ inputAppData,
) {
  const appData = inputAppData || getCWDAppData(devInfo);
  const { belongTo, appDir, appPkgName, realAppPkgName, isForRootHelDir } = appData;
  helMonoLog(`prepare hel entry for ${belongTo}/${appDir} (${appPkgName}):`, appData);
  if (isForRootHelDir) {
    helMonoLog(`the entry file is under root hel dir, it will link the target package ${realAppPkgName}`);
  }

  if (!devInfo.appConfs[realAppPkgName]) {
    throw new Error(`package ${realAppPkgName} is not declared in dev-info, please check!`);
  }

  if (appData.isSubMod) {
    return prepareHelSubModEntry(appData, devInfo, depData);
  }

  return prepareHelAppEntry(appData, devInfo, depData);
};
