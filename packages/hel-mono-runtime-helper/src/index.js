/**
 * 辅助工具函数
 */
/** @typedef {import('hel-mono-types').IMonoInjectedAppBaseConf} IMonoInjectedAppBaseConf */
/** @typedef {import('./types').HelDep} HelDep */
/** @typedef {import('./types').IMakeRuntimeUtilOptions} IMakeRuntimeUtilOptions */
const START_WITH_REMOTE = '3';

function getWindow() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return null;
}

export function getDevUrlKey(modName) {
  return `dev:${modName}`;
}

export function getHelConfKeys(modName) {
  return {
    branchId: `hel/branch:${modName}`,
    versionId: `hel/ver:${modName}`,
    projectId: `hel/proj:${modName}`,
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
  console.log(`[hel-mono] `, ...args);
}

export function makeRuntimeUtil(/** @type {IMakeRuntimeUtilOptions} */ options) {
  const { DEV_INFO, APP_GROUP_NAME, DEPLOY_ENV, isDev, startMode } = options;

  return {
    /**
     * 获取hel模块依赖，根据不同运行环境拉不同hel模块
     */
    getHelDeps() {
      const depPackNames = Object.keys(DEV_INFO.appConfs);
      /** @type HelDep[] */
      const helDeps = [];

      depPackNames.forEach((packName) => {
        const helConf = DEV_INFO.appConfs[packName].hel;
        if (helConf.appGroupName === APP_GROUP_NAME) return;

        const { appNames, appGroupName = '' } = helConf;
        if (appGroupName) {
          const helModName = appNames[DEPLOY_ENV] || appGroupName;
          helDeps.push({ appName: helModName, appGroupName, packName });
        }
      });

      return helDeps;
    },
    getPrefetchParams(appName, /** @type {IMonoInjectedAppBaseConf} */ conf) {
      const { port = 3000, devHostname = DEV_INFO.devHostname } = conf;
      const { appGroupName } = conf.hel;
      const devUrl = getStorageValue(getDevUrlKey(appGroupName));
      const confKeys = getHelConfKeys(appGroupName);
      const params = {
        branchId: getStorageValue(confKeys.branchId),
        versionId: getStorageValue(confKeys.versionId),
        projectId: getStorageValue(confKeys.projectId),
      };

      if (devUrl) {
        monoLog(`found devUrl ${devUrl} for ${appName}`);
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
