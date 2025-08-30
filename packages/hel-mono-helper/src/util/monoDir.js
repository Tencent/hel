const { lastNItem } = require('./arr');
const { getDevInfoDirs } = require('./base');
const { getMonoRootInfo } = require('./rootInfo');
const { pickOneDir } = require('./monoPath');

function inferDirFromDevInfo(devInfo, allowEmptyDir) {
  //  执行 pnpm start 时，从目录结构里挑出一个并返回
  const { appsDirs, subModDirs } = getDevInfoDirs(devInfo);
  const { monoRoot } = getMonoRootInfo();
  let targetDirName = pickOneDir(monoRoot, appsDirs);

  if (!targetDirName) {
    targetDirName = pickOneDir(monoRoot, subModDirs);
  }

  if (!allowEmptyDir && !targetDirName) {
    throw new Error('current hel-mono project is empty, please execute "pnpm start .create my-app" to add one app');
  }

  return targetDirName;
}

function inferDirFromArgv2ndItem(devInfo, allowEmptyDir) {
  const argv = process.argv;
  const mayDirName = lastNItem(argv, 2);

  if (mayDirName) {
    return mayDirName;
  }

  return inferDirFromDevInfo(devInfo, allowEmptyDir);
}

module.exports = {
  inferDirFromArgv2ndItem,
  inferDirFromDevInfo,
};
