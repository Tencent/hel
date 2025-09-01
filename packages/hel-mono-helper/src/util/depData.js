/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const path = require('path');
const { noDupPushWithCb, noDupPush } = require('./arr');
const { getAppBelongTo, getAppDirPath } = require('./appSrc');
const { getDirName, getDevInfoDirs } = require('./base');
const { helMonoLog } = require('./log');
const { getMonoNameMap } = require('./monoName');
const { getMonoAppPkgJson } = require('./monoPkg');
const { getMonoRootInfo } = require('./rootInfo');
const { getLocaleTime } = require('./time');

/**
 * 这些包一定不需要去查询是否有 hel 导出
 * TODO: add include exclude to hel-mono.json
 */
const pkgNameWhiteList = [
  '@tencent/hel-micro',
  '@tencent/hel-lib-proxy',
  'hel-iso',
  'hel-micro',
  'hel-micro-core',
  'hel-lib-proxy',
  'hel-types',
  'react',
  'react-dom',
  'vue',
  'react-router',
];

function logMonoDep(isForRootHelDir, options) {
  const { isAllDep, appSrc, monoDep, depInfos, pkgName } = options;
  const { monoDepForJson, monoDepJson } = getMonoRootInfo();
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

  monoDep.for = appSrc;
  const depData = { [pkgName]: getLogData(monoDep.depData[pkgName]) };
  const monoDepForApp = { isForRootHelDir, for: appSrc, createdAt: getLocaleTime(), depData };
  depInfos.forEach((v) => {
    const data = monoDep.depData[v.pkgName];
    depData[v.pkgName] = getLogData(data);
  });

  fs.writeFileSync(monoDepForJson, JSON.stringify(monoDepForApp, null, 2));
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
  const nmPkg2PkgJsonPath = {};
  const nmPkg2DirPath = {};
  const nmPkg2NmDirPath = {};
  const nmPkg2HelConf = {};
  // 这些包是非大仓的 hel 包
  const nmHelPkgNames = [];

  const handleNmLoopAssocData = (pkgName, appDirPath) => {
    if (!pkgNameWhiteList.includes(pkgName) && !excludeHelMods.includes(pkgName)) {
      noDupPushWithCb(nmPkgNames, pkgName, () => {
        nmLoopDeps.push(pkgName);
        // console.log(`appDirPath ${pkgName} ${appDirPath}`);
        nmPkg2PkgJsonPath[pkgName] = path.join(appDirPath, `./node_modules/${pkgName}/package.json`);
        nmPkg2DirPath[pkgName] = path.join(appDirPath, `./node_modules/${pkgName}`);
        nmPkg2NmDirPath[pkgName] = path.join(appDirPath, `./node_modules/${pkgName}/node_modules`);
      });
    }
  };

  const handleL1PkgName = (pkgName, verStr) => {
    if (!pkgNameWhiteList.includes(pkgName) && !excludeAutoExternal.includes(pkgName)) {
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

      handleL1PkgName(pkgName, val);
      handleNmLoopAssocData(pkgName, appDirPath);
    });
  };

  const nmPushToDeps = (nmPkgName) => {
    const pkgJsonPath = nmPkg2PkgJsonPath[nmPkgName];
    let depObj = null;
    try {
      // TODO 后续优化这里的 npm hel entry 查找过程，
      // 可在 hel-mono.json 加入白名单什么的，提高查找速度
      const pkgJson = require(pkgJsonPath);
      const pkgExports = pkgJson.exports || {};
      const pkgHelEntry = pkgExports['./hel'];
      // 包含有 hel 导出
      if (pkgHelEntry) {
        noDupPush(nmHelPkgNames, nmPkgName);
      }
      depObj = pkgJson.dependencies || {};
      nmPkg2HelConf[nmPkgName] = pkgJson.hel || {};
    } catch (err) {
      // helMonoLog(`find npm hel entry fail: ${nmPkgName} `, pkgJsonPath);
    }

    if (!depObj) {
      return;
    }

    const pkgDirPath = nmPkg2DirPath[nmPkgName];
    Object.keys(depObj).forEach((pkgName) => {
      handleNmLoopAssocData(pkgName, pkgDirPath);
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
    nmPkg2PkgJsonPath,
    nmPkg2HelConf,
    nmL1ExternalPkgNames,
    nmL1ExternalDeps,
    ...nameMap
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
