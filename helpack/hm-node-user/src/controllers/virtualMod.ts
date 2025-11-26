import { ICuteExpressCtxBase } from 'at/types';
// @ts-ignore this is a non-exist node module, just map it to hel module
import { hello as h2 } from 'hel-hello-helpack';
import { importNodeMod } from '../libs/hmn';

export async function changeVirtualVer(ctx: ICuteExpressCtxBase) {
  const { ver } = ctx.req.params;
  const { mod } = await importNodeMod('hel-hello-helpack', { ver });
  return { desc: 'update successfully', fnResult: mod.hello(), staticFnResult: h2() };
}
