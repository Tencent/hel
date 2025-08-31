// @ts-nocheck [hel-del-after-copy]
/**
 * 为 hel 模式开发或打包的应用动态载入子模块
 */
import { isMasterApp } from 'hel-iso';
import { libReady, appReady } from 'hel-lib-proxy';
import { monoLog } from 'hel-mono-runtime-helper';
import { APP_GROUP_NAME, APP_NAME } from './subApp';
import { preFetchHelDeps } from './util';

const needRunHook = true;
// process.env.HEL_BUILD=3 时（HEL_ALL_BUILD），此处 needHelDeps 会编译为 false
const needHelDeps = true;
const loadModeLabel = needHelDeps ? 'hel micro-module mode' : 'hel legacy mode';

async function mayLoadAsSubMod() {
  const RootComp = await import('../App');
  if (RootComp) {
    monoLog('found root comp to emit');
    appReady(APP_GROUP_NAME, RootComp, { appName: APP_NAME });
  }

  const shareModules = await import('../hel-share');
  if (shareModules) {
    monoLog('found share modules to emit');
    libReady(APP_GROUP_NAME, shareModules, { appName: APP_NAME });
  }
}

async function runHelHook() {
  const helHook: any = await import('../hel-hook');
  if (helHook.beforeStartApp) {
    await helHook.beforeStartApp();
  }
}

async function main() {
  if (needRunHook) {
    await runHelHook();
  }
  const label = APP_GROUP_NAME === APP_NAME ? APP_NAME : `${APP_GROUP_NAME}(${APP_NAME})`;
  monoLog(`load hel app ${label} as ${loadModeLabel}`);

  if (needHelDeps) {
    await preFetchHelDeps();
  }

  if (isMasterApp()) {
    await import('{{APP_PACK_NAME}}');
    return;
  }

  await mayLoadAsSubMod();
}

main().catch((err) => {
  monoLog('----- run hel app error ------');
  console.error(err);
});
