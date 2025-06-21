/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { HEL_MICRO_NAME } = require('../../consts');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

module.exports = function replaceIndexFile(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { isForRootHelDir, helDirPath, realAppPkgName } = appData;
  const indexFilePath = path.join(helDirPath, './index.ts');
  const { helMicroName = HEL_MICRO_NAME } = devInfo;

  helMonoLog(`replace content of ${indexFilePath}`);
  rewriteFileLine(indexFilePath, (line) => {
    let targetLine = line;
    if (line.includes(`from '${HEL_MICRO_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_MICRO_NAME}'`, `from '${helMicroName}'`);
    } else if (line.includes('{{APP_PACK_NAME}}')) {
      const importEntry = isForRootHelDir ? realAppPkgName : '../index';
      targetLine = line.replace('{{APP_PACK_NAME}}', importEntry);
    }
    return { line: targetLine };
  });
};
