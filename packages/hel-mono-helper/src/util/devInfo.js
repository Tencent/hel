/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoAppConf} IMonoAppConf */
const { INNER_ACTION, CREATE_SHORT_PARAM_KEY } = require('../consts');
const { getDevInfoDirs } = require('./base');
const { purify, clone } = require('./dict');
const { getRawMonoJson, rewriteMonoJson, getModMonoDataDict } = require('./monoJson');
const { getPortByDevInfo } = require('./port');

let ensurePkgHelFn = null;
let handleDevInfoFn = null;

function setEnsurePkgHel(fn) {
  ensurePkgHelFn = fn;
}

function setHandleDevInfo(fn) {
  handleDevInfoFn = fn;
}

function getAppConfs(monoJson) {
  const argv = process.argv;
  const isChangeAliasCmd = argv.includes(INNER_ACTION.change) && argv.includes(CREATE_SHORT_PARAM_KEY.alias);

  const { mods = {} } = monoJson;
  const appConfs = {};
  const { monoDict } = getModMonoDataDict(monoJson);
  const monoJsonPkgNames = Object.keys(mods);
  const repoPkgNames = Object.keys(monoDict);

  const invalidPkgNames = monoJsonPkgNames.filter((v) => !repoPkgNames.includes(v));
  if (invalidPkgNames.length) {
    console.log(`Found invalid package names(${invalidPkgNames}) in hel-mono.json, mono-helper start to delete them ...`);
    const monoJsonCopy = clone(monoJson);
    invalidPkgNames.forEach((v) => delete monoJsonCopy.mods[v]);
    rewriteMonoJson(monoJsonCopy);
    console.log(`Delete invalid package names done`);
  }

  repoPkgNames.forEach((pkgName) => {
    const { port, alias, devHostname } = mods[pkgName] || {};
    const pkgMonoData = monoDict[pkgName] || {};
    let pkgHel = pkgMonoData.hel || {};
    const repoAlias = pkgMonoData.alias;

    if (!isChangeAliasCmd && alias && repoAlias && alias !== repoAlias) {
      const tip =
        `Found package ${pkgName} 's alias(${repoAlias}) not equal its hel-mono.json alias(${alias}), ` + 'please fix it manually!';
      throw new Error(tip);
    }

    if (ensurePkgHelFn) {
      pkgHel = ensurePkgHelFn(pkgHel, pkgName) || pkgHel;
    }
    const targetAlias = repoAlias || alias;

    appConfs[pkgName] = {
      port,
      alias: targetAlias,
      devHostname: pkgHel.devHostname || devHostname,
      hel: {
        appGroupName: pkgHel.groupName,
        appNames: pkgHel.names || {},
      },
    };
  });

  return appConfs;
}

function ensureAppConf(options) {
  /** /** @type {{devInfo:IDevInfo, conf: IMonoAppConf, pkgName: string, isSubMod: boolean}} */
  const { devInfo, conf, pkgName, isSubMod } = options;
  const { alias, ...rest } = conf;

  if (!rest.hel) {
    rest.hel = {};
  }
  if (!rest.hel.appGroupName) {
    rest.hel.appGroupName = pkgName;
  }
  if (!rest.hel.appNames) {
    rest.hel.appNames = {};
  }
  if (!rest.port) {
    rest.port = getPortByDevInfo(devInfo, isSubMod);
  }

  return rest;
}

function getIsAllowNull() {
  const argv = process.argv;
  return argv.includes(INNER_ACTION.initMono);
}

function inferDevInfo(allowMonoJsonNull) {
  // 允许 monoJson 为空时，getAppConfs 会自动修正和创建新的 hel-mono.json
  let allowNull = allowMonoJsonNull;
  if (allowNull === undefined) {
    allowNull = getIsAllowNull();
  }

  let monoJson = getRawMonoJson();
  if (!monoJson && !allowNull) {
    throw new Error(`Missing hel-mono.json file in current repo, please create one by "pnpm start .init-mono"`);
  }
  monoJson = monoJson || { mods: {} };

  const { appsDirs, subModDirs, externals, devHostname, helMicroName, helLibProxyName, exclude = [] } = monoJson;
  const appConfs = getAppConfs(monoJson);

  let devInfo = {
    appExternals: externals,
    appsDirs,
    subModDirs,
    exclude,
    appConfs,
    devHostname,
    helMicroName,
    helLibProxyName,
  };

  if (handleDevInfoFn) {
    devInfo = handleDevInfoFn(devInfo) || devInfo;
  }

  return devInfo;
}

function toMonoJson(/** @type {IDevInfo} */ devInfo, options = {}) {
  /** @type {IDevInfo} */
  const pureDevInfo = purify(devInfo);
  const { appConfs } = pureDevInfo;
  const newMods = {};
  const pkgNames = Object.keys(pureDevInfo.appConfs);

  const monoJson = getRawMonoJson() || {};
  const oriMods = monoJson.mods || {};
  const { monoDict } = getModMonoDataDict(monoJson);
  const { mods, ...rest } = monoJson;

  // 没有原始值的情况下才做一次 pkgNames 排序
  if (!Object.keys(oriMods).length) {
    pkgNames.sort();
  }

  pkgNames.forEach((name) => {
    const { alias, port } = appConfs[name];
    let targetPort = port;
    if (!targetPort) {
      const monoData = monoDict[name];
      if (!monoData) {
        // 以下操作会触发此逻辑
        // 1 用户手动在 hel-mono.json 将旧包名配置删除
        // 2 调用 rewriteMonoJsonForChange
        targetPort = getPortByDevInfo(pureDevInfo, options.isSubMod);
      } else {
        const { isSubMod } = monoData;
        targetPort = getPortByDevInfo(pureDevInfo, isSubMod);
      }
    }
    newMods[name] = purify({ alias, port: targetPort });
  });

  return { ...rest, mods: newMods };
}

module.exports = {
  getAppConfs,
  ensureAppConf,
  getDevInfoDirs,
  inferDevInfo,
  setEnsurePkgHel,
  setHandleDevInfo,
  toMonoJson,
};
