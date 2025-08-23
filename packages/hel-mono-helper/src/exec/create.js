/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const shell = require('shelljs');
const { helMonoLog, getCmdKeywords, getCWD } = require('../util');
const { getCreateOptions } = require('./common/getCreateOptions');
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
  const keywords = getCmdKeywords(3);
  helMonoLog(`create ${label} keywords (${keywords.join(' ')})`);
  const createOptions = getCreateOptions(keywords, options);
  const { copyToPath, copyFromPath, modName } = createOptions;

  // 复制模板项目文件
  helMonoLog(`start create ${label} to ${copyToPath}...`);
  fs.cpSync(copyFromPath, copyToPath, { recursive: true });
  helMonoLog(`create ${label} ${modName} done`);

  // 重写根目录的dev-info
  rewriteRootDevInfo(devInfo, createOptions);
  // 重新模块别名
  rewriteModAlias(createOptions);
  // 重写应用的 package.json
  rewritePkgJson(createOptions, options);
  // 安装依赖
  helMonoLog('pnpm install start...');
  shell.exec('pnpm install');
  helMonoLog('pnpm install done');

  if (autoStart) {
    shell.exec(`pnpm start ${modName}`);
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
