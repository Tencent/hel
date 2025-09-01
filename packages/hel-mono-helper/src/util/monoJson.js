/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoAppConf} IMonoAppConf */
/** @typedef {import('../types').IPkgMonoDepData} IPkgMonoDepData */
/** @typedef {import('../types').IGetModMonoDataDictResult} IGetModMonoDataDictResult */
const fs = require('fs');
const path = require('path');
const { safeGet } = require('./dict');
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

function getRawMonoJson() {
  const monoJsonPath = getMonoJsonFilePath();
  let monoJson = null;
  if (fs.existsSync(monoJsonPath)) {
    try {
      monoJson = require(monoJsonPath);
    } catch (err) { }
  }

  return monoJson;
}

/**
 * @returns {IGetModMonoDataDictResult}
 */
function getModMonoDataDict(monoJsonOrDevInfo) {
  const { monoRoot } = getMonoRootInfo();
  const { belongToDirs, subModDirs } = getDevInfoDirs(monoJsonOrDevInfo);
  const monoDict = {};
  const prefixedDirDict = {};
  const dirDict = {};

  for (const belongTo of belongToDirs) {
    const dirPath = path.join(monoRoot, belongTo);
    const isSubMod = subModDirs.includes(belongTo);

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
        const dirName = item.name;
        const prefixedDir = `${belongTo}/${dirName}`;
        const data = {
          pkgName,
          belongTo,
          dirName,
          prefixedDir,
          alias,
          appDirPath: item.path,
          hel: pkgJson.hel || {},
          deps: pkgJson.dependencies || {},
          isSubMod,
        };

        monoDict[pkgName] = data;
        prefixedDirDict[prefixedDir] = data;
        const dataList = safeGet(dirDict, dirName, []);
        dataList.push(data);
      }
    }
  }

  return { monoDict, prefixedDirDict, dirDict };
}

/**
 * @returns {IPkgMonoDepData}
 */
function getMonoDataFromDirDict(dirDict, dir) {
  const dataList = safeGet(dirDict, dir, []);
  if (!dataList.length) {
    throw new Error(`found no project for ${dir}`);
  }
  if (dataList.length >= 2) {
    throw new Error(`found duplcate dir ${dir}, suggest you to prefix it like xxx/${dir}`);
  }
  return dataList[0];
}

/**
 * @returns {IPkgMonoDepData}
 */
function getMonoDataFromDictWrap(/** @type {IGetModMonoDataDictResult} */dictWrap, dirOrPkgName) {
  const { monoDict, prefixedDirDict, dirDict } = dictWrap;
  if (monoDict[dirOrPkgName]) {
    return monoDict[dirOrPkgName];
  }
  if (prefixedDirDict[dirOrPkgName]) {
    return prefixedDirDict[dirOrPkgName];
  }
  return getMonoDataFromDirDict(dirDict, dirOrPkgName);
}

function inferMonoDepDict() {
  const monoJson = getRawMonoJson();
  const { monoDict } = getModMonoDataDict(monoJson || { mods: {} });
  return monoDict;
}

module.exports = {
  getMonoJsonFilePath,
  getRawMonoJson,
  getModMonoDataDict,
  rewriteMonoJson,
  inferMonoDepDict,
  getMonoDataFromDirDict,
  getMonoDataFromDictWrap,
};
