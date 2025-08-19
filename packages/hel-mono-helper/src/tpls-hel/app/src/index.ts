// @ts-nocheck [hel-del-after-copy]
/**
 * 为 hel 模式开发或打包的应用动态载入子模块
 */
import 'hel-iso';
import { monoLog } from 'hel-mono-runtime-helper';
import { APP_GROUP_NAME, APP_NAME } from './subApp';
import { preFetchHelDeps } from './util';

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
