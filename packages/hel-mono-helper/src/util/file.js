/** @typedef {import('../types').ICWDAppData} ICWDAppData */
const fs = require('fs');
const path = require('path');
const { baseUtils } = require('hel-dev-utils-base');
const jsonc = require('jsonc-parser');
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
 * 不透传 options 时，此方法仅获取第一层子文件、文件夹列表
 * @returns {{name: string, path: string, isDirectory: boolean}[]}
 */
function getFileInfoList(parentDirPath, options) {
  const { allLevel, getType = 'all' } = options || {};
  const dirInfoList = [];
  const pushList = (list, item) => {
    const { isDirectory } = item;
    if (getType === 'all') {
      return list.push(item);
    }
    // regular: non-directory file
    if (getType === 'regular' && !isDirectory) {
      return list.push(item);
    }
    // dir: directory file
    if (getType === 'dir' && isDirectory) {
      return list.push(item);
    }
  };

  const innerGet = (list, dirPath) => {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const names = fs.readdirSync(dirPath);
    names.forEach((name) => {
      const mayDirPath = path.join(dirPath, name);
      const stats = fs.statSync(mayDirPath);
      const isDirectory = stats.isDirectory();
      pushList(list, { name, path: mayDirPath, isDirectory });
      if (allLevel && isDirectory) {
        innerGet(list, mayDirPath);
      }
    });
  };
  innerGet(dirInfoList, parentDirPath);

  return dirInfoList;
}

function resolveAppRelPath(/** @type {ICWDAppData} */ appData, relPath, isDir) {
  const { monoRoot, belongTo, appDir } = appData;
  const relPathVar = baseUtils.slash.start(relPath);
  const filePath = path.join(monoRoot, `./${belongTo}/${appDir}${relPathVar}`);
  if (isDir && !fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  return filePath;
}

function getFileJson(standardJsonFilePath, allowNull) {
  try {
    const str = fs.readFileSync(standardJsonFilePath, { encoding: 'utf-8' });
    const json = JSON.parse(str);
    return json;
  } catch (err) {
    if (!allowNull) {
      throw err;
    }
    return null;
  }
}

function getJsoncFileJsonByDR(dirPath, relPath) {
  const filePath = path.join(dirPath, relPath);
  const json = getJsoncFileJson(filePath);
  return {
    json,
    write: (input) => fs.writeFileSync(filePath, JSON.stringify(input || json, null, 2)),
  };
}

function getJsoncFileJson(filePath) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const json = jsonc.parse(content);
  return json;
}

module.exports = {
  getFileContentLines,
  getDirInfoList,
  getFileInfoList,
  getFileJson,
  getJsoncFileJson,
  getJsoncFileJsonByDR,
  resolveAppRelPath,
  cpSync,
};
