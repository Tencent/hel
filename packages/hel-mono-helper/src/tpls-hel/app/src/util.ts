/**
 * 辅助工具函数
 */
import { preFetchLib } from 'hel-micro';
import { makeRuntimeUtil, monoLog } from 'hel-mono-runtime-helper';
import { DEPLOY_ENV } from './deployEnv';
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME } from './subApp';

const isDev = process.env.NODE_ENV === 'development';
const startMode = process.env.REACT_APP_HEL_START || '';

export const runtimeUtil = makeRuntimeUtil({ DEV_INFO, APP_GROUP_NAME, DEPLOY_ENV, isDev, startMode });

export async function preFetchHelDeps() {
  const helDeps = runtimeUtil.getHelDeps();
  if (!helDeps.length) return;

  const start = Date.now();
  const depNames = helDeps.map((v) => v.appName);
  monoLog(`start preFetchLib (${depNames}) isDev=${isDev}`);
  await Promise.all(
    helDeps.map(({ appName, appGroupName, packName, platform }) => {
      const { enable, host, ...rest } = runtimeUtil.getPrefetchParams(appName, DEV_INFO.appConfs[packName]);
      return preFetchLib(appName, { custom: { enable, host, appGroupName }, platform, ...rest });
    }),
  );
  monoLog(`end preFetchLib, costs ${Date.now() - start} ms`);
}
