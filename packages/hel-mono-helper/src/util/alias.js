/** @typedef {import('../types').IMonoDevInfo} DevInfo */
const path = require('path');
const fs = require('fs');
const { PKG_NAME_WHITE_LIST } = require('../consts/inner');
const { getDevInfoDirs } = require('./base');
const { safeGet } = require('./dict');
const { getFileJson, getJsoncFileJson } = require('./file');
const { getMonoRootInfo } = require('./rootInfo');

/**
 * 解析出可能存在的继承的 tsconfig 配置
 * @param {*} tsConfigJson
 * @returns
 */
function getParentTsConfigJson(tsConfigDirPath, tsConfigJson) {
  let parentTsConfigJson = {};
  const extendsPath = tsConfigJson.extends;
  if (extendsPath) {
    let parentTsConfigPath = '';
    if (extendsPath.startsWith('.')) {
      // 使用了相对路径
      parentTsConfigPath = path.join(tsConfigDirPath, extendsPath);
    } else {
      const { monoRoot } = getMonoRootInfo();
      parentTsConfigPath = path.join(monoRoot, extendsPath);
    }

    if (fs.existsSync(parentTsConfigPath)) {
      parentTsConfigJson = getJsoncFileJson(parentTsConfigPath);
    }
  }

  return parentTsConfigJson;
}

/**
 * 获取 tsConfigJson 里的 paths 配置，自动合并可能包含的继承配置
 */
function getTsConfigPaths(tsConfigDirPath) {
  const tsConfigPath = path.join(tsConfigDirPath, 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    return null;
  }
  const tsConfigJson = getJsoncFileJson(tsConfigPath);
  const compilerOptions = tsConfigJson.compilerOptions || {};
  const childPaths = compilerOptions.paths || {};

  const parentTsConfigJson = getParentTsConfigJson(tsConfigDirPath, tsConfigJson);
  const parentCompilerOptions = parentTsConfigJson.compilerOptions || {};
  const parentPaths = parentCompilerOptions.paths || {};

  // 此处避免父亲配置覆盖掉孩子的
  const paths = Object.assign({}, childPaths);
  Object.keys(parentPaths).forEach((alias) => {
    if (!childPaths[alias]) {
      paths[alias] = parentPaths[alias];
    }
  });

  return paths;
}

/**
 * 获取 alias 别名，注：目前 hel-mono 架构暂支持对模块配置一个别名，故只会读取其中一个
 */
function getTsConfigAliasByDirPath(/** @type {DevInfo} */ devInfo, tsConfigDirPath) {
  const tsConfigPath = path.join(tsConfigDirPath, 'tsconfig.json');
  if (!fs.existsSync(tsConfigPath)) {
    return '';
  }

  let alias = '';
  const { customExternals = {}, baseExternals = {} } = devInfo;
  const paths = getTsConfigPaths(tsConfigDirPath);
  const keys = Object.keys(paths);
  for (const key of keys) {
    // 可能是在 tsConfigJson.paths 里配置 external 库的类型路径别名
    if (customExternals[key] || baseExternals[key] || PKG_NAME_WHITE_LIST.includes(key)) {
      continue;
    }

    const pathArr = paths[key] || [];
    const pathValue = pathArr[0] || '';
    const [mayAlias, mayStar] = key.split('/');
    // 确保找到的是 "@xx/*": ["./*"] 或 "src/*"]  配置项
    if (mayAlias && mayStar === '*' && ['./*', 'src/*'].includes(pathValue)) {
      alias = mayAlias;
      break;
    }
  }

  return alias;
}

function getAliasData(devInfo) {
  const { belongToDirs } = getDevInfoDirs(devInfo);
  const { monoRoot } = getMonoRootInfo();

  const alias2PkgList = {};
  const pkg2Alias = {};

  for (const dir of belongToDirs) {
    const dirPath = path.join(monoRoot, `./${dir}`);
    if (!fs.existsSync(dirPath)) {
      continue;
    }

    const names = fs.readdirSync(dirPath);
    for (const name of names) {
      const modPath = path.join(dirPath, `./${name}`);
      const stat = fs.statSync(modPath);
      if (!stat || !stat.isDirectory()) {
        continue;
      }
      const alias = getTsConfigAliasByDirPath(devInfo, modPath);
      if (!alias) {
        continue;
      }

      const pkgJsonPath = path.join(modPath, './package.json');
      const pkgJson = getFileJson(pkgJsonPath, true);
      if (pkgJson) {
        const list = safeGet(alias2PkgList, alias, []);
        list.push(pkgJson.name);
        pkg2Alias[pkgJson.name] = alias;
      }
    }
  }

  return { alias2PkgList, pkg2Alias };
}

module.exports = {
  getTsConfigPaths,
  getAliasData,
  getTsConfigAliasByDirPath,
};
