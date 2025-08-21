const packageJsonInfo = require('../package.json');
const { HEL_MONO_TEMPLATES, CLI_KEYWORD, CLI_FULL_KEYWORD, REPO_URL_PREFIX, TEMPLATE_REACT_MONO: TEMPLATE } = require('./consts');

const { name: cliPkgName, version: cliPkgVersion } = packageJsonInfo || {};

// 远程模板仓库地址
const repoUrlDict = {
  [TEMPLATE]: 'https://github.com/hel-eco/hel-mono.git',
};

// 模板名在 hel-mono-templates 包下的子目录名称映射
const templateLocalDirDict = {
  [TEMPLATE]: 'hel-mono-react',
};

const defaultConfig = {
  cliPkgName,
  cliPkgVersion,
  pkgManager: 'npm',
  helMonoTemplates: HEL_MONO_TEMPLATES,
  repoUrlDict,
  templateLocalDirDict,
  repoUrlPrefix: REPO_URL_PREFIX,
  cliKeyword: CLI_KEYWORD,
  cliFullKeyword: CLI_FULL_KEYWORD,
  contactAuthor: 'Contact author: gmail(zhongzhengkai@gmail.com), QQ(624313307)',
  contactAuthorReferLen: 65,
  basedOn: '',
};

exports.getConfig = function () {
  return defaultConfig;
};

exports.setConfig = function (toMerge) {
  Object.assign(defaultConfig, toMerge || {});
};
