/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const path = require('path');
const { APPS, PACKAGES, HEL_DIR_NAME, INNER_SUB_MOD_ORG, INNER_APP_ORG } = require('../consts');

/**
 * 获取 node 命令执行时所处目录，
 * 形如：/your/path/hel-mono/apps/hub
 */
exports.getCWD = function () {
  return process.cwd();
};

exports.getCWDPkgDir = function () {
  const cwd = exports.getCWD();
  const strList = cwd.split(path.sep);
  return strList[strList.length - 1];
};

exports.getCWDIsForRootHelDir = function () {
  const cwd = exports.getCWD();
  const strList = cwd.split(path.sep);
  const rootHelAppSeg = `${path.sep}${HEL_DIR_NAME}${path.sep}${INNER_APP_ORG}`;
  const rootHelSubModSeg = `${path.sep}${HEL_DIR_NAME}${path.sep}${INNER_SUB_MOD_ORG}`;
  return strList.includes(rootHelAppSeg) || strList.includes(rootHelSubModSeg);
};

exports.getDevInfoDirs = function (/** @type {IMonoDevInfo} */ devInfo) {
  const { appsDirs = [APPS], subModDirs = [PACKAGES] } = devInfo;
  const belongToDirs = appsDirs.concat(subModDirs);
  return { appsDirs, subModDirs, belongToDirs };
};

/**
 * 通过package.json 文件路径获取其文件内容，返回 json 对象
 */
exports.getPkgJson = function (pkgFilePath) {
  const str = fs.readFileSync(pkgFilePath, { encoding: 'utf-8' });
  const json = JSON.parse(str);
  return json;
};

exports.getDirName = function (appSrc) {
  const strList = appSrc.split('/');
  return strList[strList.length - 2];
};

exports.getDevInfoDirs = function (/** @type {IMonoDevInfo} */ devInfo) {
  const { appsDirs = [APPS], subModDirs = [PACKAGES] } = devInfo;
  const belongToDirs = appsDirs.concat(subModDirs);
  return { appsDirs, subModDirs, belongToDirs };
};

/** 求两个数组的交集 */
exports.intersection = function (arr1, arr2) {
  return arr1.reduce((result, current) => {
    if (arr2.includes(current) && !result.includes(current)) {
      result.push(current);
    }
    return result;
  }, []);
};

exports.getPrefixedDirName = function (appSrc) {
  const strList = appSrc.split('/');
  const len = strList.length;
  return `${strList[len - 3]}/${strList[len - 2]}`;
};

/**
 * 获得 alias 描述对象
 */
exports.getAppAlias = function (appSrc, devInfo, prefixedDir2Pkg) {
  // 支持宿主和其他子模块 @/**/*, @xx/**/* 等能够正常工作
  const appAlias = {};
  const prefixedDirName = exports.getPrefixedDirName(appSrc);
  const packName = prefixedDir2Pkg[prefixedDirName];
  // const alias = devInfo.appConfs[packName]?.alias;
  // 考虑兼容性，不用可选链
  const alias = (devInfo.appConfs[packName] || {}).alias;

  if (alias) {
    appAlias[alias] = appSrc;
  } else {
    // 未配置别名则默认为 @
    appAlias['@'] = appSrc;
  }

  return appAlias;
};

exports.ensureSlash = function (inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
};
