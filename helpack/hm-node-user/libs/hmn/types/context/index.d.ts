import type { IHMNHooks, IPlatformConfig, IPreloadMiddlewareOptions, ISDKPlatContext } from '../base/types';
export declare function makeSdkCtx(platform: string, options: {
    registrationSource?: string;
    isActive: boolean;
}): ISDKPlatContext;
/**
 * 获取与平台相关的 sdk 上下文对象
 */
export declare function getSdkCtx(platform?: string): ISDKPlatContext;
export declare function mergeConfig(config: IPlatformConfig): void;
/**
 * 合并用户透传的可选参数，可能会对部分参数做处理后再合并
 */
export declare function mergeOptions(passOptions: IPreloadMiddlewareOptions): void;
export declare function addBizHooks(hooks: IHMNHooks, platform?: string): boolean;
