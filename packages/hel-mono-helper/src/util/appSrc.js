/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const path = require('path');
const { getTsConfigAliasByDirPath } = require('./alias');
const { getMonoRootInfo } = require('./rootInfo');

function getTsConfigDirPathByAppSrc(appSrc) {
  const strList = appSrc.split(path.sep);
  const tsConfigDirPath = strList.slice(0, strList.length - 1).join(path.sep);
  return tsConfigDirPath;
}

/**
 * 通过 appSrc 获取 tsconfig.json 里的 alias 别名，注：目前 hel-mono 架构暂支持对模块配置一个别名，故只会读取其中一个
 */
function getTsConfigAliasByAppSrc(devInfo, appSrc) {
  const tsConfigDirPath = getTsConfigDirPathByAppSrc(appSrc);
  const targetAlias = getTsConfigAliasByDirPath(devInfo, tsConfigDirPath);
  return targetAlias;
}

function inferConfAlias(devInfo, options) {
  const { appSrc, appConf, pkgName } = options;
  // const alias = appConf?.alias;
  // 考虑兼容性，不用可选链
  const alias = (appConf || {}).alias || '';
  const tipLabel = `package ${pkgName}`;
  const tsConfigAlias = getTsConfigAliasByAppSrc(devInfo, appSrc);

  if (alias && !tsConfigAlias) {
    throw new Error(`${tipLabel} has alias ${alias} in dev-info, but has no alias in its tsconfig.json`);
  }

  if (alias && alias !== tsConfigAlias) {
    throw new Error(`${tipLabel}'s alias ${alias} in dev-info is not equal alias ${tsConfigAlias} in tsconfig.json`);
  }

  return alias || tsConfigAlias;
}

function getPrefixedDirName(appSrc) {
  const strList = appSrc.split(path.sep);
  const len = strList.length;
  return `${strList[len - 3]}/${strList[len - 2]}`;
}

/**
 * 通过src完整路径获得应用在大仓里的所属目录
 * @example
 * ```
 * input: /user/path/to/hel-mono/packages/mono-comps-in-one-v2/src
 * output: packages
 * ```
 */
function getAppBelongTo(appSrc) {
  const strList = appSrc.split(path.sep);
  return strList[strList.length - 3];
}

/**
 * 获得 alias 描述对象
 */
function buildAppAlias(appSrc, /** @type {IDevInfo} */ devInfo, prefixedDir2Pkg) {
  // 支持宿主和其他子模块 @/**/*, @xx/**/* 等能够正常工作
  const appAlias = {};
  const prefixedDirName = getPrefixedDirName(appSrc);
  const pkgName = prefixedDir2Pkg[prefixedDirName];
  const targetAlias = inferConfAlias(devInfo, { appSrc, appConf: devInfo.appConfs[pkgName], pkgName });
  if (targetAlias) {
    appAlias[targetAlias] = appSrc;
  }

  return appAlias;
}

function getAppDirPath(appSrc) {
  const prefixedDir = getPrefixedDirName(appSrc);
  const { monoRoot } = getMonoRootInfo();
  return path.join(monoRoot, prefixedDir);
}

function getAppCwd(appSrc) {
  let appCwd = appSrc;
  if (appCwd.endsWith(`${path.sep}src`)) {
    appCwd = appSrc.substring(0, appSrc.length - 4);
  }
  return appCwd;
}

module.exports = {
  inferConfAlias,
  buildAppAlias,
  getAppCwd,
  getAppBelongTo,
  getTsConfigAliasByAppSrc,
  getTsConfigDirPathByAppSrc,
  getPrefixedDirName,
  getAppDirPath,
};
