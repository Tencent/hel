/**
 * 辅助工具函数
 */
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME } from './subApp';

type HelDep = { appName: string; appGroupName: string; packName: string; platform?: string };

// deployEnv may replaced by build script
const deployEnv = 'prod';

function getWindow() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return null;
}

export function monoLog(...args: any[]) {
  console.log(`[hel-mono] `, ...args);
}

export function getDevKey(modName: string) {
  return `dev:${modName}`;
}

export function getStorageValue(key: string) {
  const windowVar = getWindow();
  if (windowVar) {
    return windowVar.localStorage.getItem(key) || '';
  }
  return '';
}

export function getDeployEnv() {
  return deployEnv;
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
