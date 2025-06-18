const shell = require('shelljs');
const { helMonoLog } = require('../../util');

module.exports = function prepareNodeModules(appData) {
  const { appDirPath, isForRootHelDir } = appData;
  if (!isForRootHelDir) {
    return;
  }
  // 此处无需用 cd 切换 cwd
  helMonoLog(`install node modules for ${appDirPath}`);
  shell.exec('pnpm i');

  // const nodeModules = path.join(appDirPath, `./node_modules`);
  // if (!fs.existsSync(nodeModules)) {
  // }
};
