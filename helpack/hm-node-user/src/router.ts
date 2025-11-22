/**
 * 集中式的把所有逻辑的路由定义在此文件里，在 at/core/app.ts 文件里会被载入
 */
// import { hello } from '@hel-demo/mono-libs';
import libs from '@hel-demo/mono-libs';
import { getRouter, restful } from './at/core/routerFactory';
import { getModDesc, getModVer, importMod, resolveMod } from './libs/hmnLib';

restful('/api/hello', () => {
  try {
    const str = libs.hello();
    return str;
  } catch (err) {
    return err.message;
  }
});

restful('/api/getModDesc', async () => {
  const desc = getModDesc('@hel-demo/mono-libs');
  return desc;
});

restful('/api/getModVer', () => {
  const ver = getModVer('@hel-demo/mono-libs');
  return ver;
});

restful('/api/changeVer/:ver', async (ctx) => {
  const ver = ctx.req.params.ver || '1.0.0';
  await importMod('@hel-demo/mono-libs', { ver });
});

restful('/api/resolveMod', () => {
  try {
    const result = resolveMod('@hel-demo/mono-libs');
    return result;
  } catch (err) {
    return err.message;
  }
});

/**
 * 暴露配置好的router对象
 */
export const APP_ROUTER = getRouter();
