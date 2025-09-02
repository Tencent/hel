const shell = require('shelljs');
const path = require('path');
const { getMonoRootInfo } = require('./rootInfo');

function runAppAction(pkgName, scriptCmdKey) {
  const cmd = `pnpm --filter ${pkgName} run ${scriptCmdKey}`;
  shell.exec(cmd);
}

function createApp(pkgName, tplType = 'react-app', belongTo) {
  const { monoRoot } = getMonoRootInfo();
  const startScript = path.join(monoRoot, './dev/root-scripts/executeStart');
  let cmd = `node ${startScript} .create ${pkgName} -t ${tplType}`;
  if (belongTo) {
    cmd += ` -d ${belongTo}`;
  }
  shell.exec(cmd);
}

module.exports = {
  runAppAction,
  createApp,
};
