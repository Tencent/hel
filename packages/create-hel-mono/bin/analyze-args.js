const { getConfig } = require('./config');
const { createTemplate } = require('./create-template');
const util = require('./util');

/**
 * debug 模式才打印这些信息
 */
function logDepAndArgs(args, argObj) {
  util.logDepPath();
  util.logDebug(`See var: args ${args}`);
  util.logDebug('See var: argObj', argObj);
}

/**
 * 解析命令行参数，创建 hel-mono 模板项目
 */
exports.analyzeArgs = async function analyzeArgs() {
  const args = process.argv.slice(2);
  const argObj = util.getArgObject(args);

  if (argObj.isSeeVersion) {
    return console.log(getConfig().cliPkgVersion);
  }

  if (argObj.isSeeHelp) {
    return util.logHelpInfo();
  }

  util.logCliInfo();
  logDepAndArgs(args, argObj);

  try {
    await createTemplate(argObj);
  } catch (e) {
    util.logError(e.message);
    util.logError(e, true);
    process.exit(1);
  }
};
