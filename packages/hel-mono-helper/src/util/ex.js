/** @typedef {import('../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
/** @typedef {{ exAppData:ICWDAppData, devInfo:IDevInfo, masterAppData: ICWDAppData }} Options */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { getMonoAppDepDataImpl } = require('./depData');
const { resolveAppRelPath, getFileJson } = require('./file');
const { getMonoAppPkgJsonByAppData } = require('./monoPkg');
const { getNmPkgJsonByPath } = require('./nmPkg');
const { rewriteFileLine } = require('./rewrite');
const { HEL_TPL_GEN_EXJSON_PATH } = require('../consts');
const { VALID_EX_SUFFIXES } = require('../consts/inner');

function getDepKeyStr(key) {
  if (key.includes('/') || key.includes('.') || key.includes('-') | key.includes(':')) {
    return `'${key}'`;
  }
  return key;
}

function getMasterAppExJson(options) {
  const { devInfo, masterAppData, writeExJson } = options;
  // 注意，此处是通过 masterAppData.appSrcDirPath 获得对应的 external deps 对象
  const { nmL1ExternalDeps } = getMonoAppDepDataImpl({ appSrc: masterAppData.appSrcDirPath, devInfo, isAllDep: true });
  const nmPkgNames = Object.keys(nmL1ExternalDeps);
  resolveAppRelPath(masterAppData, './.hel', true);
  const genExJsonPath = resolveAppRelPath(masterAppData, './.hel/gen-exjson.js');
  fs.writeFileSync(genExJsonPath, fs.readFileSync(HEL_TPL_GEN_EXJSON_PATH).toString());

  rewriteFileLine(genExJsonPath, (/** @type string */ line) => {
    let targetLine = line;
    if (line.includes('const pkgNames = [];')) {
      targetLine = ['  const pkgNames = ['];
      nmPkgNames.forEach((v) => targetLine.push(`    '${v}',`));
      targetLine.push('  ];');
    } else if (line.includes('const semVers = {};')) {
      targetLine = ['  const semVers = {'];
      nmPkgNames.forEach((v) => targetLine.push(`    ${getDepKeyStr(v)}:'${nmL1ExternalDeps[v]}',`));
      targetLine.push('  };');
    }

    return { line: targetLine };
  });

  // 在宿主项目执行完 get-vers 脚本后，才能获得他在 pnpm 里锁定的各个子包依赖
  const { genExJson } = require(genExJsonPath);
  const exJson = genExJson(writeExJson);

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
