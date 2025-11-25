/** 覆盖 ctx.render，根据不同的条件确定是否启用新模式渲染 */
export declare class HelModViewMiddleware {
    name: string;
    run: (ctx: any, next: any) => Promise<void>;
}
