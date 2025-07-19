// @ts-nocheck [hel-del-after-copy]
/**
 * 为 hel 模式开发或打包的应用动态载入子模块
 */
import 'hel-iso';
import { preFetchLib } from 'hel-micro';
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME, APP_NAME } from './subApp';
import { getDevKey, getHelDeps, getStorageValue, monoLog } from './util';

async function preFetchHelDeps() {
  const helDeps = getHelDeps();
  if (!helDeps.length) return;

  const isDev = process.env.NODE_ENV === 'development';
  const start = Date.now();
  const depNames = helDeps.map((v) => v.appName);
  monoLog(`start preFetchLib (${depNames}) isDev=${isDev}`);
  await Promise.all(
    helDeps.map(({ appName, appGroupName, packName, platform }) => {
      const { port = 3000, devHostname = DEV_INFO.devHostname } = DEV_INFO.appConfs[packName];
      const devUrl = getStorageValue(getDevKey(appGroupName));
      if (devUrl) {
        monoLog(`found devUrl ${devUrl} for ${appName}`);
      }
      const host = devUrl || `${devHostname}:${port}`;
      const enable = isDev || !!devUrl;

      return preFetchLib(appName, { custom: { enable, host, appGroupName }, platform });
    }),
  );
  monoLog(`end preFetchLib, costs ${Date.now() - start} ms`);
}

async function main() {
  monoLog(`load hel app ${APP_GROUP_NAME}(${APP_NAME})`);
  await preFetchHelDeps();
  await import('{{APP_PACK_NAME}}');
}

main().catch((err) => {
  monoLog('----- run hel app error ------');
  console.error(err);
});
