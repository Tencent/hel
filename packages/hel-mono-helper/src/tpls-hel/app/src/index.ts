// @ts-nocheck [hel-del-after-copy]
/**
 * 为 hel 模式开发或打包的应用动态载入子模块
 */
import 'hel-iso';
import { preFetchLib } from 'hel-micro';
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME, APP_NAME } from './subApp';
import { getHelDeps, getIsDev, getEnableAndHost, monoLog } from './util';

async function preFetchHelDeps() {
  const helDeps = getHelDeps();
  if (!helDeps.length) return;

  const start = Date.now();
  const depNames = helDeps.map((v) => v.appName);
  monoLog(`start preFetchLib (${depNames}) isDev=${getIsDev()}`);
  await Promise.all(
    helDeps.map(({ appName, appGroupName, packName, platform }) => {
      const { enable, host } = getEnableAndHost(appName, DEV_INFO.appConfs[packName]);
      return preFetchLib(appName, { custom: { enable, host, appGroupName }, platform });
    }),
  );
  monoLog(`end preFetchLib, costs ${Date.now() - start} ms`);
}

async function main() {
  const label = APP_GROUP_NAME === APP_NAME ? APP_NAME : `${APP_GROUP_NAME}(${APP_NAME})`;
  monoLog(`load hel app ${label}`);
  await preFetchHelDeps();
  await import('{{APP_PACK_NAME}}');
}

main().catch((err) => {
  monoLog('----- run hel app error ------');
  console.error(err);
});
