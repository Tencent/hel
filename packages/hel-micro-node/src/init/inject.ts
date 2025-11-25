import type { DictData } from '../base/types';
import { getSdkCtx } from '../context';
import { markHelEnv, markHelHit } from './util';

/** 覆盖 ctx.render，根据不同的条件确定是否启用新模式渲染 */
export class HelModViewMiddleware {
  public name = 'mod-view-middleware';

  // TODO 实现生成中间件逻辑
  public run = async (ctx: any, next: any) => {
    // 处于性能考虑（对于v8引擎底层来说，动态读取要慢于直接获取），暂不考虑支持动态设置和调用 render 函数，
    // 如后续有需要再扩展 renderKey 并补上以下逻辑
    // const renderFn = ctx[this.renderKey];
    // ctx[this.renderKey] = async function(){ ... };
    const render = ctx.render.bind(ctx);
    ctx.render = async function (viewPath: string, pageData?: DictData) {
      markHelEnv(ctx);
      const result = await getSdkCtx().getHelRenderParams({ ctx, viewPath, pageData });
      markHelHit(ctx);
      return render(result.viewPath, result.pageData);
    };
    await next();
  };
}
