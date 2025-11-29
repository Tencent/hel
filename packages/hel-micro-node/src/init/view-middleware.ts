import { HEL_MOD_VIEW_MIDDLEWARE } from '../base/consts';
import type { DictData } from '../base/types';
import { getSdkCtx } from '../context';
import { markHelEnv, markHelHit } from './util';

/**
 * 生成中间件重写 ctx.render，用户可配合自定义的 getHelRenderParams 函数来
 * 注入不同的 hel 加工数据到下发的首页里
 */
export class HelModViewMiddleware {
  public name = HEL_MOD_VIEW_MIDDLEWARE;

  // 生成 node 中间件的逻辑
  public run = async (ctx: any, next: any) => {
    // 处于性能考虑（对于v8引擎底层来说，动态读取要慢于直接获取），暂不考虑支持动态设置和调用 render 函数，
    // 默认相信所有的 js 模块引擎渲染页面的函数名称叫 render，如后续有需要再扩展 renderKey 并补上以下逻辑：
    // const renderFn = ctx[this.renderKey];
    // ctx[this.renderKey] = async function(){ ... };
    const render = ctx.render.bind(ctx);
    ctx.render = async function (viewPath: string, pageData?: DictData) {
      markHelEnv(ctx);
      // 调用用户配置的 getHelRenderParams 函 生成新的 pageData
      const result = await getSdkCtx().getHelRenderParams({ ctx, viewPath, pageData });
      markHelHit(ctx);
      return render(result.viewPath, result.pageData);
    };
    await next();
  };
}
