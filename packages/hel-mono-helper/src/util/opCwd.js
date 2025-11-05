/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const path = require('path');
const { getTsConfigDirPathByAppSrc } = require('./appSrc');
const { getTsConfigPaths } = require('./alias');
const { getCWD, getFileJson, getDevInfoDirs } = require('./base');
const { HEL_DIR_NAME, HOST_NAME } = require('../consts');
const { inferDirData } = require('./cwd');
const { helMonoLog, getCurAppData, setCurAppData } = require('./log');
const { getMonoRootInfo } = require('./rootInfo');
const { getPortByDevInfo, mayAddPort } = require('./port');

/**
 * 通过分析 cwd 获取应用目录
 * @return {import('../types').ICWDAppData}
 */
function getCWDAppData(/** @type {IDevInfo} */ devInfo, inputCwd) {
  const curAppData = getCurAppData();
  if (!inputCwd && curAppData) {
    return curAppData;
  }

  const cwd = inputCwd || getCWD();
  helMonoLog(`\n${new Date().toLocaleString()}`);
  helMonoLog('process.argv:', process.argv);
  helMonoLog(`app data cwd: ${cwd}`);
  const { monoRootHelDir, monoRoot } = getMonoRootInfo();
  const { subModDirs } = getDevInfoDirs(devInfo);

  const isForRootHelDir = cwd.includes(monoRootHelDir);
  const { belongTo, dirName: appDir } = inferDirData(devInfo, cwd);
  const isSubMod = subModDirs.includes(belongTo);

  const root = isForRootHelDir ? monoRootHelDir : monoRoot;
  const belongToDirPath = path.join(root, `./${belongTo}`);
  const appDirPath = path.join(belongToDirPath, `./${appDir}`);
  const appPkgJsonPath = path.join(appDirPath, './package.json');
  const appSrcDirPath = path.join(appDirPath, './src');
  const helDirPath = isForRootHelDir ? appSrcDirPath : path.join(appSrcDirPath, `./${HEL_DIR_NAME}`);
  let appPkgName = '';
  try {
    const appPkgJson = getFileJson(appPkgJsonPath);
    appPkgName = appPkgJson.name;
  } catch (err) {
    // assign appPkgName later
  }

  const tsConfigDirPath = getTsConfigDirPathByAppSrc(appSrcDirPath);
  const appTsConfigPaths = getTsConfigPaths(tsConfigDirPath);
  const realAppDirPath = path.join(monoRoot, `./${belongTo}/${appDir}`);
  const realAppSrcDirPath = path.join(realAppDirPath, './src');
  const realAppPkgJsonPath = path.join(realAppDirPath, './package.json');
  const realAppPkgJson = getFileJson(realAppPkgJsonPath);
  const realAppPkgName = realAppPkgJson.name;

  const defaultDevHostName = devInfo.devHostname || HOST_NAME;
  const { port = getPortByDevInfo(devInfo, isSubMod), devHostname = defaultDevHostName } = devInfo.appConfs[realAppPkgName] || {};
  let appPublicUrl = `${devHostname}:${mayAddPort(port)}`;

  // 很重要，避免本地开发式出现 webpack 找不到资源的情况出现
  // appPublicUrl 设置绝对路径是为了本地开发时，html 文档树上的资源都是带域名的，
  // 生成资源形如 localhost:3000/static/js/xx.js 而非 /static/js/xx.js，后者在微模块模式下不能被宿主正常加载
  if (!appPublicUrl.startsWith('http')) {
    appPublicUrl = `http://${appPublicUrl}`;
  }

  const appData = {
    isForRootHelDir,
    isSubMod,
    belongTo,
    helDirPath,
    rootHelDirPath: monoRootHelDir,
    appDir,
    appDirPath,
    appSrcDirPath,
    appTsConfigPaths,
    appPkgName,
    belongToDirPath,
    realAppDirPath,
    realAppSrcDirPath,
    realAppPkgJsonPath,
    realAppPkgName,
    appPublicUrl,
    monoRoot,
  };

  if (!inputCwd) {
    setCurAppData(appData);
  }

  return appData;
}

module.exports = {
  getCWDAppData,
};
