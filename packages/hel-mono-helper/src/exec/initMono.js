/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const { rewriteMonoJson } = require('../util/monoJson');
const { toMonoJson } = require('../util/devInfo');

/**
 * 执行 npm start .init-mono 命令
 * 重写根目录的hel-mono.json
 */
exports.initMono = function (/** @type {IDevInfo} */ devInfo) {
  const monoJson = toMonoJson(devInfo);
  rewriteMonoJson(monoJson);
};
