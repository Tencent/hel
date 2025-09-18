const path = require('path');
const fs = require('fs');
const jsonc = require('jsonc-parser');
const { PKG_NAME_WHITE_LIST } = require('../consts/inner');
const { getFileJson, getDevInfoDirs } = require('./base');
const { safeGet } = require('./dict');
const { getMonoRootInfo } = require('./rootInfo');

/**
 * 获取 tsconfig.json 里的 alias 别名，注：目前 hel-mono 架构暂支持对模块配置一个别名，故只会读取其中一个
 */
function getTsConfigAlias(/** @type DevInfo */ devInfo, tsConfigJson) {
  let targetAlias = '';
  const compilerOptions = tsConfigJson.compilerOptions || {};
  const paths = compilerOptions.paths || {};
  const { appExternals = {} } = devInfo;
  const keys = Object.keys(paths);

  for (const key of keys) {
    // 可能是在 tsConfigJson.paths 里配置 external 库的类型路径别名
    if (appExternals[key] || PKG_NAME_WHITE_LIST.includes(key)) {
      continue;
    }
    const [mayAlias] = key.split('/');
    if (mayAlias) {
      targetAlias = mayAlias;
      break;
    }
  }

  return targetAlias;
}

function getTsConfigAliasByDirPath(devInfo, dirPath) {
  const tsConfigPath = path.join(dirPath, 'tsconfig.json');
  let alias = '';
  if (fs.existsSync(tsConfigPath)) {
    const tsConfigJson = jsonc.parse(fs.readFileSync(tsConfigPath, { encoding: 'utf8' }));
    alias = getTsConfigAlias(devInfo, tsConfigJson);
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
      if (!fs.statSync(modPath).isDirectory()) {
        continue;
      }

      const tsConfigPath = path.join(modPath, './tsconfig.json');
      if (!fs.existsSync(tsConfigPath)) {
        continue;
      }

      const tsConfig = jsonc.parse(fs.readFileSync(tsConfigPath, { encoding: 'utf8' }));
      const alias = getTsConfigAlias(devInfo, tsConfig);
      if (alias) {
        const pkgJsonPath = path.join(modPath, './package.json');
        const pkgJson = getFileJson(pkgJsonPath);
        const list = safeGet(alias2PkgList, alias, []);
        list.push(pkgJson.name);
        pkg2Alias[pkgJson.name] = alias;
      }
    }
  }

  return { alias2PkgList, pkg2Alias };
}

module.exports = {
  getTsConfigAlias,
  getAliasData,
  getTsConfigAliasByDirPath,
};
