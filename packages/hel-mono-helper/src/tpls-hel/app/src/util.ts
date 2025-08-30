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
  const { helModNames, helDeps } = runtimeUtil.getHelDeps();
  if (!helModNames.length) return;

  const start = Date.now();
  monoLog(`start preFetchLib (${helModNames}) isDev=${isDev}`);
  await Promise.all(
    helDeps.map(({ helModName, groupName, pkgName, platform }) => {
      const { enable, host, ...rest } = runtimeUtil.getPrefetchParams(helModName, DEV_INFO.mods[pkgName]);
      return preFetchLib(helModName, { custom: { enable, host, appGroupName: groupName }, platform, ...rest });
    }),
  );
  monoLog(`end preFetchLib, costs ${Date.now() - start} ms`);
}
