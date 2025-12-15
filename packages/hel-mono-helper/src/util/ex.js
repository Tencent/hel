/** @typedef {import('../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const path = require('path');
const { getMonoAppDepDataImpl } = require('./depData');
const { VALID_EX_SUFFIXES } = require('../consts/inner');

/**
 * 获取 ex 项目的依赖，未配置时使用自动推导的数据
 */
function getExProjDeps(exAppPkgName, /** @type IDevInfo */ devInfo, /** @type ICWDAppData */ masterAppData) {
  const appConf = devInfo.appConfs[exAppPkgName] || {};
  let exProjDeps = appConf.exProjDeps;
  if (!exProjDeps) {
    // 注意，此处是通过 masterAppData.appSrcDirPath 获得对应的 external deps 对象
    const { nmL1ExternalDeps } = getMonoAppDepDataImpl({ appSrc: masterAppData.appSrcDirPath, devInfo, isAllDep: true });
    exProjDeps = nmL1ExternalDeps;
  }

  return exProjDeps;
}

function getMasterAppPrefixedDir(exPrefixedDir) {
  const suffix = VALID_EX_SUFFIXES.find((v) => exPrefixedDir.endsWith(v));
  if (suffix) {
    return exPrefixedDir.substring(0, exPrefixedDir.length - suffix.length);
  }
  return exPrefixedDir;
}

/**
 * @returns
 */
function buildExAppData(/** @type {ICWDAppData} */ masterAppData) {
  const p = path.sep;
  const {
    appDir,
    appDirPath,
    appSrcDirPath,
    appPkgName,
    helDirPath,
    realAppDirPath,
    realAppSrcDirPath,
    realAppPkgJsonPath,
    realAppPkgName,
    ...rest
  } = masterAppData;
  const exAppDir = `${appDir}-ex`;
  const replaceDir = (str) => str.replace(`${p}${appDir}${p}`, `${p}${exAppDir}${p}`);
  const replaceEndDir = (str) => str.replace(`${p}${appDir}`, `${p}${exAppDir}`);
  const replaceName = (str) => `${str}-ex`;

  return {
    ...rest,
    appDir: exAppDir,
    appDirPath: replaceEndDir(appDirPath),
    appSrcDirPath: replaceDir(appSrcDirPath),
    appPkgName: replaceName(appPkgName),
    helDirPath: replaceDir(helDirPath),
    realAppDirPath: replaceEndDir(realAppDirPath),
    realAppSrcDirPath: replaceDir(realAppSrcDirPath),
    realAppPkgJsonPath: replaceDir(realAppPkgJsonPath),
    realAppPkgName: replaceName(realAppPkgName),
  };
}

module.exports = {
  getMasterAppPrefixedDir,
  buildExAppData,
  getExProjDeps,
};
