import { ICuteExpressCtxBase } from 'at/types';
// @ts-ignore this is a non-exist node module, just map it to hel module
import { hello as h2 } from 'hel-hello-helpack';
// @ts-ignore this is a non-exist node module, just map it  to local file
import { hello as h3 } from 'my-mod';
import path from 'path';
import { importNodeMod, importNodeModByPath, resolveNodeMod } from '../libs/hmn';
export async function changeVirtualVer(ctx: ICuteExpressCtxBase) {
  const { ver } = ctx.req.params;
  const { mod } = await importNodeMod('hel-hello-helpack', { ver });
  return { desc: 'update successfully', fnResult: mod.hello(), staticFnResult: h2() };
}

export async function showVirtualNodeModule(ctx: ICuteExpressCtxBase) {
  const result = h2();
  return { staticFnResult: result, desc: 'hel-hello-helpack is a virtual node module' };
}

export async function showMyMod(ctx: ICuteExpressCtxBase) {
  return { desc: 'my-mod', staticFnResult: h3(), pathInfo: resolveNodeMod('my-mod') };
}

export async function changeVirtualLocalModToV2(ctx: ICuteExpressCtxBase) {
  importNodeModByPath('my-mod', path.join(__dirname, '../my-mod/lib-v2/srv/index.js'));
  return { desc: 'my-mod', staticFnResult: h3(), pathInfo: resolveNodeMod('my-mod') };
}
