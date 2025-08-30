const path = require('path');
const fs = require('fs');
const jsonc = require('jsonc-parser');
const { getFileJson, getDevInfoDirs } = require('./base');
const { safeGet } = require('./dict');
const { getMonoRootInfo } = require('./rootInfo');

/**
 * 获取 tsconfig.json 里的 alias 别名，注：目前 hel-mono 架构暂支持对模块配置一个别名，故只会读取其中一个
 */
function getTsConfigAlias(tsConfigJson) {
  let targetAlias = '';
  const compilerOptions = tsConfigJson.compilerOptions || {};
  const paths = compilerOptions.paths || {};
  const key1 = Object.keys(paths)[0];
  if (key1) {
    const [mayAlias] = key1.split('/');
    if (mayAlias) {
      targetAlias = mayAlias;
    }
  }
  return targetAlias;
}

function getTsConfigAliasByDirPath(dirPath) {
  const tsConfigPath = path.join(dirPath, 'tsconfig.json');
  let alias = '';
  if (fs.existsSync(tsConfigPath)) {
    const tsConfigJson = jsonc.parse(fs.readFileSync(tsConfigPath, { encoding: 'utf8' }));
    alias = getTsConfigAlias(tsConfigJson);
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
      const alias = getTsConfigAlias(tsConfig);
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
