/**
 * 辅助工具函数
 */
/** @typedef {import('hel-mono-types').IMonoInjectedMod} IMonoInjectedMod */
/** @typedef {import('./types').IHelDep} IHelDep */
/** @typedef {import('./types').IMakeRuntimeUtilOptions} IMakeRuntimeUtilOptions */
const START_WITH_REMOTE = '3';

function getWindow() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return {};
}

function getSpecifiedVer(helModName, platform) {
  const vers = getWindow().__HEL_MOD_VERS__ || {};
  const key = platform ? `${platform}/${helModName}` : helModName;
  return vers[key];
}

function setHelModVers(newVers) {
  let vers = getWindow().__HEL_MOD_VERS__;
  if (!vers) {
    vers = {};
    getWindow().__HEL_MOD_VERS__ = vers;
  }
  Object.assign(vers, newVers);
}

function getHostNode(id = 'hel-app-root') {
  const { document } = getWindow();
  let node = document.getElementById(id);
  if (!node) {
    node = document.createElement('div');
    node.id = id;
    document.body.appendChild(node);
  }
  return node;
}

const HEL_DEV_KEY_PREFIX = {
  devUrl: 'hel.dev',
  branchId: 'hel.branch',
  versionId: 'hel.ver',
  projectId: 'hel.proj',
};

function getHelConfKeys(groupName) {
  return {
    branchId: `${HEL_DEV_KEY_PREFIX.branchId}:${groupName}`,
    devUrl: `${HEL_DEV_KEY_PREFIX.devUrl}:${groupName}`,
    versionId: `${HEL_DEV_KEY_PREFIX.versionId}:${groupName}`,
    projectId: `${HEL_DEV_KEY_PREFIX.projectId}:${groupName}`,
  };
}

function getStorageValue(key) {
  const win = getWindow();
  if (win.localStorage) {
    return win.localStorage.getItem(key) || '';
  }
  return '';
}

function monoLog(...args) {
  const argv = Array.from(args);
  const len = args.length;
  const prefix = '[hel-mono]';
  if (len === 1) {
    return console.log(`%c${prefix} ${args[0]}`, 'color:#eaa10f');
  }
  if (len === 2) {
    return console.log(`%c${prefix} ${args[0]} ${args[1]}`, 'color:#eaa10f');
  }
  console.log(`[hel-mono]`, ...argv);
}

function makeRuntimeUtil(/** @type {IMakeRuntimeUtilOptions} */ options) {
  const { DEV_INFO, APP_GROUP_NAME, DEPLOY_ENV, isDev, startMode } = options;
  const defaultDH = DEV_INFO.devHostname;

  return {
    /**
     * 获取hel模块依赖，根据不同运行环境拉不同hel模块
     */
    getHelDeps() {
      const { mods } = DEV_INFO;
      const depPkgNames = Object.keys(mods);
      /** @type IHelDep[] */
      const helDeps = [];
      const helModNames = [];

      depPkgNames.forEach((pkgName) => {
        const mod = mods[pkgName];
        if (mod.groupName === APP_GROUP_NAME) return;

        const { names = {}, groupName = '', platform } = mod;
        if (groupName) {
          const helModName = names[DEPLOY_ENV] || groupName;
          helModNames.push(helModName);
          helDeps.push({ helModName, groupName, pkgName, platform });
        }
      });

      return { helModNames, helDeps };
    },
    getPrefetchParams(helModName, /** @type {IMonoInjectedMod} */ mod) {
      const { port = 3000, devHostname = defaultDH, groupName, isNm, metaApiPrefix, platform } = mod;
      const confKeys = getHelConfKeys(groupName);
      const devUrl = getStorageValue(confKeys.devUrl);
      const params = {
        versionId: getStorageValue(confKeys.versionId) || getSpecifiedVer(helModName, platform),
        branchId: getStorageValue(confKeys.branchId),
        projectId: getStorageValue(confKeys.projectId),
        customMetaUrl: metaApiPrefix,
      };

      if (devUrl) {
        monoLog(`found devUrl ${devUrl} for ${groupName}`);
        return { enable: true, host: devUrl, ...params };
      }

      const isStartWithRemoteDeps = startMode === START_WITH_REMOTE;
      // 生产环境、基于 hwr 命令启动、来自 node_module 的 hel模块，任意一个均采用拉取远端已编译模块的模式来执行
      if (!isDev || isStartWithRemoteDeps || isNm) {
        if (isNm) {
          monoLog(`found node module ${groupName} compiled with hel mode to run`);
        }
        // 显示指定了 customMetaUrl 值，才需要显式的把 semverApi 置为 false
        if (params.customMetaUrl) {
          params.semverApi = false;
        }
        return { enable: false, host: '', ...params };
      }

      let host = `${devHostname}:${port}`;
      if (!host.startsWith('http')) {
        host = `http://${host}`;
      }
      return { enable: true, host, ...params };
    },
  };
}

module.exports = {
  setHelModVers,
  getHostNode,
  HEL_DEV_KEY_PREFIX,
  getHelConfKeys,
  getStorageValue,
  monoLog,
  makeRuntimeUtil,
};
