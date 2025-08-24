const path = require('path');
const fs = require('fs');
const { createLibSubApp } = require('hel-dev-utils');
const { VER } = require('../consts');
const { getCWDAppData, getMonoSubModSrc, helMonoLog, getCWD } = require('../util');
const { buildAppAlias, inferConfAlias } = require('../util/appSrc');
const { getMonoAppDepDataImpl } = require('../util/depData');
const { isHelMicroMode, isHelMode, isHelStart, isHelAllBuild } = require('../util/is');
const { getMonoNameMap } = require('../util/monoName');
const { getLogTimeLine } = require('../util/time');

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
    indexName = isHelMicroMode() ? '.hel/index' : 'index';
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

function getPkgLogInfo(info, isForRootHelDir) {
  if (isForRootHelDir) {
    return info;
  }
  const { proxyPkgName, proxySrcPath, ...rest } = info;
  return rest;
}

/**
 * @returns {import('../types').IPkgMonoDepData | null}
 */
exports.getPkgMonoDepData = function (/** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo, pkgName) {
  const nameMap = getMonoNameMap(devInfo);
  const { monoDep } = nameMap;
  return monoDep.depData[pkgName] || null;
};

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

  helMonoLog(getLogTimeLine());
  const start = Date.now();
  helMonoLog(`(ver:${VER}) prepare hel dev data for ${rawAppSrc}`);
  let appSrc = rawAppSrc;
  const appData = getCWDAppData(devInfo);
  const { isForRootHelDir, appTsConfigPaths } = appData;
  helMonoLog('isForRootHelDir ', isForRootHelDir);

  // 支持宿主和子模块的 jsx tsx 语法都能够正常识别
  const babelLoaderInclude = [appSrc];
  const { appExternals } = devInfo;

  // 启动的是代理目录，需将 appSrc 指向真正的项目 src 目录
  if (isForRootHelDir) {
    appSrc = appData.realAppSrcDirPath;
    babelLoaderInclude.push(appSrc);
  }

  let isMicroStartOrBuild;
  let shouldGetAllDep;
  // 设定了 process.env.HEL_BUILD = cst.HEL_ALL_BUILD ，表示走整体构建模式
  if (isHelAllBuild()) {
    isMicroStartOrBuild = false;
    shouldGetAllDep = true;
  } else {
    // start xx:proxy 或 start xx:hel 模式启动
    isMicroStartOrBuild = isForRootHelDir || isHelMicroMode();
    // hel 模式启动或构建，只需要获取直接依赖即可，反之则需要获取所有依赖
    shouldGetAllDep = !isMicroStartOrBuild;
  }

  const { pkgNames, prefixedDir2Pkg, depInfos, pkg2Info } = getMonoAppDepDataImpl({
    appSrc,
    devInfo,
    isAllDep: shouldGetAllDep,
    isForRootHelDir,
  });
  helMonoLog('isMicroBuild ', isMicroStartOrBuild);
  helMonoLog('dep pack names', pkgNames);

  // 支持宿主和其他子模块 @/**/*, @xx/**/* 等能够正常工作
  const appAlias = buildAppAlias(appSrc, devInfo, prefixedDir2Pkg);
  const pureAlias = Object.assign({}, appAlias);

  if (!isMicroStartOrBuild) {
    depInfos.forEach((info) => {
      const { pkgName, belongTo, dirName } = info;
      const subModSrcPath = getMonoSubModSrc(belongTo, dirName);
      babelLoaderInclude.push(subModSrcPath);

      const appConf = devInfo.appConfs[pkgName];
      if (!appConf) {
        return;
      }

      const alias = inferConfAlias(subModSrcPath, appConf, pkgName);
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
      const pkgInfo = pkg2Info[pkgName] || {};

      const { proxySrcPath, proxyPkgName, alias: inferAlias, appSrcPath } = pkgInfo;
      helMonoLog(`dep ${pkgName} info`, getPkgLogInfo(pkgInfo, isForRootHelDir));
      if (isForRootHelDir) {
        if (proxySrcPath) {
          babelLoaderInclude.push(proxySrcPath);
          appAlias[pkgName] = proxyPkgName;
        }
      } else {
        if (inferAlias) {
          appAlias[inferAlias] = appSrcPath;
          pureAlias[inferAlias] = appSrcPath;
        }
      }

      // 将大仓里的其他子模块依赖的 paths 合并起来，交给外部注入到 ForkTsCheckerWebpackPlugin 参数里
      // 避免启动主应用时报错：Cannot find module '@xx/yy/...' or its corresponding type declaration.
      if (inferAlias) {
        const aliasKey = `${inferAlias}/*`;
        if (appTsConfigPaths[aliasKey]) {
          throw new Error(`alias ${inferAlias} duplicated, please check.`);
        }
        appTsConfigPaths[aliasKey] = [`${appSrcPath}/*`];
      }

      // start:hel 或 build:hel，应用中引用的大仓 packages 依赖指向和项目在一起的 hel 代理入口
      if (isHelMicroMode()) {
        appAlias[pkgName] = `${pkgName}/hel`;
      }

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
  }

  // 提供给jest使用的单测别名
  const jestAlias = {};
  Object.keys(pureAlias).forEach((key) => {
    jestAlias[`^${key}/(.*)$`] = `${pureAlias[key]}/$1`;
  });

  const appPkgJson = require(appData.realAppPkgJsonPath);
  const appInfo = createLibSubApp(appPkgJson, { platform: devInfo.platform });
  const appSrcIndex = getAppSrcIndex(appData);
  let appPublicUrl = `${appData.appPublicUrl}/`;
  const isHelModeVar = isHelMode();
  if (isHelModeVar) {
    appPublicUrl = isHelStart() ? `${appData.appPublicUrl}/` : appInfo.getPublicPathOrUrl(appData.appPublicUrl);
    if (appInfo.homePage !== appPublicUrl) {
      appInfo.homePage = appPublicUrl;
    }
  } else {
    // 非 hel 脚本触发，以 appInfo.homePage 为准
    appPublicUrl = appInfo.homePage;
  }

  helMonoLog('isHelMode ', isHelModeVar);
  helMonoLog('appSrcIndex ', appSrcIndex);
  helMonoLog('appPublicUrl ', appPublicUrl);
  helMonoLog('appTsConfigPaths', appTsConfigPaths);
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
    appTsConfigPaths,
    resolveMonoRoot: (relativePath) => path.resolve(appData.monoRoot, relativePath),
  };
  return cachedResult;
};
