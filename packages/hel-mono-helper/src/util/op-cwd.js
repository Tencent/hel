const path = require('path');
const { getCWD, getDevInfoDirs, getPkgjson } = require('./base');
const { HEL_DIR_NAME, HOST_NAME } = require('../consts');
const { helMonoLog, getCurAppData, setCurAppData } = require('./log');
const { getMonoRootInfo } = require('./root-info');

/**
 * 通过分析 cwd 获取应用目录
 * @return {import('../types').ICWDAppData}
 */
exports.getCWDAppData = function (/** @type {import('hel-mono-types').IMonoDevInfo} */devInfo, inputCwd) {
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
  const list = cwd.split(path.sep);
  const len = list.length;
  const belongTo = list[len - 2];
  const appDir = list[len - 1];
  const isSubMod = subModDirs.includes(belongTo);

  const root = isForRootHelDir ? monoRootHelDir : monoRoot;
  const belongToDirPath = path.join(root, `./${belongTo}`);
  const appDirPath = path.join(belongToDirPath, `./${appDir}`);
  const appPackjsonPath = path.join(appDirPath, './package.json');
  const appSrcDirPath = path.join(appDirPath, './src');
  const helDirPath = isForRootHelDir ? appSrcDirPath : path.join(appSrcDirPath, `./${HEL_DIR_NAME}`);
  let appPkgName = '';
  try {
    const appPkgJson = getPkgjson(appPackjsonPath);
    appPkgName = appPkgJson.name;
  } catch (err) {
    // assign appPkgName later
  }

  const realAppDirPath = path.join(monoRoot, `./${belongTo}/${appDir}`);
  const realAppSrcDirPath = path.join(realAppDirPath, './src');
  const realAppPkgJsonPath = path.join(realAppDirPath, './package.json');
  const realAppPkgJson = getPkgjson(realAppPkgJsonPath);
  const realAppPkgName = realAppPkgJson.name;

  const defaultDevHostName = devInfo.devHostname || HOST_NAME;
  const { port = 3000, devHostname = defaultDevHostName } = devInfo.appConfs[realAppPkgName] || {};
  const appPublicUrl = `${devHostname}:${port}`;

  const appData = {
    isForRootHelDir,
    isSubMod,
    belongTo,
    helDirPath,
    rootHelDirPath: monoRootHelDir,
    appDir,
    appDirPath,
    appSrcDirPath,
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
};
