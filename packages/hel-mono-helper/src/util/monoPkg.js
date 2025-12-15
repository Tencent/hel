/** @typedef {import('../types').ICWDAppData} ICWDAppData */
const path = require('path');
const { VALID_EX_SUFFIXES } = require('../consts/inner');
const { getFileJson } = require('./base');
const { getMonoDirOrFilePath } = require('./monoPath');

/**
 * 获取应用的 package.json 文件内容
 */
function getMonoAppPkgJson(dirName, belongTo) {
  const filepath = getMonoDirOrFilePath(`./${belongTo}/${dirName}/package.json`);
  const json = getFileJson(filepath);
  return json;
}

/**
 * 获取应用的 package.json 文件内容
 */
function getMonoAppPkgJsonByAppData(/** @type ICWDAppData */ appData) {
  const { appDir, belongTo } = appData;
  return getMonoAppPkgJson(appDir, belongTo);
}

function getMonoAppPkgJsonByCwd(/** @type {string} */ cwd) {
  const filepath = path.join(cwd, 'package.json');
  const jsonOrNull = getFileJson(filepath, true);
  return jsonOrNull;
}

function isEXProject(cwdOrAppSrc) {
  /** @type {string} */
  let cwd = cwdOrAppSrc;
  if (cwdOrAppSrc.endsWith('/src')) {
    cwd = cwdOrAppSrc.substring(0, cwdOrAppSrc.length - 4);
  }

  const json = getMonoAppPkgJsonByCwd(cwd);
  if (!json) {
    return VALID_EX_SUFFIXES.some((item) => cwd.endsWith(item));
  }

  const hel = (json || {}).hel || {};
  return !!hel.isEX;
}

function getExternalBoundName(/** @type string */ pkgName) {
  const fmtBy = (str, sep) => {
    const list = str.split(sep);
    return list.map((v) => `${v.charAt(0).toUpperCase()}${v.substring(1)}`).join('');
  };
  const getResult = (str) => {
    let result = fmtBy(str, '_');
    return fmtBy(result, '-');
  };

  if (pkgName.startsWith('@') && pkgName.includes('/')) {
    const [scope, name] = pkgName.split('/');
    const pure = scope.substring(1);
    // 中间加横线是为了避免 tencent-my-lib 和 @tencent/my-lib 得出一样的全局名字
    return `${getResult(pure)}_${getResult(name)}`;
  }

  return getResult(pkgName);
}

module.exports = {
  getMonoAppPkgJson,
  getMonoAppPkgJsonByAppData,
  getMonoAppPkgJsonByCwd,
  isEXProject,
  getExternalBoundName,
};
