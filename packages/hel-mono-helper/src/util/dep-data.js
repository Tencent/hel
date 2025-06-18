const { getDirName, getDevInfoDirs } = require('./base');
const { getMonoNameMap } = require('./mono-name');
const { getMonoAppPkgJson } = require('./mono-pkg');

/**
 * 通过src完整路径获得应用在大仓里的所属目录
 * @example
 * ```
 * input: /user/path/to/hel-mono/packages/mono-comps-in-one-v2/src
 * output: packages
 * ```
 */
function getAppBelongTo(appSrc) {
  const strList = appSrc.split('/');
  return strList[strList.length - 3];
}

/**
 * 获取应用在大仓里的各项依赖数据，
 * isAllDep=false，仅获取直接依赖，
 * isAllDep=true，获取所有依赖（直接依赖、间接依赖），
 * @returns {import('../types').IMonoAppDepData}
 */
exports.getMonoAppDepData = function (appSrc, devInfo, isAllDep = false) {
  const belongTo = getAppBelongTo(appSrc);
  const dirName = getDirName(appSrc);
  const json = getMonoAppPkgJson(dirName, belongTo);
  const { belongToDirs } = getDevInfoDirs(devInfo);
  const nameMap = getMonoNameMap(devInfo);
  const { pkg2Deps, pkg2BelongTo, pkg2Dir } = nameMap;

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
      tmpDeps.forEach(name => pushToDeps(pkg2Deps[name] || {})); // 添加新的间接依赖
    }
  }

  return { pkgNames, depInfos, ...nameMap };
};
