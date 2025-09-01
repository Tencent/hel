const path = require('path');

function getMasterAppPrefixedDir(exPrefixedDir) {
  if (exPrefixedDir.endsWith('-ex')) {
    return exPrefixedDir.substring(0, exPrefixedDir.length - 3);
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
};
