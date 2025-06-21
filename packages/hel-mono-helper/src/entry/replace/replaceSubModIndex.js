/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { HEL_LIB_PROXY_NAME, HEL_MICRO_NAME } = require('../../consts');

module.exports = function replaceSubModIndex(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { helDirPath } = appData;
  const filePath = path.join(helDirPath, './index.ts');
  const { helMicroName = HEL_MICRO_NAME, helLibProxyName = HEL_LIB_PROXY_NAME } = devInfo;

  if (helMicroName === HEL_MICRO_NAME && helLibProxyName === HEL_LIB_PROXY_NAME) {
    return;
  }

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes(`from '${HEL_MICRO_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_MICRO_NAME}'`, `from '${helMicroName}'`);
    } else if (line.includes(`from '${HEL_LIB_PROXY_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_LIB_PROXY_NAME}'`, `from '${helLibProxyName}'`);
    }
    return { line: targetLine };
  });
};
