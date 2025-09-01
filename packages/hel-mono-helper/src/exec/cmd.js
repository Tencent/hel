const { getMonoRootInfo } = require('../util');
const { INNER_SUB_MOD_ORG, INNER_APP_ORG, ACTION_NAME } = require('../consts');

/**
 * 获取 pnpm --filter xxx run yyy 运行命令
 */
exports.getPnpmRunCmd = function (packName, options) {
  const { scriptCmdKey = ACTION_NAME.start } = options;
  return `pnpm --filter ${packName} run ${scriptCmdKey}`;
};

exports.getLintCmd = function (appDirName) {
  const { monoRoot } = getMonoRootInfo();
  const cmd = `${monoRoot}/node_modules/.bin/eslint --fix ${monoRoot}/apps/${appDirName}/src`;
  return cmd;
};

exports.getTestCmd = function (packName, testWord = 'test') {
  return `pnpm --filter ${packName} run ${testWord}`;
};
