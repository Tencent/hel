import type { IFetchModMetaOptions, IModConf, IShouldAcceptVersionParams } from '../base/types';
/** 获取用户的模块配置 */
export declare function getModConf(appName: string, platform?: string): IModConf | null;
/** 逻辑已保证 modConf 不为空时，可调用此函数获取用户的模块配置 */
export declare function getEnsuredModConf(appName: string, platform?: string): IModConf;
export declare function getModDerivedConf(platform?: string): {
    assetNameInfos: import("../base/types").IAssetNameInfo[];
    assetName2view: Record<string, string>;
};
/**
 * 获取 sdk 关心变化的 hel 包名列表，
 * 由 preloadMiddleware （对接页面渲染逻辑）和 mapNodeMod（对接纯后台模块热更新） 合并得到。
 */
export declare function getCaredModNames(platform: string): string[];
/** 获取用户通过 mapNodeMods 记录的模块获取选项配置 */
export declare function getMappedModFetchOptions(helModName: string, platform?: string): IFetchModMetaOptions | null;
/**
 * hel 模块是否有映射关系
 */
export declare function isModMapped(platform: string, helModOrPath: string): boolean;
export declare function shouldAcceptVersion(params: IShouldAcceptVersionParams): boolean;
