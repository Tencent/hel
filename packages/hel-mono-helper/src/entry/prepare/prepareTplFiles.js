const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { HEL_TPL_INNER_APP_PATH, HEL_TPL_INNER_SUB_MOD_PATH } = require('../../consts');
const { helMonoLog } = require('../../util');
const ensureBaseFiles = require('./ensureBaseFiles');

module.exports = function prepareTplFiles(appData) {
  const { appDirPath, realAppSrcDirPath, isForRootHelDir, isSubMod } = appData;
  ensureBaseFiles(appData);
  const label = !isSubMod ? 'app' : 'sub module';
  const tplRootPath = !isSubMod ? HEL_TPL_INNER_APP_PATH : HEL_TPL_INNER_SUB_MOD_PATH;

  if (isForRootHelDir) {
    helMonoLog(`delete files of ${appDirPath}/src`);
    try {
      shell.exec(`rm -rf ${appDirPath}/src`);
    } catch (err) {
      helMonoLog('delete error', err);
    }
    helMonoLog(`copy hel ${label} template files to ${appDirPath}`);
    fs.cpSync(tplRootPath, appDirPath, { recursive: true });
    return;
  }

  const fromDir = path.join(tplRootPath, './src');
  const toDir = path.join(realAppSrcDirPath, './.hel');
  helMonoLog(`copy hel ${label} template src files to ${toDir}`);
  fs.cpSync(fromDir, toDir, { recursive: true });
};
