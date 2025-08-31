import { isMasterApp } from 'hel-iso';
import { libReady } from 'hel-lib-proxy';
import { monoLog } from 'hel-mono-runtime-helper';
import { APP_GROUP_NAME, APP_NAME } from './configs/subApp';
import { preFetchHelDeps } from './configs/util';

const needRunHook = true;

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
  monoLog(`load hel mod ${label}`);

  // 预拉取其他依赖
  await preFetchHelDeps();
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
