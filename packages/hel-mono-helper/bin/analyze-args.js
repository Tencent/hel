const util = require('./util');

/**
 * 解析命令行参数，创建 hel-mono 模板项目
 */
exports.analyzeArgs = async function analyzeArgs() {
  const args = process.argv.slice(2);
  const argObj = util.getArgObject(args);
  console.log(argObj);
};
