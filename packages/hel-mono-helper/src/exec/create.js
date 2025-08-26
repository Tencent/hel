/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const shell = require('shelljs');
const { INNER_ACTION } = require('../consts');
const { helMonoLog, getCmdKeywords } = require('../util');
const { getArgvOptions } = require('./common/getArgvOptions');
const { rewriteModAlias } = require('./common/rewriteModAlias');
const { rewritePkgJson } = require('./common/rewritePkgJson');
const { rewriteRootDevInfo } = require('./common/rewriteRootDevInfo');

/**
 * 执行 npm start .create hub 命令
 * ```bash
 * # 创建 react-cra 到 apps/hub 目录
 * npm start .create hub
 *
 * # 创建 other-demo 到 apps/hub 目录
 * npm start .create hub -t other-demo
 *
 * # 创建 other-demo 到 hub my-apps/hub 目录
 * npm start .create hub -t other-demo -d my-apps
 * ```
 */
exports.execCreate = function (/** @type {IMonoDevInfo} */ devInfo, options = {}) {
  const { isSubMod = false, autoStart = false } = options;
  const label = isSubMod ? 'hel-mod' : 'app';
  const actionKey = isSubMod ? INNER_ACTION.createMod : INNER_ACTION.create;
  const keywords = getCmdKeywords(3);
  helMonoLog(`${actionKey} keywords (${keywords.join(' ')})`);
  const argvOptions = getArgvOptions({ keywords, actionKey }, options);
  const { copyToPath, copyFromPath, pkgName } = argvOptions;

  // 复制模板项目文件
  helMonoLog(`start create ${label} to ${copyToPath}...`);
  fs.cpSync(copyFromPath, copyToPath, { recursive: true });
  helMonoLog(`create ${label} ${pkgName} done`);

  // 重写根目录的dev-info
  rewriteRootDevInfo(devInfo, argvOptions);
  // 重写模块别名
  rewriteModAlias(argvOptions);
  // 重写应用的 package.json
  rewritePkgJson(argvOptions, options);
  // 安装依赖
  helMonoLog('pnpm install start...');
  shell.exec('pnpm install');
  helMonoLog('pnpm install done');

  if (autoStart) {
    shell.exec(`pnpm start ${pkgName}`);
  }
};

exports.execCreateStart = function (/** @type {IMonoDevInfo} */ devInfo, options) {
  exports.execCreate(devInfo, { autoStart: true, ...(options || {}) });
};

/**
 * 执行 npm start .create-mod xxx 命令
 */
exports.execCreateMod = function (/** @type {IMonoDevInfo} */ devInfo, options) {
  exports.execCreate(devInfo, { autoStart: false, isSubMod: true, ...(options || {}) });
};
