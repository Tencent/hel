const { getCWDAppData, helMonoLog } = require('../../util');
const prepareHelAppEntry = require('./prepareHelAppEntry');
const prepareHelSubModEntry = require('./prepareHelSubModEntry');

module.exports = function prepareHelEntry(
  /** @type {import('hel-mono-types').IMonoDevInfo} */devInfo,
  /** @type {import('../../types').IMonoAppDepData} */depData,
  /** @type {import('../../types').ICWDAppData} */inputAppData,
) {
  const appData = inputAppData || getCWDAppData(devInfo);
  helMonoLog(`prepare hel entry for ${appData.appDir}(${appData.appPkgName}):`, appData);

  if (appData.isSubMod) {
    prepareHelSubModEntry(appData, devInfo, depData);
    return;
  }

  prepareHelAppEntry(appData, devInfo, depData);
};
