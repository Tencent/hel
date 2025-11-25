import type { IFetchModMetaOptions, IMeta } from '../base/types';
export declare function setMetaCache(modMeta: IMeta): void;
export declare function getMetaCache(name: string): IMeta;
/**
 * 获取 helpack 模块元数据，满足条件时内部会优先获取本地缓存数据
 */
export declare function getModMeta(name: string, options?: IFetchModMetaOptions): Promise<IMeta>;
