const fs = require('fs');
const path = require('path');
const { getContentLines } = require('./xplat');

function getFileContentLines(filePath) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const lines = getContentLines(content);
  return lines;
}

/**
 * 获取父目录下所有一级子目录名称和路径
 */
function getDirInfoList(parentDirPath) {
  const names = fs.readdirSync(parentDirPath);
  const dirInfoList = [];
  names.forEach((name) => {
    const mayDirPath = path.join(parentDirPath, name);
    const stats = fs.statSync(mayDirPath);
    if (stats.isDirectory()) {
      dirInfoList.push({ name, path: mayDirPath });
    }
  });
  return dirInfoList;
}

/**
 * 此方法仅获取第一层子文件列表
 * @returns {{name: string, path: string, isDirectory: boolean}[]}
 */
function getFileInfoList(parentDirPath) {
  const dirInfoList = [];
  if (!fs.existsSync(parentDirPath)) {
    return dirInfoList;
  }

  const names = fs.readdirSync(parentDirPath);
  names.forEach((name) => {
    const mayDirPath = path.join(parentDirPath, name);
    const stats = fs.statSync(mayDirPath);
    dirInfoList.push({ name, path: mayDirPath, isDirectory: stats.isDirectory() });
  });
  return dirInfoList;
}

module.exports = {
  getFileContentLines,
  getDirInfoList,
  getFileInfoList,
};
