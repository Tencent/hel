/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog, isFastRefreshMarked } = require('../../util');
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

  const isFRMarked = isFastRefreshMarked();

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;

    if (isFRMarked) {
      if (line.includes('../configs/subApp') || line.includes('exposeLib')) {
        targetLine = `// ${line}`;
      } else if (line.includes('./libProperties')) {
        targetLine = targetLine = [`// ${line}`, `import lib, { type LibProperties } from './libProperties';`];
      }
    }

    if (line.includes('{{EXPORT_MODULES}}')) {
      const modNames = genExportModuleNames(oriModFilePath);
      targetLine = modNames.map((name) => `  ${name},`);
    } else if (line.includes(`from '${HEL_LIB_PROXY_NAME}'`)) {
      const newLine = line.replace(`from '${HEL_LIB_PROXY_NAME}'`, `from '${helLibProxyName}'`);
      targetLine = newLine;
      if (isFRMarked) {
        targetLine = [`// For react fast refresh, 4 lines below will be commented.`, `// ${newLine}`];
      }
    }

    return { line: targetLine };
  });
};
