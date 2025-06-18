const fs = require('fs');
const path = require('path');
const { HEL_TPL_INNER_APP_PATH } = require('../../consts');
const { helMonoLog } = require('../../util');
const r = require('../replace');
const prepareTplFiles = require('./prepareTplFiles');
const prepareNodeModules = require('./prepareNodeModules');

module.exports = function prepareHelAppEntry(
  /** @type {import('../../types').ICWDAppData} */appData,
  devInfo,
  depData,
) {
  const { isForRootHelDir, helDirPath } = appData;

  if (isForRootHelDir) {
    if (!depData) {
      return;
    }

    prepareTplFiles(appData, true);
    r.replacePkgJson(appData, depData);
    r.replaceIndexFile(appData);
    r.replaceDevInfo(appData, devInfo);
    r.replaceSubApp(appData);
    prepareNodeModules(appData);
    return;
  }

  if (!fs.existsSync(helDirPath)) {
    helMonoLog('make .hel dir!');
    fs.mkdirSync(helDirPath);
  }

  helMonoLog(`copy hel template files to ${helDirPath}`);
  // 只需复制 src 目录下的文件即可
  const fromPath = path.join(HEL_TPL_INNER_APP_PATH, './src');
  fs.cpSync(fromPath, helDirPath, { recursive: true });

  r.replaceIndexFile(appData);
  r.replaceDevInfo(appData, devInfo);
  r.replaceSubApp(appData);
};
