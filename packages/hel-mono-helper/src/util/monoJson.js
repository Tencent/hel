/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoAppConf} IMonoAppConf */
const fs = require('fs');
const path = require('path');
const { getTsConfigAliasByDirPath } = require('./alias');
const { getDevInfoDirs } = require('./base');
const { getFileInfoList } = require('./file');
const { getMonoRootInfo } = require('./rootInfo');

function getMonoJsonFilePath() {
  const { monoRoot } = getMonoRootInfo();
  const filePath = path.join(monoRoot, 'hel-mono.json');
  return filePath;
}

function rewriteMonoJson(newJson) {
  const monoJsonPath = getMonoJsonFilePath();
  fs.writeFileSync(monoJsonPath, JSON.stringify(newJson, null, 2));
}

function getMonoJson() {
  const monoJsonPath = getMonoJsonFilePath();
  let monoJson = null;
  if (fs.existsSync(monoJsonPath)) {
    try {
      monoJson = require(monoJsonPath);
    } catch (err) {}
  }

  return monoJson;
}

function getModMonoDataDict(monoJsonOrDevInfo) {
  const { monoRoot } = getMonoRootInfo();
  const { belongToDirs, subModDirs } = getDevInfoDirs(monoJsonOrDevInfo);
  const monoDict = {};
  const prefixedDirDict = {};

  for (const dir of belongToDirs) {
    const dirPath = path.join(monoRoot, dir);
    const isSubMod = subModDirs.includes(dir);

    const list = getFileInfoList(dirPath);
    for (const item of list) {
      if (!item.isDirectory) {
        continue;
      }

      const pkgJsonPath = path.join(item.path, 'package.json');
      if (fs.existsSync(pkgJsonPath)) {
        const alias = getTsConfigAliasByDirPath(item.path);
        const pkgJson = require(pkgJsonPath);
        const pkgName = pkgJson.name;
        const prefixedDir = `${dir}/${item.name}`;
        const data = { alias, hel: pkgJson.hel | {}, isSubMod, prefixedDir, pkgName };

        monoDict[pkgName] = data;
        prefixedDirDict[prefixedDir] = data;
      }
    }
  }

  return { monoDict, prefixedDirDict };
}

module.exports = {
  getMonoJsonFilePath,
  getMonoJson,
  getModMonoDataDict,
  rewriteMonoJson,
};
