const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const { HEL_TPL_INNER_APP_PATH, HEL_TPL_INNER_SUB_MOD_PATH } = require('../../consts');
const { helMonoLog, isHelExternalBuild } = require('../../util');
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


  if (isHelExternalBuild()) {
    const fromDir = path.join(tplRootPath, './src/indexEX.ts');
    const toDir = path.join(realAppSrcDirPath, './.hel/indexEX.ts');
    fs.cpSync(fromDir, toDir, { recursive: true });
    return;
  }

  const fromDir = path.join(tplRootPath, './src');
  const toDir = path.join(realAppSrcDirPath, './.hel');

  const exFile = path.join(toDir, './indexEX.ts');
  let oldExFileContent = ''
  if (fs.existsSync(exFile)) {
    oldExFileContent = fs.readFileSync(exFile, { encoding: 'utf8' });
  }

  helMonoLog(`copy hel ${label} template src files to ${toDir}`);
  fs.cpSync(fromDir, toDir, { recursive: true });

  // 还原最近一次执行 build:helex 或 start:helex 的结果
  if (oldExFileContent) {
    fs.writeFileSync(exFile, oldExFileContent, { encoding: 'utf8' });
  }
};
