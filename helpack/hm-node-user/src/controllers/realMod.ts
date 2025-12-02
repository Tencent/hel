import { hello } from '@hel-demo/mono-libs';
import { ICuteExpressCtxBase } from 'at/types';
import { getNodeModDesc, getNodeModVer, importNodeMod, resolveNodeMod } from '../libs/hmn';
export async function changeVer(ctx: ICuteExpressCtxBase) {
  const { ver } = ctx.req.params;
  const { mod } = await importNodeMod('@hel-demo/mono-libs', { ver });
  return { desc: 'update successfully', fnResult: mod.hello(), staticFnResult: hello() };
}

export async function helloHandler(ctx: ICuteExpressCtxBase) {
  try {
    const str = hello();
    return str;
  } catch (err) {
    return err.message;
  }
}

export async function getModDesc(ctx: ICuteExpressCtxBase) {
  const desc = getNodeModDesc('@hel-demo/mono-libs');
  return desc;
}

export async function getModPathInfo(ctx: ICuteExpressCtxBase) {
  const pathInfo = resolveNodeMod('@hel-demo/mono-libs');
  return pathInfo;
}

export async function getModVer(ctx: ICuteExpressCtxBase) {
  const ver = getNodeModVer('@hel-demo/mono-libs');
  return ver;
}

export async function resolveMod(ctx: ICuteExpressCtxBase) {
  const pathInfo = resolveNodeMod('@hel-demo/mono-libs');
  return pathInfo;
}
