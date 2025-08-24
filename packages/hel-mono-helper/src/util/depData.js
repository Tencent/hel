const fs = require('fs');
const { getAppBelongTo } = require('./appSrc');
const { getDirName } = require('./base');
const { getDevInfoDirs } = require('./devInfo');
const { getMonoNameMap } = require('./monoName');
const { getMonoAppPkgJson } = require('./monoPkg');
const { getMonoRootInfo } = require('./rootInfo');
const { getLocaleTime } = require('./time');

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
  const { appSrc, devInfo, isAllDep = false, isForRootHelDir } = options;
  const belongTo = getAppBelongTo(appSrc);
  const dirName = getDirName(appSrc);
  const json = getMonoAppPkgJson(dirName, belongTo);
  const { belongToDirs } = getDevInfoDirs(devInfo);
  const nameMap = getMonoNameMap(devInfo);
  const { pkg2Deps, pkg2BelongTo, pkg2Dir, monoDep } = nameMap;

  const pkgNames = [];
  const depInfos = [];
  const loopDeps = [];

  const pushToDeps = (depObj) => {
    Object.keys(depObj).forEach((key) => {
      const val = depObj[key];
      const belongTo = pkg2BelongTo[key];
      if (!belongToDirs.includes(belongTo)) {
        return;
      }
      if (val.startsWith('workspace:') && !pkgNames.includes(key)) {
        pkgNames.push(key);
        loopDeps.push(key);
        depInfos.push({ pkgName: key, belongTo, dirName: pkg2Dir[key] });
      }
    });
  };

  // 添加直接依赖
  pushToDeps(json.dependencies || {});
  // 添加间接依赖
  if (isAllDep) {
    while (loopDeps.length) {
      const tmpDeps = loopDeps.slice();
      loopDeps.length = 0; // 清空间接依赖
      tmpDeps.forEach((name) => pushToDeps(pkg2Deps[name] || {})); // 添加新的间接依赖
    }
  }

  logMonoDep(isForRootHelDir, { pkgName: json.name, isAllDep, appSrc, monoDep, depInfos });

  return { pkgNames, depInfos, ...nameMap };
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
