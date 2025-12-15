const fs = require('fs');
const path = require('path');
const { getContentLines } = require('./xplat');

function cpSync(fromDir, toDir) {
  try {
    fs.cpSync(fromDir, toDir, { recursive: true });
  } catch (err) {
    // 执行 pnpm start hub:hel 时，node 18 里的 cpSync 偶尔会报如下类似错误，但再执行一次时就不报了
    // Error: ENOENT: no such file or directory, unlink '/path/project/packages/mono-libs/src/.hel/indexEX.ts'
    // at unlinkSync (node:fs:1780:3)
    // at mayCopyFile (node:internal/fs/cp/cp-sync:219:5)
    // at onFile (node:internal/fs/cp/cp-sync:214:10)
    // at getStats (node:internal/fs/cp/cp-sync:183:12)
    // at startCopy (node:internal/fs/cp/cp-sync:163:10)
    // at copyDir (node:internal/fs/cp/cp-sync:289:7)
    // at onDir (node:internal/fs/cp/cp-sync:268:10)
    // at getStats (node:internal/fs/cp/cp-sync:171:12)
    // at handleFilterAndCopy (node:internal/fs/cp/cp-sync:158:10)
    // at cpSyncFn (node:internal/fs/cp/cp-sync:60:10) {
    fs.cpSync(fromDir, toDir, { recursive: true });
  }
}

function getFileContentLines(filePath) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const lines = getContentLines(content);
  return lines;
}

/**
 * 获取父目录下所有一级子目录名称和路径
 * @return {{name: string, path:string}[]}
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
  cpSync,
};
