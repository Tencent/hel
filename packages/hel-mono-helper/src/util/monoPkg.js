/** @typedef {import('../types').ICWDAppData} ICWDAppData */
const path = require('path');
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

function getMonoAppPkgJsonByCwd(cwd) {
  const filepath = path.join(cwd, 'package.json');
  const jsonOrNull = getFileJson(filepath, true);
  return jsonOrNull;
}

function isEXProject(cwdOrAppSrc) {
  let cwd = cwdOrAppSrc;
  if (cwdOrAppSrc.endsWith('/src')) {
    cwd = cwdOrAppSrc.substring(0, cwdOrAppSrc.length - 4);
  }

  const json = getMonoAppPkgJsonByCwd(cwd);
  if (!json) {
    return cwd.endsWith('-ex');
  }

  const hel = (json || {}).hel || {};
  return !!hel.isEX;
}

module.exports = {
  getMonoAppPkgJson,
  getMonoAppPkgJsonByAppData,
  getMonoAppPkgJsonByCwd,
  isEXProject,
};
