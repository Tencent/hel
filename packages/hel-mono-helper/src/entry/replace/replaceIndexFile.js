const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

module.exports = function replaceIndexFile(/** @type {import('../../types').ICWDAppData} */ appData) {
  const { isForRootHelDir, helDirPath, realAppPkgName } = appData;
  const indexFilePath = path.join(helDirPath, './index.ts');

  helMonoLog(`replace content of ${indexFilePath}`);
  rewriteFileLine(indexFilePath, (line) => {
    let targetLine = line;
    if (line.includes('{{APP_PACK_NAME}}')) {
      const importEntry = isForRootHelDir ? realAppPkgName : '../index';
      targetLine = line.replace('{{APP_PACK_NAME}}', importEntry);
    }
    return { line: targetLine };
  });
};
