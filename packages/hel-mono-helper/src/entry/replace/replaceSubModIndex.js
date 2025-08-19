/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { HEL_LIB_PROXY_NAME } = require('../../consts');

module.exports = function replaceSubModIndex(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { helDirPath } = appData;
  const filePath = path.join(helDirPath, './index.ts');
  // replace helLibNames
  const { helLibProxyName = HEL_LIB_PROXY_NAME } = devInfo;

  if (helLibProxyName === HEL_LIB_PROXY_NAME) {
    return;
  }

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes(`from '${HEL_LIB_PROXY_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_LIB_PROXY_NAME}'`, `from '${helLibProxyName}'`);
    }
    return { line: targetLine };
  });
};
