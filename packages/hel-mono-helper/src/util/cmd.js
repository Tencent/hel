const shell = require('shelljs');
const path = require('path');
const { getMonoRootInfo } = require('./rootInfo');
const { getRawMonoJson } = require('./monoJson');

function runAppAction(pkgName, scriptCmdKey) {
  const cmd = `pnpm --filter ${pkgName} run ${scriptCmdKey}`;
  shell.exec(cmd);
}

function getDevDirPath() {
  let devDirPath = 'dev';
  const monoJson = getRawMonoJson();
  if (monoJson) {
    devDirPath = monoJson.devDir || 'dev';
  }
  if (devDirPath.startsWith('/')) {
    return devDirPath;
  }

  const { monoRoot } = getMonoRootInfo();
  let dirSeg = devDirPath;
  if (!dirSeg.startsWith('.')) {
    dirSeg = `./${dirSeg}`;
  }

  return path.join(monoRoot, dirSeg);
}

function createApp(pkgName, tplType = 'react-app', belongTo) {
  const devDirPath = getDevDirPath();
  const startScript = path.join(devDirPath, './root-scripts/executeStart');
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
