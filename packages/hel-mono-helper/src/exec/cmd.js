// shelljs 相比 child_process.execSync 具有更好的控制台回显交互
const shell = require('shelljs');
const { getMonoRootInfo, helMonoLog } = require('../util');
const { getCWD } = require('../util/base');
const { ACTION_NAME } = require('../consts');

/**
 * 获取 pnpm --filter xxx run yyy 运行命令
 */
function getPnpmRunCmd(packName, options) {
  const { scriptCmdKey = ACTION_NAME.start, belongTo, dirName } = options;
  const cwd = getCWD();
  if (cwd.endsWith(`${belongTo}/${dirName}`)) {
  }
  return `pnpm --filter ${packName} run ${scriptCmdKey}`;
}

function genPnpmCmdAndRun(packName, options, cb) {
  const { scriptCmdKey = ACTION_NAME.startRaw, belongTo, dirName, isSubMod } = options;
  const cwd = getCWD();
  let targetCmdKey = scriptCmdKey === ACTION_NAME.start ? ACTION_NAME.startRaw : scriptCmdKey;

  if (isSubMod) {
    // 默认对子模块调用 start 时启用 start:hel，因为对子模块启动 start:raw 是无意义的
    targetCmdKey = scriptCmdKey === ACTION_NAME.start ? ACTION_NAME.startHel : scriptCmdKey;
  } else {
    // 默认对应用模块调用 start 时启用 start:raw，表示进入原始的一体化开发模式
    targetCmdKey = scriptCmdKey === ACTION_NAME.start ? ACTION_NAME.startRaw : scriptCmdKey;
  }

  const pnpmCmd = `pnpm --filter ${packName} run ${targetCmdKey}`;
  if (cwd.endsWith(`${belongTo}/${dirName}`)) {
    const { monoRoot } = getMonoRootInfo();
    const targetCmd = `cd ${monoRoot} && ${pnpmCmd}`;
    helMonoLog(`will execute shell: ${targetCmd}`);
    return shell.exec(targetCmd, cb);
  }

  helMonoLog(`will execute shell: ${pnpmCmd}`);
  return shell.exec(pnpmCmd, cb);
}

function getLintCmd(appDirName) {
  const { monoRoot } = getMonoRootInfo();
  const cmd = `${monoRoot}/node_modules/.bin/eslint --fix ${monoRoot}/apps/${appDirName}/src`;
  return cmd;
}

function getTestCmd(packName, testWord = 'test') {
  return `pnpm --filter ${packName} run ${testWord}`;
}

module.exports = {
  getPnpmRunCmd,
  getLintCmd,
  getTestCmd,
  genPnpmCmdAndRun,
};
