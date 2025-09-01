const path = require('path');
const { lastNItem } = require('./arr');
const { getMonoRootInfo } = require('./rootInfo');
const { getModMonoDataDict, getMonoDataFromDictWrap } = require('./monoJson');

function getDirData(cwd) {
  const list = cwd.split(path.sep);
  const belongTo = lastNItem(list, 2);
  const dirName = lastNItem(list, 1);
  const prefixedDir = `${belongTo}/${dirName}`;
  return { belongTo, dirName, prefixedDir };
}

function getCwdByPrefixedDir(prefixedDir) {
  const { monoRoot } = getMonoRootInfo();
  return path.join(monoRoot, prefixedDir);
}

function inferDirData(devInfo, inputCwd) {
  const cwd = inputCwd || process.cwd();
  const { monoRoot } = getMonoRootInfo();
  const list = cwd.split(path.sep);
  const cwdLast2Str = lastNItem(list, 2);
  const cwdLast1Str = lastNItem(list, 1);
  const argv = process.argv;
  const argvLast1Str = lastNItem(argv, 1);

  // 根目录执行 pnpm start hub:helex，产生 argv 类似：
  // ['/xx/node/18.12.1/bin/node', '/xx/hel-mono/dev/root-scripts/executeStart', 'hub:helex']
  if (monoRoot === cwd) {
    const [pkgOrDirName] = argvLast1Str.split(':');
    const dictWrap = getModMonoDataDict(devInfo);
    const { belongTo, dirName } = getMonoDataFromDictWrap(dictWrap, pkgOrDirName);
    return { belongTo, dirName, prefixedDir: `${belongTo}/${dirName}` };
  }

  return { belongTo: cwdLast2Str, dirName: cwdLast1Str, prefixedDir: `${cwdLast2Str}/${cwdLast1Str}` };
}

module.exports = {
  getDirData,
  getCwdByPrefixedDir,
  inferDirData,
};
