/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const { PKG_NAME_WHITE_LIST } = require('../consts/inner');
const { noDupPushWithCb, noDupPush } = require('./arr');
const { getAppBelongTo, getAppDirPath } = require('./appSrc');
const { getDirName, getDevInfoDirs } = require('./base');
const { getMonoNameMap } = require('./monoName');
const { getMonoAppPkgJson } = require('./monoPkg');
const { getMonoRootInfo } = require('./rootInfo');

function getNmPkgJsonByErr(err, allowInvalidName = true) {
  const mayThrowErr = () => {
    if (!allowInvalidName) {
      throw err;
    }
    return { pkgJson: {}, isValid: false };
  };

  const msg = err.message;
  // Package subpath './package.json' is not defined by "exports" in {this_is_pkg_path}
  if (msg.includes('./package.json') && msg.includes('exports')) {
    try {
      const [, pkgJsonPath] = msg.split(' in ');
      const pkgJson = require(pkgJsonPath);
      return { pkgJson, isValid: true };
    } catch (err) {
      return mayThrowErr(err);
    }
  }

  return mayThrowErr(err);
}

function getNmPkgJson(nmPkgName, allowInvalidName = true) {
  try {
    const pkgJson = require(`${nmPkgName}/package.json`);
    return { pkgJson, isValid: true };
  } catch (err) {
    return getNmPkgJsonByErr(err, allowInvalidName);
  }
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
  const excludeHelMods = devInfo.exclude || [];
  const excludeAutoExternal = devInfo.excludeAutoExternal || [];

  const pkgNames = [];
  const depInfos = [];
  const loopDeps = [];

  const nmL1ExternalPkgNames = []; // 当前大仓所有项目可提取为 external 资源的 node_modules 包名
  const nmL1ExternalDeps = {}; // 当前大仓所有项目可提取为 external 资源的 node_modules 包名和版本字典
  const nmPkgNames = [];
  const nmLoopDeps = [];
  const nmPkg2HelConf = {};
  // 这些包是非大仓的 hel 包
  const nmHelPkgNames = [];

  const handleNmLoopAssocData = (pkgName) => {
    if (!PKG_NAME_WHITE_LIST.includes(pkgName) && !excludeHelMods.includes(pkgName)) {
      noDupPushWithCb(nmPkgNames, pkgName, () => {
        nmLoopDeps.push(pkgName);
      });
    }
  };

  const handleL1PkgName = (pkgName, verStr) => {
    if (!PKG_NAME_WHITE_LIST.includes(pkgName) && !excludeAutoExternal.includes(pkgName)) {
      noDupPush(nmL1ExternalPkgNames, pkgName);
      nmL1ExternalDeps[pkgName] = verStr;
    }
  };

  const pushToDeps = (depObj, appDirPath) => {
    Object.keys(depObj).forEach((pkgName) => {
      const val = depObj[pkgName];
      if (val.startsWith('workspace:')) {
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
        handleL1PkgName(pkgName, val);
      }
    });
  };

  const nmPushToDeps = (nmPkgName) => {
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
  pushToDeps(json.dependencies || {}, appDirPath);
  // 添加间接依赖
  if (isAllDep) {
    // 先处理大仓里的依赖
    while (loopDeps.length) {
      const tmpDeps = loopDeps.slice();
      loopDeps.length = 0; // 清空间接依赖
      tmpDeps.forEach((name) => {
        pushToDeps(pkg2Deps[name] || {}, pkg2AppDirPath[name]);
      }); // 添加新的间接依赖
    }

    // 再处理 node_modules 里的依赖，收集有 hel 导出的包名
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
