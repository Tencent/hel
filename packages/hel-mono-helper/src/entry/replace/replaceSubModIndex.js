/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const fs = require('fs');
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { HEL_LIB_PROXY_NAME } = require('../../consts');

function hasFile(appSrcDirPath, relPath) {
  const filePath = path.join(appSrcDirPath, relPath);
  return fs.existsSync(filePath);
}

module.exports = function replaceSubModIndex(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { helDirPath, appSrcDirPath } = appData;
  const filePath = path.join(helDirPath, './index.ts');
  // replace helLibNames
  const { helLibProxyName = HEL_LIB_PROXY_NAME } = devInfo;
  const hasHelHook = hasFile(appSrcDirPath, 'hel-conf/hook');

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes(`from '${HEL_LIB_PROXY_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_LIB_PROXY_NAME}'`, `from '${helLibProxyName}'`);
    } else if (line.includes('../hel-conf/hook')) {
      targetLine = !hasHelHook ? `  const helHook: any = {}; // found no hel hook` : line;
    } else if (line.includes('const needRunHook =')) {
      targetLine = !hasHelHook ? 'const needRunHook = false;' : line;
    }
    return { line: targetLine };
  });
};
