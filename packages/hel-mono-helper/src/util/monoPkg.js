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

module.exports = {
  getMonoAppPkgJson,
};
