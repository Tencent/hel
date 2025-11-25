/**
 * 集中式的把所有逻辑的路由定义在此文件里，在 at/core/app.ts 文件里会被载入
 */
import { hello } from '@hel-demo/mono-libs';
import path from 'path';
// @ts-ignore this is a non-exist node module, just map it to hel module
import { hello as h2 } from 'hel-hello-helpack';
// @ts-ignore this is a non-exist node module, just map it  to local file
import { hello as h3 } from 'my-mod';
import { getRouter, restful } from './at/core/routerFactory';
import { getNodeModDesc, getNodeModVer, importNodeMod, importNodeModByPath, resolveNodeMod } from './libs/hmn';

restful('/api/hello', () => {
  try {
    // const str = libs.hello();
    const str = hello();
    return str;
  } catch (err) {
    return err.message;
  }
});

restful('/api/getModDesc', async () => {
  const desc = getNodeModDesc('@hel-demo/mono-libs');
  return desc;
});

restful('/api/getModPathInfo', async () => {
  const pathInfo = resolveNodeMod('@hel-demo/mono-libs');
  return pathInfo;
});

restful('/api/getModVer', () => {
  const ver = getNodeModVer('@hel-demo/mono-libs');
  return ver;
});

restful('/api/changeVer/:ver', async (ctx) => {
  const ver = ctx.req.params.ver || '1.0.0';
  const { mod } = await importNodeMod('@hel-demo/mono-libs', { ver });
  return { desc: 'update successfully', fnResult: mod.hello(), staticFnResult: hello() };
});

restful('/api/resolveMod', () => {
  const pathInfo = resolveNodeMod('@hel-demo/mono-libs');
  return pathInfo;
});

restful('/api/showVirtualNodeModule', async () => {
  const result = h2();
  return { staticFnResult: result, desc: 'hel-hello-helpack is a virtual node module' };
});

restful('/api/changeVirtualVer/:ver', async (ctx) => {
  const { ver } = ctx.req.params;
  const { mod } = await importNodeMod('hel-hello-helpack', { ver });
  return { desc: 'update successfully', fnResult: mod.hello(), staticFnResult: h2() };
});

restful('/api/showMyMod', async (ctx) => {
  return { desc: 'my-mod', staticFnResult: h3(), pathInfo: resolveNodeMod('my-mod') };
});

restful('/api/changeVirtualLocalModToV2', async (ctx) => {
  importNodeModByPath('my-mod', path.join(__dirname, '../my-mod/lib-v2/srv/index.js'));
  return { desc: 'my-mod', staticFnResult: h3(), pathInfo: resolveNodeMod('my-mod') };
});

/**
 * 暴露配置好的router对象
 */
export const APP_ROUTER = getRouter();
