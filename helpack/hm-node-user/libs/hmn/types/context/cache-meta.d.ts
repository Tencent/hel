import type { IFetchModMetaOptions, IMeta } from '../base/types';
export declare function setMeta(modMeta: IMeta): void;
/**
 * 获取 helpack 模块 meta 数据
 */
export declare function fetchMeta(name: string, options?: IFetchModMetaOptions): Promise<IMeta>;
