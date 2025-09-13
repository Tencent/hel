// shelljs 相比 child_process.execSync 具有更好的控制台回显交互
const shell = require('shelljs');
const { getMonoRootInfo, helMonoLog } = require('../util');
const { getCWD } = require('../util/base');
const { cmdHistoryLog } = require('../util/log');
const { getRawMonoJson } = require('../util/monoJson');
const { ACTION_NAME } = require('../consts');

/**
 * 获取 pnpm --filter xxx run yyy 运行命令
 */
function getPnpmRunCmd(packName, options) {
  const { scriptCmdKey = ACTION_NAME.start } = options;
  return `pnpm --filter ${packName} run ${scriptCmdKey}`;
}

function getDefaultStart() {
  const monoJson = getRawMonoJson() || {};
  return monoJson.defaultStart || '';
}

function getScriptKey(cmdKeyword) {
  if (cmdKeyword === ACTION_NAME.start) {
    return getDefaultStart() || ACTION_NAME.startHel;
  }

  return cmdKeyword;
}

/**
 * 推导 run 后面的执行内容
 */
function inferCmdRunContent(packName, options) {
  const { scriptCmdKey = ACTION_NAME.startRaw, belongTo, dirName, isSubMod } = options;
  const prefixedDir = `${belongTo}/${dirName}`;
  const argv = process.argv;
  if (argv.length === 2) {
    // 类似 ['/xx/bin/node', '/xx/root-scripts/executeStart']
    if (argv[1].includes('root-scripts')) {
      return getDefaultStart() || ACTION_NAME.startHel;
    }
    // 类似 ['/xx/bin/node', '/xx/scripts/hel/start']
    return scriptCmdKey;
  }
  const mayDirOrPkgName = argv[2] || '';
  const restArgs = argv.slice(3);
  const restArgsLen = restArgs.length;

  // 此时用户表达模块的字符串无其他特殊符号，例如
  // pnpm start hub xxxx, argv2(hub) is pure
  // pnpm start @tencent/hub xxx, argv2(@tencent/hub) is pure
  // pnpm start apps/hub xxx, argv2(apps/hub) is pure
  // pnpm start hub:for exs, argv2(hub:for) is not pure
  const isArg2PurePkgLocation = [packName, prefixedDir, dirName].includes(mayDirOrPkgName);
  if (isArg2PurePkgLocation) {
    if (!restArgsLen) {
      // 使用内部推导的 scriptKey
      const scriptKey = getScriptKey(scriptCmdKey, isSubMod);
      return scriptKey;
    }
    if (restArgs[0] === 'start') {
      // 避免 pnpm --filter xxx run start 无意义命令
      return ACTION_NAME.startHel;
    }

    return restArgs.join(' ');
  }

  const [, action = ''] = mayDirOrPkgName.split(':');
  if (action === 'for') {
    // 执行类似 pnpm start hub:for deps
    // 转为 pnpm --filter hub run start:for deps 去执行未暴露在 scripts 节点的其他命令
    return `start:for ${restArgs.join(' ')}`;
  }

  // 丢弃 restArgs，目前暂无用处
  return `start${action ? `:${action}` : ACTION_NAME.startHel}`;
}

/**
 * 推导生成 pnpm 命令并运行
 */
function genPnpmCmdAndRun(packName, options, cb) {
  const content = inferCmdRunContent(packName, options);
  const pnpmRunCmd = `pnpm --filter ${packName} run ${content}`;
  const runCmd = (fullCmd, cb) => {
    cmdHistoryLog(fullCmd);
    helMonoLog(`will execute shell: ${fullCmd}`);
    return shell.exec(fullCmd, cb);
  };

  const cwd = getCWD();
  const { monoRoot } = getMonoRootInfo();
  if (cwd !== monoRoot) {
    // 执行 pnpm start ... 目录处于非根目录时，跳转到根目录去执行命令
    return runCmd(`cd ${monoRoot} && ${pnpmRunCmd}`, cb);
  }

  return runCmd(pnpmRunCmd, cb);
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
