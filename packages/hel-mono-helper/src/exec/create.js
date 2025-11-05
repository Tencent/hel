/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const shell = require('shelljs');
const { INNER_ACTION } = require('../consts');
const { helMonoLog, getCmdKeywords } = require('../util');
const { getArgvOptions } = require('./common/getArgvOptions');
const { rewriteModAlias } = require('./common/rewriteModAlias');
const { rewritePkgJson } = require('./common/rewritePkgJson');
const { rewriteMonoJsonForArgv } = require('./common/rewriteMonoJson');

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
exports.execCreate = function (/** @type {IDevInfo} */ devInfo, options = {}) {
  const { isSubMod = false, autoStart = false } = options;
  const label = isSubMod ? 'hel-mod' : 'app';
  const actionKey = isSubMod ? INNER_ACTION.createMod : INNER_ACTION.create;
  // getCmdKeywords 第二位参数传 false 是为了拿到 -t -n 等命令关键字
  const keywords = options.keywords || getCmdKeywords(3, false);
  helMonoLog(`${actionKey} keywords (${keywords.join(' ')})`);
  const argvOptions = getArgvOptions({ devInfo, keywords, actionKey }, options);
  const { copyToPath, copyFromPath, pkgName, copyToDir } = argvOptions;

  if (copyToDir.startsWith('@')) {
    throw new Error(
      `Found scoped package name, .create only accept dir name, you may type "pnpm start .create <dir-name> -n ${copyToDir}"`,
    );
  }
  if (copyToDir.includes('/')) {
    throw new Error(
      `Found multi level dir name ${copyToDir}, .create only accept one level dir name, you may type "pnpm start .create <mod-dir-name> -d <belong-to-dir>"`,
    );
  }

  // 复制模板项目文件
  helMonoLog(`start create ${label} to ${copyToPath}...`);
  fs.cpSync(copyFromPath, copyToPath, { recursive: true });
  helMonoLog(`create ${label} ${pkgName} done`);

  // 重写根目录的 hel-mono.json
  rewriteMonoJsonForArgv(devInfo, argvOptions, isSubMod);
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

exports.execCreateStart = function (/** @type {IDevInfo} */ devInfo, options) {
  exports.execCreate(devInfo, { autoStart: true, ...(options || {}) });
};

/**
 * 执行 npm start .create-mod xxx 命令
 */
exports.execCreateMod = function (/** @type {IDevInfo} */ devInfo, options) {
  exports.execCreate(devInfo, { autoStart: false, isSubMod: true, ...(options || {}) });
};
