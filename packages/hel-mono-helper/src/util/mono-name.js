/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const path = require('path');
const { cst } = require('hel-dev-utils');
const { intersection, getPkgJson } = require('./base');
const { getDevInfoDirs } = require('./dev-info');
const { INNER_SUB_MOD_ORG, INNER_APP_ORG } = require('../consts');
const { getMonoRootInfo } = require('./root-info');
const { getMonoDirOrFilePath, getUnderDirSubPath } = require('./mono-path');
const { getLocaleTime } = require('./time');

/**
 * 获取大仓某个一级目录下的目录与应用、应用与目录映射关系
 */
function getMonoLevel1NameMap(level1DirName) {
  const levelDirPath = getMonoDirOrFilePath(level1DirName);
  const fsDirNames = fs.readdirSync(levelDirPath);
  const pkgName2DirName = {};
  const pkgName2Deps = {};
  const dirName2PkgName = {};
  const packNames = [];
  const dirNames = [];

  for (const dirName of fsDirNames) {
    const path = getUnderDirSubPath(levelDirPath, dirName);
    const stat = fs.statSync(path);
    if (!stat.isDirectory()) {
      continue;
    }
    const filepath = getUnderDirSubPath(path, 'package.json');
    if (!fs.existsSync(filepath)) {
      continue;
    }

    const { name, dependencies } = getPkgJson(filepath);
    if (pkgName2DirName[name]) {
      throw new Error(`package name ${name} duplicated under ${level1DirName} dir`);
    }

    pkgName2DirName[name] = dirName;
    pkgName2Deps[name] = dependencies || {};
    dirName2PkgName[dirName] = name;
    packNames.push(name);
    dirNames.push(dirName);
  }

  return { pkgName2DirName, pkgName2Deps, dirName2PkgName, packNames, dirNames };
}

/**
 * 获取整个大仓的目录与应用、应用与目录映射关系
 * @returns {import('../types').IMonoNameMap}
 */
exports.getMonoNameMap = function (/** @type {IMonoDevInfo} */ devInfo) {
  const { appsDirs, subModDirs } = getDevInfoDirs(devInfo);
  const dupDirs = intersection(appsDirs, subModDirs);
  if (dupDirs.length > 0) {
    throw new Error(`found duplicated dir names between (${appsDirs.join(',')}) and (${subModDirs.join(',')})`);
  }

  const { monoRootHelDir, monoRoot } = getMonoRootInfo();
  const monoNameMap = {};
  const packNames = [];
  const dupPackNames = [];
  const pkg2Deps = {}; // 包名与 dependencies 对象映射
  const pkg2BelongTo = {}; // 包名与 belongTo 目录映射
  const pkg2Dir = {}; // 包名与项目目录映射
  const pkg2Info = {}; // 包名与info映射
  const pkg2AppDirPath = {}; // 包名与应用的目录路径映射
  const prefixedDir2Pkg = {}; // 带belongTo前缀的目录名与包名映射

  // mono-dep.json 需要的数据
  const depData = {};
  const monoDep = { createdAt: getLocaleTime(), depData };

  const mapData = (belongTo, isSubMod = false) => {
    const nameMap = getMonoLevel1NameMap(belongTo);
    nameMap.packNames.forEach((name) => {
      if (!packNames.includes(name)) {
        packNames.push(name);
      } else {
        dupPackNames.push(name);
      }
    });
    monoNameMap[belongTo] = { isSubMod, nameMap };
    Object.assign(pkg2Deps, nameMap.pkgName2Deps);
    nameMap.packNames.forEach((pkgName) => {
      pkg2BelongTo[pkgName] = belongTo;
      const dirName = nameMap.pkgName2DirName[pkgName];
      const prefixedDir = `${belongTo}/${dirName}`;
      pkg2Dir[pkgName] = dirName;
      pkg2AppDirPath[pkgName] = path.join(monoRoot, `./${prefixedDir}`);
      prefixedDir2Pkg[`${belongTo}/${dirName}`] = pkgName;
      const proxyPkgName = isSubMod ? `${INNER_SUB_MOD_ORG}/${dirName}` : `${INNER_APP_ORG}/${dirName}`;
      const proxySrcPath = path.join(monoRootHelDir, `./${prefixedDir}/src`);
      pkg2Info[pkgName] = { pkgName, belongTo, dirName, isSubMod, proxyPkgName, proxySrcPath };

      depData[pkgName] = {
        ...pkg2Info[pkgName],
        appDirPath: pkg2AppDirPath[pkgName],
        prefixedDir,
        deps: pkg2Deps[pkgName],
      };
    });
  };

  appsDirs.forEach((dir) => mapData(dir));
  subModDirs.forEach((dir) => mapData(dir, true));

  if (dupPackNames.length > 0) {
    throw new Error(`these package names (${dupPackNames.join(',')}) duplicated`);
  }

  return { monoNameMap, pkg2AppDirPath, pkg2Deps, pkg2BelongTo, pkg2Dir, prefixedDir2Pkg, pkg2Info, monoDep };
};

exports.getBuildDirPath = function (devInfo, pkgName, buildDir = cst.HEL_DIST_DIR) {
  const { pkg2AppDirPath } = exports.getMonoNameMap(devInfo);
  const appDirPath = pkg2AppDirPath[pkgName];
  if (!appDirPath) {
    throw new Error(`no app dir found for ${pkgName}!`);
  }
  return path.join(appDirPath, `./${buildDir}`);
};
