/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { HEL_LIB_PROXY_NAME } = require('../../consts');
const { genExportModuleNames, getModEntryFilePath } = require('./util');

module.exports = function replaceSubModLibTypes(/** @type {ICWDAppData} */ appData, /** @type {IDevInfo} */ devInfo) {
  const { helDirPath, realAppSrcDirPath } = appData;
  const filePath = path.join(helDirPath, './entrance/libTypes.ts');
  const { helLibProxyName = HEL_LIB_PROXY_NAME } = devInfo;
  let oriModFilePath = getModEntryFilePath(realAppSrcDirPath);

  if (fs.existsSync(path.join(realAppSrcDirPath, './export.ts'))) {
    oriModFilePath = getModEntryFilePath(realAppSrcDirPath, 'export');
  }

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes('{{EXPORT_MODULES}}')) {
      const modNames = genExportModuleNames(oriModFilePath);
      targetLine = modNames.map((name) => `  ${name},`);
    } else if (line.includes(`from '${HEL_LIB_PROXY_NAME}'`)) {
      targetLine = line.replace(`from '${HEL_LIB_PROXY_NAME}'`, `from '${helLibProxyName}'`);
    }

    return { line: targetLine };
  });
};
