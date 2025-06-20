/**
 * 辅助工具函数
 */
import isTestFn from 'is-test';
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME } from './subApp';

type HelDep = { appName: string; appGroupName: string; packName: string };

export function monoLog(...args: any[]) {
  console.log(`[hel-mono] `, ...args);
}

/**
 * 获取hel模块依赖，根据不同运行环境拉不同hel模块
 */
export function getHelDeps() {
  const depPackNames = Object.keys(DEV_INFO.appConfs);
  const helDeps: HelDep[] = [];

  depPackNames.forEach((packName) => {
    const helConf = DEV_INFO.appConfs[packName].hel;
    if (!helConf || helConf.appGroupName === APP_GROUP_NAME) return;

    const { appNames = { test: '', prod: '' }, appGroupName = '' } = helConf;
    if (appGroupName) {
      const helModName = isTestFn(APP_GROUP_NAME) ? appNames.test : appNames.prod || appGroupName;
      helDeps.push({ appName: helModName, appGroupName, packName });
    }
  });

  return helDeps;
}
