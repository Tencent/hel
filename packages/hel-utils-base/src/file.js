import * as fs from 'fs';
import * as path from 'path';

function innerGetAllFilePath(dirPath, filePathList = []) {
  const names = fs.readdirSync(dirPath);
  names.forEach((name) => {
    const filePath = path.join(dirPath, name);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      innerGetAllFilePath(filePath, filePathList);
    } else {
      filePathList.push(filePath);
    }
  });

  return filePathList;
}

/**
 * 递归获得某个目录下的所有文件绝对路径
 * @param {string} dirPath 形如:/user/zzk/log/build
 * @return {string[]} filePathList
 * 形如 ['/user/zzk/log/build/js/xx.js', '/user/zzk/log/build/img/xx.png']
 */
export function getAllFilePath(dirPath) {
  const filePathList = [];
  return innerGetAllFilePath(dirPath, filePathList);
}
