const { getMonoRootInfo } = require('../util');
const { INNER_SUB_MOD_ORG, INNER_APP_ORG, ACTION_NAMES } = require('../consts');

/**
 * 获取 pnpm --filter xxx run yyy 运行命令
 */
exports.getPnpmRunCmd = function (packName, options) {
  const { isForRootHelDir, scriptCmdKey = ACTION_NAMES.start, isSubMod, dirName } = options;
  let targetPackName = packName;
  if (isForRootHelDir) {
    targetPackName = `${isSubMod ? `${INNER_SUB_MOD_ORG}/${dirName}` : `${INNER_APP_ORG}/${dirName}`}`;
  }
  // // 非内部代理启动子模块时，添加前缀 HEL=1，表示入口走 .hel/index
  // if (isSubMod && !isForRootHelDir) {
  //   prefix = 'HEL=1 ';
  // }

  return `pnpm --filter ${targetPackName} run ${scriptCmdKey}`;
};

exports.getLintCmd = function (appDirName) {
  const { monoRoot } = getMonoRootInfo();
  const cmd = `${monoRoot}/node_modules/.bin/eslint --fix ${monoRoot}/apps/${appDirName}/src`;
  return cmd;
};
