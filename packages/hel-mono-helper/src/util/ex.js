/** @typedef {import('../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
/** @typedef {{ exAppData:ICWDAppData, devInfo:IDevInfo, masterAppData: ICWDAppData }} Options */
const path = require('path');
const fs = require('fs');
const { noDupPushWithCb, lastNItem } = require('./arr');
const { getMonoAppDepDataImpl } = require('./depData');
const { resolveAppRelPath } = require('./file');
const { getMonoAppPkgJsonByAppData } = require('./monoPkg');
const { getNmPkgJsonByPath } = require('./nmPkg');
const { VALID_EX_SUFFIXES } = require('../consts/inner');

function guessPrefixedDir(pkgPath) {
  const [projPath] = pkgPath.split('/node_modules');
  const strList = projPath.split(path.sep);
  const belongTo = lastNItem(strList, 2);
  const dirName = lastNItem(strList, 1);
  const prefixedDirName = `${belongTo}/${dirName}`;
  return prefixedDirName;
}

function getMasterAppExJson(options) {
  const { devInfo, masterAppData, writeExJson } = options;
  // 注意，此处是通过 masterAppData.appSrcDirPath 获得对应的 external deps 对象
  const { nmL1ExternalDeps, nmL1ExternalDepData } = getMonoAppDepDataImpl({ appSrc: masterAppData.appSrcDirPath, devInfo, isAllDep: true });
  const nmPkgNames = Object.keys(nmL1ExternalDeps);
  resolveAppRelPath(masterAppData, './.hel', true);

  const exJson = { vers: {}, pkgJsonPaths: {}, semVers: {} };
  const dupVerPkgDatas = [];
  for (let i = 0; i < nmPkgNames.length; i++) {
    const pkgName = nmPkgNames[i];
    const { semVers, pkgPaths } = nmL1ExternalDepData[pkgName];
    // 在 pnpm 大仓里，不可能出现两个子项目里 semVer 一样但安装的包版本不一样的情况，故这里判断 semVers.length 是没问题的
    if (semVers.length <= 1) {
      const { pkgJson, pkgJsonPath } = getNmPkgJsonByPath(pkgPaths[0]);
      exJson.vers[pkgName] = pkgJson.version;
      exJson.pkgJsonPaths[pkgName] = pkgJsonPath;
      exJson.semVers[pkgName] = semVers[0];
      continue;
    }

    const installedVers = [];
    const installedVerDatas = [];
    pkgPaths.forEach(pkgPath => {
      const { pkgJson, pkgJsonPath } = getNmPkgJsonByPath(pkgPath);
      noDupPushWithCb(installedVers, pkgJson.version, () => {
        installedVerDatas.push({ pkgVer: pkgJson.version, pkgPath });
      });
      exJson.vers[pkgName] = pkgJson.version;
      exJson.pkgJsonPaths[pkgName] = pkgJsonPath;
      // 出现多个 semVer 但安装版本只有一个的情况是合法的，故这里可取 semVers 第一个值记录到 exJson 里
      exJson.semVers[pkgName] = semVers[0];
    });

    if (installedVers.length > 1) {
      dupVerPkgDatas.push({ name: pkgName, vers: installedVerDatas });
    }
  }

  if (dupVerPkgDatas.length) {
    const tip = dupVerPkgDatas.map(v => {
      const verStr = v.vers.map(item => `${guessPrefixedDir(item.pkgPath)}:${item.pkgVer}`).join(', ');
      const dupDesc = `${v.name}(${verStr})`;
      return dupDesc;
    }).join(', ');
    throw new Error(`found those packages with duplicate ver: ${tip}`);
  }

  if (writeExJson) {
    const exJsonPath = resolveAppRelPath(masterAppData, './.hel/ex.json');
    fs.writeFileSync(exJsonPath, JSON.stringify(exJson, null, 2));
  }

  return exJson;
}

// maySemVers value 可能是具体的版本号，也可能是语义化版本号
function getExJsonByVers(maySemVers) {
  const exJson = { vers: {}, pkgJsonPaths: {}, semVers: maySemVers };
  const { vers, pkgJsonPaths } = exJson;
  const pkgNames = Object.keys(maySemVers);

  for (const name of pkgNames) {
    const { pkgJson, pkgJsonPath } = getNmPkgJsonByPath(require.resolve(name));
    vers[name] = pkgJson.version;
    pkgJsonPaths[name] = pkgJsonPath;
  }

  return exJson;
}

function getExJson(/** @type {Options} */ options) {
  const { exAppData, devInfo } = options;
  const { appPkgName } = exAppData;
  const appConf = devInfo.appConfs[appPkgName] || {};

  let exProjDeps = appConf.exProjDeps;
  // exProjDeps 的优先级比 isFixed 高
  if (exProjDeps) {
    return getExJsonByVers(exProjDeps);
  }

  const pkgJson = getMonoAppPkgJsonByAppData(exAppData);
  const helConf = pkgJson.hel || {};

  if (helConf.isFixed) {
    const appDeps = pkgJson.dependencies || {};
    const exJson = getExJsonByVers(appDeps);
    // 设置 isFixed=true 时，关闭了声明在 deps 里的和宿主应用同名依赖的版本号同步功能
    if (helConf.disableSync) {
      return exJson;
    }

    const masterAppExJson = getMasterAppExJson(options);
    const { vers: mVers, pkgJsonPaths: mPaths, semVers: mSemVers } = masterAppExJson;
    const { vers, pkgJsonPaths, semVers } = exJson;
    Object.keys(vers).forEach((name) => {
      vers[name] = mVers[name] || vers[name];
      pkgJsonPaths[name] = mPaths[name] || pkgJsonPaths[name];
      semVers[name] = mSemVers[name] || semVers[name];
    });

    return exJson;
  }

  const masterAppExJson = getMasterAppExJson(options);
  return masterAppExJson;
}

/**
 * 获取 ex 项目的依赖，以下情况会使用固定的依赖数据
 * 1 hel-mono.json 里配置了 exProjDeps
 * 2 ex 项目的 package.json 里设置了 hel.isFixed=true && hel.disableSync=true
 */
function getExProjDeps(/** @type {Options} */ options) {
  const { exAppData, devInfo } = options;
  const appConf = devInfo.appConfs[exAppData.appPkgName] || {};
  let exProjDeps = appConf.exProjDeps;

  if (exProjDeps) {
    return exProjDeps;
  }

  const pkgJson = getMonoAppPkgJsonByAppData(exAppData);
  const helConf = pkgJson.hel || {};
  if (!helConf.isFixed) {
    const masterAppExJson = getMasterAppExJson(options);
    // 使用具体的版本号
    return masterAppExJson.vers;
  }

  const appDeps = pkgJson.dependencies || {};
  if (helConf.disableSync) {
    return appDeps;
  }

  const overwriteDeps = {};
  const { vers } = getMasterAppExJson(options);
  Object.keys(appDeps).forEach((name) => {
    // 会合入部分同名依赖的具体版本号
    overwriteDeps[name] = vers[name] || appDeps[name];
  });

  return overwriteDeps;
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
  getMasterAppExJson,
  getExJson,
};
