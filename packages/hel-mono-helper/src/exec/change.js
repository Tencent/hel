/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const shell = require('shelljs');
const { INNER_ACTION } = require('../consts');
const { helMonoLog, getCmdKeywords } = require('../util');
const { getCmdDPNameData } = require('../util/monoName');
const { getArgvOptions } = require('./common/getArgvOptions');
const { rewriteModAlias } = require('./common/rewriteModAlias');
const { rewritePkgJson } = require('./common/rewritePkgJson');
const { rewritePkgDeps } = require('./common/rewritePkgDeps');
const { rewriteMonoJsonForChange } = require('./common/rewriteMonoJson');

/**
 * 执行启 pnpm start .change <xxx-mod> -n <xxx-name> 命令
 */
exports.changeMod = function (/** @type {IDevInfo} */ devInfo) {
  const keywords = getCmdKeywords(3);
  const dirOrPkgName = keywords[0];
  const { dirName, belongTo, pkgName, alias } = getCmdDPNameData(devInfo, dirOrPkgName);
  helMonoLog(`.change keywords (${keywords.join(' ')})`);
  const newKeywords = [dirName].concat(keywords.slice(1));
  const argvOptions = getArgvOptions({ devInfo, keywords: newKeywords, belongTo, pkgName, actionKey: INNER_ACTION.change });

  const oldPkgName = pkgName;
  const newPkgName = argvOptions.pkgName;
  const oldAlias = alias;
  const newAlias = argvOptions.alias;
  helMonoLog(`oldPkgName ${pkgName}, newPkgName ${newPkgName}`);
  helMonoLog(`oldAlias ${oldAlias}, newAlias ${newAlias}`);

  // 重写根目录hel-mono.json
  if (oldAlias !== newAlias || oldPkgName !== newPkgName) {
    rewriteMonoJsonForChange(devInfo, { oldPkgName, newPkgName, newAlias });
  }
  // 重写 package.son 依赖和模块导入语句
  if (oldPkgName !== newPkgName) {
    rewritePkgDeps(devInfo, oldPkgName, newPkgName);
  }
  // 重写模块别名
  if (oldAlias && oldAlias !== newAlias) {
    rewriteModAlias(argvOptions, oldAlias);
  }
  // 重写应用（模块）的 package.json
  rewritePkgJson(argvOptions);
  // 安装依赖
  helMonoLog('pnpm install start...');
  shell.exec('pnpm install');
  helMonoLog('pnpm install done');
};
