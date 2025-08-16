/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo */
const { helMonoLog } = require('../util');
const { HITABLE_SCRIPT_KEYS } = require('../consts');

function getPkgNameFromMayAlias(/** @type {IMonoDevInfo} */ devInfo, mayAlias) {
  let pureKeyword = mayAlias;
  // mayAlias 可能形如: @h:start，需要去掉分号，仅取第一位
  if (mayAlias.includes(':')) {
    const list = mayAlias.split(':');
    const [str1] = list;
    pureKeyword = str1;
  }

  let newKeyword = '';
  const { appConfs } = devInfo;
  const keys = Object.keys(appConfs);
  for (const key of keys) {
    const conf = appConfs[key];
    if (conf.alias === pureKeyword) {
      newKeyword = key;
      break;
    }
  }

  return newKeyword;
}

/**
 * 分析可能带有冒号的名字，
 * 名字包含了冒号时，是 {dirName}:{mode} 格式
 */
function analyzeColonKeywordName(/** @type {IMonoDevInfo} */ devInfo, rawKeywordName, rawScriptCmdKey) {
  let keywordName = rawKeywordName;
  let scriptCmdKey = rawScriptCmdKey;

  // 名字包含了启动方式，例如 hub:hel
  if (rawKeywordName.includes(':')) {
    const list = rawKeywordName.split(':');
    const [str1, ...rest] = list;
    const mode = rest.join(':');
    keywordName = str1;

    // 是 xxx:proxy 时，启动的是 .hel/apps或.hel/packages 下的应用，cmdKey 无需再保留后缀
    if (mode === 'proxy') {
      scriptCmdKey = rawScriptCmdKey;
    } else if (HITABLE_SCRIPT_KEYS.includes(mode)) {
      // 这些命令式可直接命中的，可直接把 scriptCmdKey 重写为 mode 值
      // 例如是 xxx:tsup 时，执行 pnpm --filter xxx run tsup
      scriptCmdKey = mode;
    } else {
      scriptCmdKey = `${rawScriptCmdKey}:${mode}`;
    }
  }

  const pkgName = getPkgNameFromMayAlias(devInfo, rawKeywordName);
  if (pkgName) {
    helMonoLog(`found alias from ${rawKeywordName}, we will use its pkgname ${pkgName}`);
    keywordName = pkgName;
  }

  return { keywordName, scriptCmdKey };
}

exports.extractCmdData = function (/** @type {IMonoDevInfo} */ devInfo, rawKeywordName, startOrBuild) {
  const data = analyzeColonKeywordName(devInfo, rawKeywordName, startOrBuild);
  return data;
};
