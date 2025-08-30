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
  return null;
}

export const HEL_DEV_KEY_PREFIX = {
  devUrl: 'hel.dev',
  branchId: 'hel.branch',
  versionId: 'hel.ver',
  projectId: 'hel.proj',
};

export function getDevUrlKey(groupName) {
  return `${HEL_DEV_KEY_PREFIX.devUrl}:${groupName}`;
}

export function getHelConfKeys(groupName) {
  return {
    branchId: `${HEL_DEV_KEY_PREFIX.branchId}:${groupName}`,
    versionId: `${HEL_DEV_KEY_PREFIX.versionId}:${groupName}`,
    projectId: `${HEL_DEV_KEY_PREFIX.projectId}:${groupName}`,
  };
}

export function getStorageValue(key) {
  const windowVar = getWindow();
  if (windowVar) {
    return windowVar.localStorage.getItem(key) || '';
  }
  return '';
}

export function monoLog(...args) {
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

export function makeRuntimeUtil(/** @type {IMakeRuntimeUtilOptions} */ options) {
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

        const { names, groupName = '', platform } = mod;
        if (groupName) {
          const helModName = names[DEPLOY_ENV] || groupName;
          helModNames.push(helModName);
          helDeps.push({ helModName, groupName, pkgName, platform });
        }
      });

      return { helModNames, helDeps };
    },
    getPrefetchParams(helModName, /** @type {IMonoInjectedMod} */ mod) {
      const { port = 3000, devHostname = defaultDH, groupName } = mod;
      const devUrl = getStorageValue(getDevUrlKey(groupName));
      const confKeys = getHelConfKeys(groupName);
      const params = {
        branchId: getStorageValue(confKeys.branchId),
        versionId: getStorageValue(confKeys.versionId),
        projectId: getStorageValue(confKeys.projectId),
      };

      if (devUrl) {
        monoLog(`found devUrl ${devUrl} for ${helModName}`);
        return { enable: true, host: devUrl, ...params };
      }

      if (!isDev) {
        return { enable: false, host: '', ...params };
      }

      const isStartWithRemoteDeps = startMode === START_WITH_REMOTE;
      if (isStartWithRemoteDeps) {
        return { enable: false, host: '', ...params };
      }

      return { enable: true, host: `${devHostname}:${port}`, ...params };
    },
  };
}
