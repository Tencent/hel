/**
 * 辅助工具函数
 */
import type { IMakeRuntimeUtilOptions, RuntimeUtil, IHelConfKeys } from './src/types';

/**
 * 调试 key 前缀常量
 */
export declare const HEL_DEV_KEY_PREFIX: {
  devUrl: 'hel.dev',
  branchId: 'hel.branch',
  versionId: 'hel.ver',
  projectId: 'hel.proj',
};

/**
 * 获取 hel 模块所属组名对应的各项配置的 localStorage key
 */
export declare function getHelConfKeys(helModGroupName: string): IHelConfKeys;

/**
 * 通过 key 获得 localStorage 对应的值
 */
export declare function getStorageValue(key: string): string;

/**
 * hel-mono-runtime-helper 专用的日志打印函数
 */
export declare function monoLog(...args: any[]): void;

/**
 * 获取 div 标签节点作为渲染初始节点，不存在的会自动创建一个并返回
 * @param id default: 'hel-app-root'
 */
export declare function getHostNode(id?: string): HTMLElement;

/**
 * 锁定运行时拉取的 hel 模块的版本号，
 * key：hel 模块名称，value：hel 模块版本号
 */
export declare function setHelModVers(vers: Record<string, string>): void;

/**
 * 生成 runtimeUtil 工具函数对象
 */
export declare function makeRuntimeUtil(options: IMakeRuntimeUtilOptions): RuntimeUtil;
