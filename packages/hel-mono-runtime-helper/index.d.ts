/**
 * 辅助工具函数
 */
import type { IMakeRuntimeUtilOptions, RuntimeUtil } from './src/types';

export declare function getDevKey(modName: string): string;

export declare function getStorageValue(key: string): string;

export declare function monoLog(...args: any[]): void;

/**
 * 锁定运行时拉取的 hel 模块的版本号
 */
export declare function setHelModVers(vers: Record<string, string>): void;

export declare function makeRuntimeUtil(options: IMakeRuntimeUtilOptions): RuntimeUtil;
