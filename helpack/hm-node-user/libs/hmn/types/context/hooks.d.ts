import type { IHMNHooks, THookType } from '../base/types';
export declare function addBizHooks(hooks: IHMNHooks, platform?: string): boolean;
export declare function triggerHook(hookType: THookType, params: any, platform?: string): void;
export declare function isHookValid(hookType: THookType, platform?: string): boolean;
