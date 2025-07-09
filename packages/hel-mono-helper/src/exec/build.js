/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
// shelljs 相比 child_process.execSync 具有更好的控制台回显交互
const shell = require('shelljs');
const { getCmdKeywordName, helMonoLog, getNameData } = require('../util');
const { ACTION_NAMES } = require('../consts');
const { getPnpmRunCmd } = require('./cmd');

/**
 * npm start .build xxx 时触发
 */
exports.execBuild = function (/** @type {IMonoDevInfo} */ devInfo) {
  const scriptCmdKey = ACTION_NAMES.build;
  const keywordName = getCmdKeywordName(3);
  const { pkgName, dirName } = getNameData(keywordName, devInfo);

  const exeCmd = getPnpmRunCmd(pkgName, { scriptCmdKey });
  helMonoLog(exeCmd);
  const result = shell.exec(exeCmd);

  // 用户使用 npm run build xxx 命令来启动子模块（ 替代 npm run buildsub xxx ）
  if (result.stdout.includes('No projects matched the filters')) {
    helMonoLog(`build app ${pkgName} failed, try build it as a sub mod...`);
    // rollup 构建必须到项目根目录执行才ok，否则会报错：
    // Error: Could not resolve entry module (rollup.config.js)
    shell.exec(`cd ./packages/${dirName} && npm run build`);
  }
};
