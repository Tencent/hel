import type { ISimpleVersion } from 'hel-types';
import type { IMeta } from '../base/types';
/**
 * 裁剪hel模块元数据，让预埋到首屏的数据尽可能的小
 */
export declare function cutHelMeta(fullMeta: IMeta): IMeta;
export declare function toCssHtmlStr(cssList: string[]): string;
/**
 * 从版本里获取到 css 字符串
 */
export declare function getCssHtmlStr(version: ISimpleVersion): string;
export declare function makeModInfo(fullMeta: IMeta): {
    name: string;
    cssHtmlStr: string;
    meta: IMeta;
    fullMeta: IMeta;
    createTime: number;
};
