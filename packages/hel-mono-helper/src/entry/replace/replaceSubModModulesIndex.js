const fs = require('fs');
const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { genExportModuleNames, getModEntryFilePath } = require('./util');

module.exports = function replaceSubModModulesIndex(/** @type {import('../../types').ICWDAppData} */ appData) {
  const { helDirPath, realAppPkgName, realAppSrcDirPath, isForRootHelDir } = appData;
  const filePath = path.join(helDirPath, './modules/index.ts');
  let oriModImportName = realAppPkgName;
  let oriModFilePath = getModEntryFilePath(realAppSrcDirPath);

  if (!isForRootHelDir) {
    if (fs.existsSync(path.join(realAppSrcDirPath, './export.ts'))) {
      oriModImportName = '../../export';
      oriModFilePath = getModEntryFilePath(realAppSrcDirPath, 'export');
    } else {
      oriModImportName = '../../index';
    }
  }

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes('{{EXPORT_MODULES}}')) {
      const modNames = genExportModuleNames(oriModFilePath);
      targetLine = modNames.map((name) => `  ${name},`);
    } else if (line.includes('{{PACK_NAME}}')) {
      targetLine = line.replace('{{PACK_NAME}}', oriModImportName);
    }

    return { line: targetLine };
  });
};
