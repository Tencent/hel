const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');
const { genExportModuleNames } = require('./util');

module.exports = function replaceSubModLibTypes(/** @type {import('../../types').ICWDAppData} */ appData) {
  const { helDirPath, realAppSrcDirPath } = appData;
  const filePath = path.join(helDirPath, './entrance/libTypes.ts');
  const oriModFilePath = path.join(realAppSrcDirPath, './index.ts');

  helMonoLog(`replace content of ${filePath}`);
  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes('{{EXPORT_MODULES}}')) {
      const modNames = genExportModuleNames(oriModFilePath);
      targetLine = modNames.map((name) => `  ${name},`);
    }

    return { line: targetLine };
  });
};
