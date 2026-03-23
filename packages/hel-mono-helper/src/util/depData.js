/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const path = require('path');
const { PKG_NAME_WHITE_LIST } = require('../consts/inner');
const { noDupPushWithCb, noDupPush } = require('./arr');
const { getAppBelongTo, getAppDirPath } = require('./appSrc');
const { getDirName, getDevInfoDirs } = require('./base');
const { mayInclude, safeGet } = require('./dict');
const { getMonoNameMap } = require('./monoName');
const { getMonoAppPkgJson } = require('./monoPkg');
const { getNmPkgJson } = require('./nmPkg');
const { getMonoRootInfo } = require('./rootInfo');

function isTypePkg(nmPkgName) {
  return nmPkgName.startsWith('@types/');
}

function getPkgData(nmPkgName, allowInvalidName = true) {
  const { pkgJson, isValid } = getNmPkgJson(nmPkgName, allowInvalidName);
  const pkgExports = pkgJson.exports || {};
  const pkgHelEntry = pkgExports['./hel'];
  return { hasHelExports: !!pkgHelEntry, pkgHel: pkgJson.hel || {}, pkgJson, isValid };
}

function logMonoDep(isForRootHelDir, options) {
  const { isAllDep, monoDep } = options;
  const { monoDepJson } = getMonoRootInfo();
  const getLogData = (data) => {
    if (!isForRootHelDir) {
      const { proxyPkgName, proxySrcPath, ...rest } = data;
      return rest;
    }
    return data;
  };

  if (isAllDep) {
    if (isForRootHelDir) {
      fs.writeFileSync(monoDepJson, JSON.stringify(monoDep, null, 2));
    } else {
      const { depData } = monoDep;
      const shallowCopy = { ...monoDep };
      const newDepData = {};
      shallowCopy.depData = newDepData;
      Object.keys(depData).forEach((pkgName) => {
        newDepData[pkgName] = getLogData(depData[pkgName]);
      });
      fs.writeFileSync(monoDepJson, JSON.stringify(shallowCopy, null, 2));
    }
    return;
  }
}

function getMonoAppDepDataImpl(options) {
  /** @type {{devInfo: IDevInfo}} */
  const { appSrc, devInfo, isAllDep = false, isForRootHelDir } = options;
  const belongTo = getAppBelongTo(appSrc);
  const dirName = getDirName(appSrc);
  const json = getMonoAppPkgJson(dirName, belongTo);
  const { belongToDirs } = getDevInfoDirs(devInfo);
  const nameMap = getMonoNameMap(devInfo);
  const appDirPath = getAppDirPath(appSrc);
  const { pkg2Deps, pkg2BelongTo, pkg2Dir, pkg2AppDirPath, monoDep } = nameMap;
  const baseExternals = devInfo.baseExternals || {};
  const customExternals = devInfo.customExternals || {};
  const externalsExclude = devInfo.externalsExclude || [];

  const pkgNames = [];
  const depInfos = [];
  // isAllDep=false时，当前项目对应的直接大仓依赖（即 workspace: 开头的依赖）
  // isAllDep=true时，当前项目对应的直接大仓依赖+间接大仓依赖
  const loopDeps = [];

  // 当前项目自身对应的所有可提升为外部资源的第一层 node_modules 包
  // isAllDep=true时，还包含当前项目的直接、间接大仓依赖里的第一层 node_modules 包
  const nmL1ExternalPkgNames = [];
  const nmL1ExternalDeps = {}; // nmL1ExternalPkgNames 包名和语义版本字典
  /** @type {Record<string, { semVers: string[], pkgPaths: string[] }>} */
  const nmL1ExternalDepData = {};
  const nmPkgNames = []; // 来自 node_modules 的包名
  const nmLoopDeps = [];
  const nmPkg2HelConf = {};
  // 这些包是非大仓（即node_modules）的 hel 包
  const nmHelPkgNames = [];

  const handleNmLoopAssocData = (pkgName) => {
    if (!PKG_NAME_WHITE_LIST.includes(pkgName) && !mayInclude(devInfo.nmExclude, pkgName)) {
      noDupPushWithCb(nmPkgNames, pkgName, () => {
        nmLoopDeps.push(pkgName);
      });
    }
  };

  const handleL1PkgName = (appDirPath, pkgName, semVer) => {
    if (PKG_NAME_WHITE_LIST.includes(pkgName) || baseExternals[pkgName] || customExternals[pkgName] || externalsExclude.includes(pkgName)) {
      return;
    }
    noDupPush(nmL1ExternalPkgNames, pkgName);
    nmL1ExternalDeps[pkgName] = semVer;
    const pkgPath = path.join(appDirPath, `./node_modules/${pkgName}`);
    const data = safeGet(nmL1ExternalDepData, pkgName, { semVers: [], pkgPaths: [] });
    noDupPush(data.semVers, semVer);
    noDupPush(data.pkgPaths, pkgPath);
  };

  const pushToDeps = ({ deps, appDirPath }) => {
    Object.keys(deps).forEach((pkgName) => {
      if (isTypePkg(pkgName)) {
        return;
      }
      const semVer = deps[pkgName];
      if (semVer.startsWith('workspace:')) {
        const belongTo = pkg2BelongTo[pkgName];
        if (!belongToDirs.includes(belongTo)) {
          return;
        }
        noDupPushWithCb(pkgNames, pkgName, () => {
          loopDeps.push(pkgName);
          depInfos.push({ pkgName, belongTo, dirName: pkg2Dir[pkgName] });
        });
        return;
      }

      const pkgData = getPkgData(pkgName, false);
      if (pkgData.hasHelExports) {
        noDupPush(nmHelPkgNames, pkgName);
        handleNmLoopAssocData(pkgName, appDirPath);
      } else {
        handleL1PkgName(appDirPath, pkgName, semVer);
      }
    });
  };

  const nmPushToDeps = (nmPkgName) => {
    if (isTypePkg(nmPkgName)) {
      return;
    }
    const { isValid, hasHelExports, pkgJson, pkgHel } = getPkgData(nmPkgName, true);
    let depObj = null;
    if (isValid) {
      if (hasHelExports) {
        noDupPush(nmHelPkgNames, nmPkgName);
      }
      depObj = pkgJson.dependencies || {};
      nmPkg2HelConf[nmPkgName] = pkgHel;
    }

    if (!depObj) {
      return;
    }

    Object.keys(depObj).forEach((pkgName) => {
      handleNmLoopAssocData(pkgName);
    });
  };

  // 添加直接依赖
  pushToDeps({ deps: json.dependencies || {}, appDirPath });
  // 添加间接依赖
  if (isAllDep) {
    // 先处理大仓依赖
    while (loopDeps.length) {
      const tmpDeps = loopDeps.slice();
      loopDeps.length = 0; // 清空间接依赖
      tmpDeps.forEach((name) => {
        pushToDeps({ deps: pkg2Deps[name] || {}, appDirPath: pkg2AppDirPath[name] });
      }); // 添加新的间接依赖
    }

    // 再处理 node_modules 依赖，收集有 hel 导出的包名
    while (nmLoopDeps.length) {
      const tmpDeps = nmLoopDeps.slice();
      nmLoopDeps.length = 0; // 清空间接依赖
      tmpDeps.forEach((name) => nmPushToDeps(name)); // 添加新的间接依赖
    }
  }
  logMonoDep(isForRootHelDir, { pkgName: json.name, isAllDep, appSrc, monoDep, depInfos });

  return {
    pkgNames,
    depInfos,
    nmHelPkgNames,
    nmPkg2HelConf,
    nmL1ExternalPkgNames,
    nmL1ExternalDeps,
    nmL1ExternalDepData,
    ...nameMap,
  };
}

/**
 * 获取应用在大仓里的各项依赖数据，
 * isAllDep=false，仅获取直接依赖，
 * isAllDep=true，获取所有依赖（直接依赖、间接依赖），
 * @returns {import('../types').IMonoAppDepData}
 */
function getMonoAppDepData(appSrc, devInfo, isAllDep = false) {
  return getMonoAppDepDataImpl({ appSrc, devInfo, isAllDep });
}

module.exports = {
  getMonoAppDepData,
  getMonoAppDepDataImpl,
};
