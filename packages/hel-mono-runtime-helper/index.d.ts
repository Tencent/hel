/**
 * 辅助工具函数
 */
import type { IMakeRuntimeUtilOptions, RuntimeUtil } from './src/types';

export declare function getDevKey(modName: string): string;

export declare function getStorageValue(key: string): string;

export declare function monoLog(...args: any[]): void;

export declare function makeRuntimeUtil(options: IMakeRuntimeUtilOptions): RuntimeUtil;