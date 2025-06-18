// @ts-nocheck [hel-del-after-copy]
/**
 * 为 hel 模式开发或打包的应用动态载入子模块
 */
import 'hel-iso';
import { preFetchLib } from 'hel-micro';
import { DEV_INFO } from './devInfo';
import { APP_GROUP_NAME, APP_NAME } from './subApp';
import { getHelDeps } from './util';

async function preFetchHelDeps() {
  const helDeps = getHelDeps();
  const isDev = process.env.NODE_ENV === 'development';
  if (!helDeps.length) return;

  const start = Date.now();
  const depNames = helDeps.map(v => v.appName);
  console.log(`start preFetchLib (${depNames}) isDev=${isDev}`);
  await Promise.all(helDeps.map(({ appName, appGroupName, packName }) => {
    const { port = 3000, devHostname = DEV_INFO.devHostname } = DEV_INFO.appConfs[packName] || {};
    return preFetchLib(appName, { custom: { enable: isDev, host: `${devHostname}:${port}`, appGroupName } });
  }));
  console.log(`end preFetchLib, costs ${Date.now() - start}`);
}

async function main() {
  console.log(`load hel app ${APP_GROUP_NAME}(${APP_NAME})`);
  await preFetchHelDeps();
  await import('{{APP_PACK_NAME}}');
}

main().catch((err) => {
  console.log('----- run hel app error ------');
  console.error(err);
});
