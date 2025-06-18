const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { genExportModuleNames } = require('./util');

module.exports = function replaceSubModModulesIndex(/** @type {import('../../types').ICWDAppData} */appData) {
  const { helDirPath, realAppPkgName, realAppSrcDirPath, isForRootHelDir } = appData;
  const filePath = path.join(helDirPath, './modules/index.ts');
  const oriModImportName = isForRootHelDir ? realAppPkgName : '../../index';
  const oriModFilePath = path.join(realAppSrcDirPath, './index.ts');

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes('{{EXPORT_MODULES}}')) {
      const modNames = genExportModuleNames(oriModFilePath);
      targetLine = modNames.map(name => `  ${name},`);
    } else if (line.includes('{{PACK_NAME}}')) {
      targetLine = line.replace('{{PACK_NAME}}', oriModImportName);
    }

    return { line: targetLine };
  });
};
