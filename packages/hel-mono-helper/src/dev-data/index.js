/** @typedef {import('../types').IMonoDevInfo} DevInfo */
/** @typedef {import('../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../types').IInnerPkgInfo} IInnerPkgInfo */
/** @typedef {import('../types').IGetAppExternalsOptions} IGetAppExternalsOptions */
const path = require('path');
const fs = require('fs');
const { createLibSubApp, baseUtils } = require('hel-dev-utils-base');
const { VER } = require('../consts');
const { BASE_EXTERNALS } = require('../consts/inner');
const replaceExHtmlContent = require('../entry/replace/replaceExHtmlContent');
const { getCWDAppData, getMonoSubModSrc, helMonoLog, getCWD, isFastRefreshMarked } = require('../util');
const { clone, chooseBool, mayInclude, isDictNull } = require('../util/dict');
const { buildAppAlias, inferConfAlias, getAppCwd } = require('../util/appSrc');
const { getMonoAppDepDataImpl } = require('../util/depData');
const { getIsEnableRepoEx } = require('../util/devInfo');
const { inferMonoDepDict } = require('../util/monoJson');
const { getMonoAppPkgJson, isEXProject, getExternalBoundName } = require('../util/monoPkg');
const { isHelMicroMode, isHelMode, isHelStart, isHelAllBuild, isHelExternalBuild } = require('../util/is');
const { getLogTimeLine } = require('../util/time');

const cachedResult = {};

function getExtIndexData(appSrcDirPath, indexName, ext) {
  const extFileName = `${indexName}.${ext}`;
  const fullPath = path.join(appSrcDirPath, extFileName);
  return { fullPath, isExist: fs.existsSync(fullPath), extFileName };
}

function getAppSrcIndex(/** @type {ICWDAppData} */ appData, allowEmptySrcIndex) {
  let indexName = '';
  const { isForRootHelDir, appDir, belongTo } = appData;
  let { appSrcDirPath } = appData;
  const pkg = getMonoAppPkgJson(appDir, belongTo);
  const { isEX } = pkg.hel || {};

  if (isEX) {
    indexName = '.hel/indexEX';
  } else if (isForRootHelDir) {
    indexName = 'index';
  } else if (isHelAllBuild()) {
    indexName = '.hel/index';
  } else if (isHelExternalBuild()) {
    indexName = '.hel/indexEX';
  } else {
    indexName = isHelMicroMode() ? '.hel/index' : 'index';
  }

  const exts = ['js', 'jsx', 'ts', 'tsx'];
  const indexNames = [];
  let result = null;
  for (let i = 0; i < exts.length; i++) {
    const ext = exts[i];
    const data = getExtIndexData(appSrcDirPath, indexName, ext);
    indexNames.push(data.extFileName);
    if (data.isExist) {
      result = data;
      break;
    }
  }

  if (!result) {
    if (allowEmptySrcIndex) {
      return '';
    }
    throw new Error(`Can not find index file with names(${indexNames}) under dir ${appSrcDirPath}`);
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
 * 将大仓里的其他子模块依赖的 paths 合并起来，交给外部注入到 ForkTsCheckerWebpackPlugin 参数里
 * 避免启动主应用时报错：Cannot find module '@xx/yy/...' or its corresponding type declaration.} pkgInfo
 */
function maySetAppTsConfigPaths(/** @type DevInfo */ devInfo, /** @type IInnerPkgInfo */ pkgInfo, appTsConfigPaths) {
  const { alias, appSrcPath } = pkgInfo;
  if (!alias) {
    return;
  }
  // 可能是在 tsconfigJson.paths 里为 external 库设置类型路径
  if (devInfo.customExternals[alias]) {
    return;
  }

  const aliasKey = `${alias}/*`;
  if (appTsConfigPaths[alias]) {
    throw new Error(`found tsconfig.json alias ${alias} duplicated while handle ${appSrcPath}, please check workspace sub deps.`);
  }
  appTsConfigPaths[aliasKey] = [`${appSrcPath}/*`];
}

function getAppExternals(/** @type {IGetAppExternalsOptions} */ options) {
  const { appData, devInfo, depInfos, isCurProjectEx } = options;
  const { customExternals = {}, baseExternals = {} } = devInfo;

  // devInfo.customExternals 对 ex 项目自身无效，走内置的 BASE_EXTERNALS
  if (isCurProjectEx) {
    return BASE_EXTERNALS;
  }
  const mayMergeLiftableExternals = (target) => {
    const isEnableRepoEx = getIsEnableRepoEx(appData.appPkgName, devInfo);
    // 开启了 enableRepoEx 功能，需要将推导出来的 liftableExternals 对象合并
    const liftableExternals = isEnableRepoEx ? options.liftableExternals : {};
    return Object.assign({}, baseExternals, target, liftableExternals);
  };

  // react fast refresh 会在 react 使用外部资源时失效
  // 当用户明确开启了 -fr 标识且以 hel 模式运行，同时存在本仓的多个子依赖时，为保证 fr 体验，剔除掉相关外部资源配置
  if (isFastRefreshMarked() && !appData.isSubMod && depInfos.length > 0) {
    const newExternals = {};
    const rLibs = ['react', 'react-dom', 'react-is', 'react-reconciler'];
    Object.keys(customExternals).forEach((key) => {
      if (!rLibs.includes(key)) {
        newExternals[key] = customExternals[key];
      }
    });
    return mayMergeLiftableExternals(newExternals);
  }

  return mayMergeLiftableExternals(customExternals);
}

function getAppInfo(/** @type DevInfo */ devInfo, appPkgJson) {
  const { platform, deployPath, appConfs } = devInfo;
  const appConf = appConfs[appPkgJson.name];
  const homePage = appConf.deployPath || deployPath;
  const handleHomePage = chooseBool([appConf.handleDeployPath, devInfo.handleDeployPath], true);
  const appInfo = createLibSubApp(appPkgJson, { platform, homePage, handleHomePage });

  return appInfo;
}

function getExLabel(/** @type {{devInfo: DevInfo}} */ options) {
  const { devInfo, isCurProjectEx, liftableExternals } = options;
  const { baseExternals, customExternals, enableRepoEx } = devInfo;
  const hasCustEx = !isDictNull(customExternals);
  const hasLiftEx = !isDictNull(liftableExternals);
  const hasBaseEx = !isDictNull(baseExternals);
  if (isCurProjectEx) {
    return hasCustEx ? 'appExternals (merged by baseExternals, customExternals)' : 'appExternals';
  }

  const custExLabel = hasCustEx ? 'customExternals' : '';
  const liftExLabel = hasLiftEx ? 'liftableExternals' : '';
  const baseExLabel = hasBaseEx ? 'baseExternals' : '';
  if (enableRepoEx) {
    const validLabels = [custExLabel, liftExLabel, baseExLabel].filter((v) => !!v);
    return validLabels.length ? `appExternals (merged by ${validLabels.join(',')})` : 'appExternals';
  }

  const validLabels = [custExLabel, baseExLabel].filter((v) => !!v);
  return validLabels.length ? `appExternals (merged by ${validLabels.join(',')})` : 'appExternals';
}

/**
 * @returns {import('../types').IPkgMonoDepData | null}
 */
exports.getPkgMonoDepData = function (pkgName) {
  const dict = inferMonoDepDict();
  return dict[pkgName] || null;
};

/**
 * @returns {import('../types').DepDataDict}
 */
exports.getPkgMonoDepDataDict = function () {
  const dict = inferMonoDepDict();
  return dict;
};

/**
 * @returns {import('../types').IMonoDevData}
 */
exports.getMonoDevData = function (/** @type DevInfo */ devInfo, inputAppSrc, options = {}) {
  let targetAppSrc = inputAppSrc;
  if (!targetAppSrc) {
    targetAppSrc = path.join(getCWD(), './src');
  }
  const appCwd = getAppCwd(targetAppSrc);
  const { forEX } = options;
  const isCurProjectEx = isEXProject(targetAppSrc);
  // 当前项目是 ex 项目或需要为 ex 项目服务
  const isExProjOrSrvForEx = isCurProjectEx || forEX;
  const isAllOrExBuildMode = isHelAllBuild() || isHelExternalBuild();
  const needAllDep = isAllOrExBuildMode || isExProjOrSrvForEx;

  const key = `${targetAppSrc}_${needAllDep}`;
  if (cachedResult[key]) {
    helMonoLog(`get cached monoDevData for ${targetAppSrc} with needAllDep ${needAllDep}`);
    return cachedResult[targetAppSrc];
  }

  helMonoLog(getLogTimeLine());
  const start = Date.now();
  helMonoLog(`(ver:${VER}) prepare hel dev data for ${targetAppSrc}`);
  let appSrc = targetAppSrc;
  /** @type {ICWDAppData} */
  const appData = options.appData || getCWDAppData(devInfo, appCwd);
  const { isForRootHelDir } = appData;
  const appTsConfigPaths = clone(appData.appTsConfigPaths);

  // 支持宿主和子模块的 jsx tsx 语法都能够正常识别
  const babelLoaderInclude = [appSrc];
  const { exclude = [], nmExclude = [], nmInclude = [], baseExternals, customExternals } = devInfo;

  // 启动的是代理目录，需将 appSrc 指向真正的项目 src 目录
  if (isForRootHelDir) {
    appSrc = appData.realAppSrcDirPath;
    babelLoaderInclude.push(appSrc);
  }

  let isMicroStartOrBuild;
  let shouldGetAllDep;
  // 设定了 process.env.HEL_BUILD = cst.HEL_ALL_BUILD ，表示走整体构建模式
  if (isAllOrExBuildMode || isExProjOrSrvForEx) {
    isMicroStartOrBuild = false;
    shouldGetAllDep = true;
  } else {
    // start xx:hel 模式启动
    isMicroStartOrBuild = isForRootHelDir || isHelMicroMode();
    // hel 模式启动或构建，只需要获取直接依赖即可，反之则需要获取所有依赖
    shouldGetAllDep = !isMicroStartOrBuild;
  }
  const isHelModeVar = isHelMode();
  const shouldComputeRepoExternals = isHelModeVar || isExProjOrSrvForEx;

  const { pkgNames, prefixedDir2Pkg, depInfos, pkg2Info, nmHelPkgNames, nmL1ExternalPkgNames, nmL1ExternalDeps, pkg2CanBeExternals } =
    getMonoAppDepDataImpl({
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
  const liftableExternals = {};

  if (shouldComputeRepoExternals && nmL1ExternalPkgNames.length) {
    nmL1ExternalPkgNames.forEach((v) => (liftableExternals[v] = getExternalBoundName(v)));
  }

  const { appHtml, rawAppHtml } = replaceExHtmlContent({
    nmL1ExternalPkgNames,
    nmL1ExternalDeps,
    appData,
    devInfo,
    isCurProjectEx,
    pkg2CanBeExternals,
  });
  if (!isMicroStartOrBuild) {
    depInfos.forEach((info) => {
      const { pkgName, belongTo, dirName } = info;
      const subModSrcPath = getMonoSubModSrc(belongTo, dirName);
      babelLoaderInclude.push(subModSrcPath);

      const appConf = devInfo.appConfs[pkgName];
      if (!appConf) {
        return;
      }

      const alias = inferConfAlias(devInfo, { appSrc: subModSrcPath, appConf, pkgName });
      if (alias) {
        appAlias[alias] = subModSrcPath;
        pureAlias[alias] = subModSrcPath;
      }

      const pkgInfo = pkg2Info[pkgName] || {};
      maySetAppTsConfigPaths(devInfo, pkgInfo, appTsConfigPaths);
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

      maySetAppTsConfigPaths(devInfo, pkgInfo, appTsConfigPaths);
      // start:hel 或 build:hel，应用中引用的大仓 packages 依赖指向和项目在一起的 hel 代理入口
      if (isHelMicroMode() && !mayInclude(exclude, pkgName)) {
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

    // 来自 node_modules 的 hel 模块，如显式包含且没有排除的话，会自动加入微模块构建模式
    nmHelPkgNames.forEach((nmHelPkgName) => {
      if (isHelMicroMode() && mayInclude(nmInclude, nmHelPkgName) && !mayInclude(nmExclude, nmHelPkgName)) {
        appAlias[nmHelPkgName] = `${nmHelPkgName}/hel`;
      }
    });
  }

  // 提供给 jest 使用的单测别名
  const jestAlias = {};
  Object.keys(pureAlias).forEach((key) => {
    jestAlias[`^${key}/(.*)$`] = `${pureAlias[key]}/$1`;
  });

  const appPkgJson = require(appData.realAppPkgJsonPath);
  const appInfo = getAppInfo(devInfo, appPkgJson);
  const appSrcIndex = getAppSrcIndex(appData, devInfo.allowEmptySrcIndex);
  const devPublicUrl = baseUtils.slash.noEnd(appData.appPublicUrl);

  let appPublicUrl = `${devPublicUrl}/`;
  if (isHelModeVar) {
    appPublicUrl = isHelStart() ? `${devPublicUrl}/` : appInfo.getPublicPathOrUrl(devPublicUrl);
    if (appInfo.homePage !== appPublicUrl) {
      appInfo.homePage = appPublicUrl;
    }
  } else {
    const isDev = process.env.NODE_ENV === 'development';
    // 非 hel 脚本触发，本地开发以 appPublicUrl 为准，打包则以 appInfo.homePage 为准
    appPublicUrl = baseUtils.slash.end(isDev ? appPublicUrl : appInfo.homePage);
  }

  const appExternals = getAppExternals({ appData, devInfo, depInfos, isCurProjectEx, liftableExternals });
  const exLabel = getExLabel({ devInfo, isCurProjectEx, liftableExternals });

  helMonoLog('isHelMode ', isHelModeVar);
  helMonoLog('appSrcIndex ', appSrcIndex);
  helMonoLog('appPublicUrl ', appPublicUrl);
  helMonoLog('appHtml ', appHtml);
  helMonoLog('appTsConfigPaths', appTsConfigPaths);
  helMonoLog('babelLoaderInclude', babelLoaderInclude);
  helMonoLog(exLabel, appExternals);
  helMonoLog('appAlias', appAlias);
  helMonoLog('jestAlias', jestAlias);
  helMonoLog(`getMonoDevData costs ${Date.now() - start} ms`);

  cachedResult[appSrc] = {
    babelLoaderInclude,
    appAlias,
    jestAlias,
    appExternals,
    baseExternals,
    customExternals,
    liftableExternals,
    liftableExternalDeps: nmL1ExternalDeps,
    appInfo,
    appData,
    appPublicUrl,
    appPkgJson,
    appSrcIndex,
    appTsConfigPaths,
    rawAppHtml,
    appHtml,
    resolveMonoRoot: (relativePath) => path.resolve(appData.monoRoot, relativePath),
  };

  const devData = cachedResult[appSrc];
  return devData;
};
