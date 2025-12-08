/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
const fs = require('fs');
const path = require('path');
const { execCreate } = require('../../exec/create');
const { initMono } = require('../../exec/initMono');
const { inferDevInfo } = require('../../util/devInfo');
const { getMonoDevData } = require('../../dev-data');
const { HEL_TPL_INNER_APP_PATH, MOD_TEMPLATE } = require('../../consts');
const { helMonoLog, isHelExternalBuild } = require('../../util');
const r = require('../replace');

/**
 * TODO may del?
 * @param {*} masterAppData
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

function replaceAppRelevantFiles(appData, devInfo, options = {}) {
  // 在项目自身内部生成 external 相关文件
  if (isHelExternalBuild()) {
    return r.replaceIndexEXFile(appData, devInfo, options);
  }

  const { forEX, masterAppData, exAppData } = options || {};
  if (forEX) {
    // 注意：此处是使用 masterAppData 的 liftableExternals 写入到 exAppData 相关文件里
    const masterDevData = getMonoDevData(devInfo, masterAppData.appSrcDirPath, options);
    const { liftableExternals } = masterDevData;
    return r.replaceIndexEXFile(exAppData, devInfo, { ...options, liftableExternals });
  }

  r.replaceIndexFile(appData, devInfo);
  const injectedDevInfo = r.replaceDevInfo(appData, devInfo);
  r.replaceSubApp(appData);
  r.replaceDeployEnv(appData, devInfo);
  r.replaceUtil(appData, devInfo);

  return injectedDevInfo;
}

function prepareAppFiles(devInfo, appData, options = {}) {
  const { helDirPath } = appData;
  if (!fs.existsSync(helDirPath)) {
    helMonoLog('make .hel dir!');
    fs.mkdirSync(helDirPath);
  }

  helMonoLog(`copy hel template files to ${helDirPath}`);
  // 只需复制 src 目录下的文件即可
  const fromPath = path.join(HEL_TPL_INNER_APP_PATH, './src');
  if (options.forEX) {
    const indexEXFrom = path.join(fromPath, './indexEX.ts');
    const indexEXTo = path.join(helDirPath, './indexEX.ts');
    fs.cpSync(indexEXFrom, indexEXTo);
  } else {
    fs.cpSync(fromPath, helDirPath, { recursive: true });
  }

  const injectedDevInfo = replaceAppRelevantFiles(appData, devInfo, options);
  return injectedDevInfo;
}

function ensureExAppProject(devInfo, options) {
  /** @type {{masterAppData: ICWDAppData, exAppData:ICWDAppData}} */
  const { masterAppData, exAppData } = options;

  if (!fs.existsSync(exAppData.appDirPath)) {
    const options = {
      isSubMod: exAppData.isSubMod,
      keywords: [exAppData.appDir, '-n', exAppData.appPkgName, '-t', MOD_TEMPLATE.exProject],
    };
    execCreate(devInfo, options);
  }

  const newDevInfo = inferDevInfo(true);
  // 注意，此处是通过 masterAppData.appSrcDirPath 获得对应点的 external deps 对象
  const { liftableExternalDeps } = getMonoDevData(newDevInfo, masterAppData.appSrcDirPath, { appData: masterAppData, forEX: true });
  r.replaceExProjectPkgJson(exAppData, liftableExternalDeps);
  prepareAppFiles(newDevInfo, exAppData, { forEX: true, masterAppData, exAppData });

  return { devInfo: newDevInfo, appData: exAppData };
}

module.exports = {
  buildExAppData,
  ensureExAppProject,
  prepareAppFiles,
};
