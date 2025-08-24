/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const path = require('path');
const { getMonoRootInfo } = require('./root-info');

function pickOneDir(dirRoot, dirNames) {
  let targetDirName = '';

  out: for (const dirName of dirNames) {
    const dirPath = path.join(dirRoot, dirName);
    const subDirNames = fs.readdirSync(dirPath);
    for (const subDirName of subDirNames) {
      const subDirPath = path.join(dirPath, `./${subDirName}`);
      const stat = fs.statSync(subDirPath);
      if (stat.isDirectory()) {
        targetDirName = subDirName;
        break out;
      }
    }
  }

  return targetDirName;
}

function getMonoDirOrFilePath(dirOrFileSubPath) {
  const { monoRoot } = getMonoRootInfo();
  return path.join(monoRoot, dirOrFileSubPath);
}

/**
 * 获取某个完整目录路径下的子目录（或文件）完整路径
 */
function getUnderDirSubPath(underDirPath, subPath) {
  return path.join(underDirPath, subPath);
}

function getMonoSubModSrc(belongTo, dirName) {
  return getMonoDirOrFilePath(`./${belongTo}/${dirName}/src`);
}

module.exports = {
  pickOneDir,
  getMonoDirOrFilePath,
  getUnderDirSubPath,
  getMonoSubModSrc,
};
