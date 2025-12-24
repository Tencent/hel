/** @typedef {import('hel-mono-types').IMonoAppConf} IMonoAppConf */
/** @typedef {import('hel-mono-types').IHelMonoJson} IHelMonoJson */
/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
/** @typedef {import('../types').IGetModMonoDataDictResult} IGetModMonoDataDictResult */
/** @typedef {import('../types').IPkgMonoDepData} IPkgMonoDepData */
const fs = require('fs');
const path = require('path');
const { MONO_JSON } = require('../consts/inner');
const { safeGet } = require('./dict');
const { getTsConfigAliasByDirPath } = require('./alias');
const { getDevInfoDirs } = require('./base');
const { getFileInfoList } = require('./file');
const { getMonoRootInfo } = require('./rootInfo');

function getMonoJsonFilePath() {
  const { monoRoot } = getMonoRootInfo();
  const filePath = path.join(monoRoot, MONO_JSON);
  return filePath;
}

function rewriteMonoJson(newJson) {
  const monoJsonPath = getMonoJsonFilePath();
  fs.writeFileSync(monoJsonPath, JSON.stringify(newJson, null, 2));
}

/**
 * @returns {IHelMonoJson}
 */
function getRawMonoJson() {
  const monoJsonPath = getMonoJsonFilePath();
  let monoJson = null;
  if (fs.existsSync(monoJsonPath)) {
    try {
      monoJson = require(monoJsonPath);
    } catch (err) {}
  }

  return monoJson;
}

/**
 * 服务于 getModMonoDataDict，相同的脚本上下文多次命中此函数时，可读取缓存数据
 */
const innerCache = new Map();

/**
 * @returns {IGetModMonoDataDictResult}
 */
function getModMonoDataDict(monoJsonOrDevInfo) {
  const cachedResult = innerCache.get(monoJsonOrDevInfo);
  if (cachedResult) {
    cachedResult;
  }

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
        const alias = getTsConfigAliasByDirPath(monoJsonOrDevInfo, item.path);
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

  const result = { monoDict, prefixedDirDict, dirDict };
  innerCache.set(monoJsonOrDevInfo, result);

  return result;
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
    throw new Error(`found duplicate dir ${dir}, suggest you to prefix it like xxx/${dir}`);
  }
  return dataList[0];
}

/**
 * @returns {IPkgMonoDepData}
 */
function getMonoDataFromDictWrap(/** @type {IGetModMonoDataDictResult} */ dictWrap, dirOrPkgName) {
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
