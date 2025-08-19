/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { HEL_MICRO_NAME } = require('../../consts');

module.exports = function replaceUtil(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { isSubMod, helDirPath } = appData;
  const utilFilePath = isSubMod ? path.join(helDirPath, './configs/util.ts') : path.join(helDirPath, './util.ts');
  helMonoLog(`replace content of ${utilFilePath}`);
  // replace helLibNames
  const { helMicroName = HEL_MICRO_NAME } = devInfo;
  helMonoLog('devInfo.helMicroName', helMicroName);

  if (helMicroName === HEL_MICRO_NAME) {
    return;
  }

  helMonoLog(`replace content of ${utilFilePath}`);
  rewriteFileLine(utilFilePath, (line) => {
    let targetLine = line;
    if (line.includes(`from '${HEL_MICRO_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_MICRO_NAME}'`, `from '${helMicroName}'`);
      helMonoLog('targetLine', targetLine);
    }
    return { line: targetLine };
  });
};
