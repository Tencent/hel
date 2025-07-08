const path = require('path');
const fs = require('fs');
const { createLibSubApp } = require('hel-dev-utils');
const { VER } = require('../consts');
const { getAppAlias, getCWDAppData, getMonoAppDepData, getMonoSubModSrc, helMonoLog, getCWD } = require('../util');
const { isHelMode, isHelStart, isHelAllBuild } = require('../util/is');

let cachedResult = null;

function getExtIndexData(appSrcDirPath, indexName, ext) {
  const fullPath = path.join(appSrcDirPath, `${indexName}.${ext}`);
  return { fullPath, isExist: fs.existsSync(fullPath) };
}

function getAppSrcIndex(/** @type {import('../types').ICWDAppData} */ appData) {
  let indexName = '';
  const { isForRootHelDir, appSrcDirPath } = appData;
  if (isForRootHelDir || isHelAllBuild()) {
    indexName = 'index';
  } else {
    indexName = isHelMode() ? '.hel/index' : 'index';
  }

  const exts = ['js', 'jsx', 'ts', 'tsx'];
  const indexPaths = [];
  let result = null;
  for (let i = 0; i < exts.length; i++) {
    const ext = exts[i];
    const data = getExtIndexData(appSrcDirPath, indexName, ext);
    indexPaths.push(data.fullPath);
    if (data.isExist) {
      result = data;
      break;
    }
  }

  if (!result) {
    throw new Error(`Can not find index file in this paths (${indexPaths.join(',')})`);
  }

  return result.fullPath;
}

/**
 * @returns {import('../types').IMonoDevData}
 */
exports.getMonoDevData = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo, inputAppSrc) {
  let rawAppSrc = inputAppSrc;
  if (!rawAppSrc) {
    rawAppSrc = path.join(getCWD(), './src');
  }

  if (cachedResult) {
    helMonoLog(`get cached monoDevData for ${rawAppSrc}`);
    return cachedResult;
  }

  const start = Date.now();
  helMonoLog(`(ver:${VER}) prepare hel dev data for ${rawAppSrc}`);
  let appSrc = rawAppSrc;
  const appData = getCWDAppData(devInfo);

  // 支持宿主和子模块的 jsx tsx 语法都能够正常识别
  const babelLoaderInclude = [appSrc];
  const { appExternals } = devInfo;

  // 启动的是代理目录，需将 appSrc 指向真正的项目 src 目录
  if (appData.isForRootHelDir) {
    appSrc = appData.realAppSrcDirPath;
    babelLoaderInclude.push(appSrc);
  }

  let isMicroBuild;
  let shouldGetAllDep;
  // 设定了 HEL_ALL_BUILD=1，表示走整体构建模式
  if (isHelAllBuild()) {
    isMicroBuild = false;
    shouldGetAllDep = true;
  } else {
    // start xx:proxy 或 start xx:hel 模式启动
    isMicroBuild = appData.isForRootHelDir || isHelMode();
    // hel 模式启动或构建，只需要获取直接依赖即可，反之则需要获取所有依赖
    shouldGetAllDep = !isMicroBuild;
  }

  const { pkgNames, prefixedDir2Pkg, depInfos, pkg2Info } = getMonoAppDepData(appSrc, devInfo, shouldGetAllDep);
  helMonoLog(`isMicroBuild=${isMicroBuild}`);
  helMonoLog('dep pack names', pkgNames);

  // 支持宿主和其他子模块 @/**/*, @xx/**/* 等能够正常工作
  const appAlias = getAppAlias(appSrc, devInfo, prefixedDir2Pkg);
  const pureAlias = Object.assign({}, appAlias);

  if (!isMicroBuild) {
    depInfos.forEach((info) => {
      const { pkgName, belongTo, dirName } = info;
      const subModSrcPath = getMonoSubModSrc(belongTo, dirName);
      babelLoaderInclude.push(subModSrcPath);

      const appConf = devInfo.appConfs[pkgName];
      if (!appConf) {
        return;
      }
      const { alias } = appConf;
      if (alias) {
        appAlias[alias] = subModSrcPath;
        pureAlias[alias] = subModSrcPath;
      }
    });
  } else {
    depInfos.forEach((info) => {
      const { pkgName, belongTo, dirName } = info;
      const subModSrcPath = getMonoSubModSrc(belongTo, dirName);
      babelLoaderInclude.push(subModSrcPath);

      const { proxySrcPath, proxyPkgName } = pkg2Info[pkgName] || {};
      if (proxySrcPath) {
        babelLoaderInclude.push(proxySrcPath);
        appAlias[pkgName] = proxyPkgName;
      }

      const appConf = devInfo.appConfs[pkgName];
      if (!appConf) {
        return;
      }

      // start:hel 或 build:hel，应用中引用的大仓 packages 依赖指向和项目在一起的 hel 代理入口
      if (isHelMode()) {
        appAlias[pkgName] = `${pkgName}/hel`;
      }

      const { alias } = appConf;
      if (alias) {
        appAlias[alias] = subModSrcPath;
        pureAlias[alias] = subModSrcPath;
      }
    });
  }

  // 提供给jest使用的单测别名
  const jestAlias = {};
  Object.keys(pureAlias).forEach((key) => {
    jestAlias[`^${key}/(.*)$`] = `${pureAlias[key]}/$1`;
  });

  const appPkgJson = require(appData.realAppPkgJsonPath);
  const appInfo = createLibSubApp(appPkgJson, { platform: devInfo.platform });
  const appSrcIndex = getAppSrcIndex(appData);
  let appPublicUrl = '';
  const isHelModeVar = isHelMode();
  if (isHelModeVar) {
    appPublicUrl = isHelStart() ? `${appData.appPublicUrl}/` : appInfo.getPublicPathOrUrl(appData.appPublicUrl);
  }

  helMonoLog('isHelMode', isHelModeVar);
  helMonoLog('appSrcIndex ', appSrcIndex);
  helMonoLog('appPublicUrl ', appPublicUrl);
  helMonoLog('babel loader include', babelLoaderInclude);
  helMonoLog('app alias', appAlias);
  helMonoLog('jest alias', jestAlias);
  helMonoLog(`getMonoDevData costs ${Date.now() - start} ms`);

  cachedResult = {
    babelLoaderInclude,
    appAlias,
    jestAlias,
    appExternals,
    appInfo,
    appData,
    appPublicUrl,
    appPkgJson,
    appSrcIndex,
    resolveMonoRoot: (relativePath) => path.resolve(appData.monoRoot, relativePath),
  };
  return cachedResult;
};
