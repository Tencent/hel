const { getPkgjson } = require('./base');
const { getMonoDirOrFilePath } = require('./mono-path');

/**
 * 获取应用的 package.json 文件内容
 */
exports.getMonoAppPkgJson = function (dirName, belongTo) {
  const filepath = getMonoDirOrFilePath(`./${belongTo}/${dirName}/package.json`);
  const json = getPkgjson(filepath);
  return json;
};
