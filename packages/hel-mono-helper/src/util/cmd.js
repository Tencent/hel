const shell = require('shelljs');
const path = require('path');
const { getMonoRootInfo } = require('./rootInfo');

function runAppAction(pkgName, scriptCmdKey) {
  const cmd = `pnpm --filter ${pkgName} run ${scriptCmdKey}`;
  shell.exec(cmd);
}

function createApp(pkgName, tplType = 'react-app') {
  const { monoRoot } = getMonoRootInfo();
  const startScript = path.join(monoRoot, './dev/root-scripts/executeStart');
  // const cmd = `pnpm start .create ${pkgName}`;
  // shell.exec(`cd ${monoRoot}`);
  // const cmd = `pnpm start .create ${pkgName}`;
  shell.exec(`node ${startScript} .create ${pkgName} -t ${tplType}`);
}

module.exports = {
  runAppAction,
  createApp,
};
