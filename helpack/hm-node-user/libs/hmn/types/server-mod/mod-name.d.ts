import type { INameData } from '../base/types';
/**
 * 提取 hel 名称相关数据
 * @example
 * in: 'a/b.js'
 * out: {helModName: 'a', relPath: 'b.js'}
 *
 * in: 'a/d/d1/b.js'
 * out: {helModName: 'a', relPath: 'd/d1/b.js'}
 */
export declare function extractNameData(helModNameOrPath: string, platform?: string): INameData;
