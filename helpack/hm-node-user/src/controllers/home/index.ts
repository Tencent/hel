import { ICuteExpressCtxBase } from '../../at/types';

/**
 * 主页渲染逻辑
 */
export default async function (ctx: ICuteExpressCtxBase) {
  return ctx.view('index', { desc: 'hmn user' });
}
