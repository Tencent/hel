import type { IConfig } from './bin/types.d.ts';

/**
 * 定制config 参数，基于 create-hel-mono 构建自己的专属 hel-mono cli
 */
export function setConfig(config: Partial<IConfig>): void;

/**
 * 分支入参，执行 cli 命令
 */
export function analyzeArgs(): void;
