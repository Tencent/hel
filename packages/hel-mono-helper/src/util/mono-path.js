/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const path = require('path');
const { getMonoRootInfo } = require('./root-info');

exports.getMonoDirOrFilePath = function (dirOrFileSubPath) {
  const { monoRoot } = getMonoRootInfo();
  return path.join(monoRoot, dirOrFileSubPath);
};

/**
 * 获取某个完整目录路径下的子目录（或文件）完整路径
 */
exports.getUnderDirSubPath = function (underDirPath, subPath) {
  return path.join(underDirPath, subPath);
};

exports.getMonoSubModSrc = function (belongTo, dirName) {
  return exports.getMonoDirOrFilePath(`./${belongTo}/${dirName}/src`);
};
