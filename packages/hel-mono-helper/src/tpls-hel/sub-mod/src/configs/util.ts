/**
 * 辅助工具函数
 */
import type { IMonoInjectedAppBaseConf } from 'hel-mono-types';
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME } from './subApp';

type HelDep = { appName: string; appGroupName: string; packName: string; platform?: string };
const START_WITH_REMOTE = '3';

// deployEnv may replaced by build script
// replace result: in build process, no process.env.DEPLOY_ENV found, use prod instead
const deployEnv = 'prod';

function getWindow() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return null;
}

function getDevKey(modName: string) {
  return `dev:${modName}`;
}

function getStorageValue(key: string) {
  const windowVar = getWindow();
  if (windowVar) {
    return windowVar.localStorage.getItem(key) || '';
  }
  return '';
}

export function monoLog(...args: any[]) {
  console.log(`[hel-mono] `, ...args);
}

export function getDeployEnv() {
  return deployEnv;
}

export function getIsDev() {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev;
}

/**
 * 获取hel模块依赖，根据不同运行环境拉不同hel模块
 */
export function getHelDeps() {
  const depPackNames = Object.keys(DEV_INFO.appConfs);
  const helDeps: HelDep[] = [];

  depPackNames.forEach((packName) => {
    const helConf = DEV_INFO.appConfs[packName].hel;
    if (helConf.appGroupName === APP_GROUP_NAME) return;

    const { appNames, appGroupName = '' } = helConf;
    if (appGroupName) {
      const helModName = appNames[deployEnv] || appGroupName;
      helDeps.push({ appName: helModName, appGroupName, packName });
    }
  });

  return helDeps;
}

export function getEnableAndHost(appName: string, conf: IMonoInjectedAppBaseConf) {
  const { port = 3000, devHostname = DEV_INFO.devHostname } = conf;
  const { appGroupName } = conf.hel;
  const devUrl = getStorageValue(getDevKey(appGroupName));
  if (devUrl) {
    monoLog(`found devUrl ${devUrl} for ${appName}`);
    return { enable: true, host: devUrl };
  }

  const isDev = getIsDev();
  if (!isDev) {
    return { enable: false, host: '' };
  }

  const startMode = process.env.REACT_APP_HEL_START;
  const isStartWithRemoteDeps = startMode === START_WITH_REMOTE;
  if (isStartWithRemoteDeps) {
    return { enable: false, host: '' };
  }

  return { enable: true, host: `${devHostname}:${port}` };
}
