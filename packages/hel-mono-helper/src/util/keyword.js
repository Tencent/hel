const { getPureArgv } = require('./argv');

/**
 * 获取当前正在启动的应用关键名称，可能是目录名称(可能含模式后缀 hub:hel hub:proxy ...)、包名、内置动作名
 */
exports.getCmdKeywordName = function (nameIndex = 2) {
  const argv = getPureArgv();
  // process.env.npm_config_argv 在执行 pnpm run 时取不到，估此处用更通用的 process.argv 去取应用名
  // 不传任何参数默认启动 DEFAULT_HUB
  // argv 形如 ['**/**/bin/node', '**/**/hel-mono/dev/root-scripts/executeStart', 'dirName', ...]
  const keywordName = argv[nameIndex] || '';
  return keywordName;
};

/**
 * 获取有效的关键字数组
 */
exports.getCmdKeywords = function (sliceStart = 2) {
  const argv = getPureArgv();
  // argv 形如 ['**/**/bin/node', '**/**/hel-mono/dev/root-scripts/executeStart', 'dirName', ...]
  const allKeywords = argv || [];
  // 默认截掉前2位，通常来说从第二位开始取是我们想要的
  return allKeywords.slice(sliceStart);
};
