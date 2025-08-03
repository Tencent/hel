const packageJsonInfo = require('../package.json');

const { name: cliPkgName, version: cliPkgVersion } = packageJsonInfo || {};

// 远程模板仓库地址
const repoUrlDict = {
  react: 'https://github.com/hel-eco/hel-mono.git',
};

const defaultConfig = {
  cliPkgName,
  cliPkgVersion,
  helMonoTemplates: 'hel-mono-templates',
  repoUrlDict,
  repoUrlPrefix: 'https://github.com/hel-eco/hel-mono',
  cliKeyword: 'hel-mono',
  cliFullKeyword: 'create-hel-mono',
  basedOn: '',
};

exports.getConfig = function () {
  return defaultConfig;
};

exports.setConfig = function (toMerge) {
  Object.assign(defaultConfig, toMerge || {});
};
