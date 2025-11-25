import type { ISimpleVersion } from 'hel-types';
import type { IFetchModMetaOptions, IMeta, IModInfo } from '../base/types';
/**
 * xss过滤器
 *
 * @param {string} input 传入字符串
 * @returns {string} 过滤后的字符串
 */
export declare function xssFilter(input: string): string;
/**
 * 裁剪hel模块元数据，让预埋到首屏的数据尽可能的小
 */
export declare function cutHelMeta(fullMeta: IMeta): IMeta;
export declare function toCssHtmlStr(cssList: string[]): string;
export declare function makeModInfo(fullMeta: IMeta): {
    name: string;
    cssHtmlStr: string;
    meta: IMeta;
    fullMeta: IMeta;
    createTime: number;
};
/**
 * 从版本里获取到 css 字符串
 */
export declare function getCssHtmlStr(version: ISimpleVersion): string;
export declare function fetchModMeta(helModName: string, options?: IFetchModMetaOptions | null): Promise<IMeta | null>;
export declare function fetchModInfo(name: string, options?: IFetchModMetaOptions | null): Promise<IModInfo | null>;
