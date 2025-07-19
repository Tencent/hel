import { isMasterApp } from 'hel-iso';
import { libReady } from 'hel-lib-proxy';
import { preFetchLib } from 'hel-micro';
import { DEV_INFO } from './configs/devInfo';
import { APP_GROUP_NAME, APP_NAME } from './configs/subApp';
import { getDevKey, getHelDeps, getStorageValue, monoLog } from './configs/util';

async function preFetchOtherDeps() {
  const helDeps = getHelDeps();
  if (!helDeps.length) return;

  const isDev = process.env.NODE_ENV === 'development';
  const start = Date.now();
  const depNames = helDeps.map((v) => v.appName);
  monoLog(`start preFetchLib (${depNames}) isDev=${isDev}`);
  await Promise.all(
    helDeps.map(({ appName, appGroupName, packName }) => {
      const { port = 3000, devHostname = DEV_INFO.devHostname } = DEV_INFO.appConfs[packName] || {};
      const devUrl = getStorageValue(getDevKey(appGroupName));
      if (devUrl) {
        monoLog(`found devUrl ${devUrl} for ${appName}`);
      }
      const host = devUrl || `${devHostname}:${port}`;
      const enable = isDev || !!devUrl;

      return preFetchLib(appName, { custom: { enable, host, appGroupName } });
    }),
  );
  monoLog(`end preFetchLib, costs ${Date.now() - start} ms`);
}

async function main() {
  monoLog(`load hel mod ${APP_GROUP_NAME}(${APP_NAME})`);
  // 预拉取其他依赖
  await preFetchOtherDeps();
  const libProperties = await import('./entrance/libProperties.ts');
  // 表示模块已准备就绪，注意此处传递的是 default
  libReady(APP_GROUP_NAME, libProperties.default, { appName: APP_NAME });

  // 是主应用时（即不是被别的模块触发载入的情况），自己挂载渲染节点，方便本地调试
  if (isMasterApp()) {
    await import('./loadApp.tsx');
  }
}

main().catch(console.error);

// avoid isolatedModules warning
const fileTip = 'Hel Module Index file';
export default fileTip;
