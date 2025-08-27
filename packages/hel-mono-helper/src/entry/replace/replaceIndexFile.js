/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const path = require('path');
const fs = require('fs');
const { HEL_MICRO_NAME, HEL_LIB_PROXY_NAME } = require('../../consts');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

function hasFile(appSrcDirPath, relPath) {
  const filePath = path.join(appSrcDirPath, relPath);
  return fs.existsSync(filePath);
}

module.exports = function replaceIndexFile(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { appSrcDirPath, isForRootHelDir, helDirPath, realAppPkgName } = appData;
  const indexFilePath = path.join(helDirPath, './index.ts');
  const { helMicroName = HEL_MICRO_NAME, helLibProxyName = HEL_LIB_PROXY_NAME } = devInfo;

  helMonoLog(`replace content of ${indexFilePath}`);
  const hasRootComp =
    hasFile(appSrcDirPath, 'App.tsx')
    || hasFile(appSrcDirPath, 'App.jsx')
    || hasFile(appSrcDirPath, 'App.js')
    || hasFile(appSrcDirPath, 'App');
  const hasShareModules = hasFile(appSrcDirPath, 'share-modules');

  rewriteFileLine(indexFilePath, (line) => {
    let targetLine = line;
    if (line.includes(`from '${HEL_MICRO_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_MICRO_NAME}'`, `from '${helMicroName}'`);
    } else if (line.includes(`from '${HEL_LIB_PROXY_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_LIB_PROXY_NAME}'`, `from '${helLibProxyName}'`);
    } else if (line.includes('{{APP_PACK_NAME}}')) {
      const importEntry = isForRootHelDir ? realAppPkgName : '../index';
      targetLine = line.replace('{{APP_PACK_NAME}}', importEntry);
    } else if (line.includes('../App')) {
      targetLine = !hasRootComp ? `  const RootComp: any = null; // found no root comp` : line;
    } else if (line.includes('../share-modules')) {
      targetLine = !hasShareModules ? `  const shareModules: any = null; // found no share modules` : line;
    }

    return { line: targetLine };
  });
};
