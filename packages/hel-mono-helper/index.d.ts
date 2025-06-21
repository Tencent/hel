import type { IMonoDevInfo } from 'hel-mono-types';
import type { ICWDAppData, IMonoAppDepData, IMonoDevData, INameData } from './src/types';

/**
 * 基于 npm start xxx 来启动或构建宿主
 * @example
 * 启动
 * ```bash
 * npm start hub
 * # 转为 pnpm --filter hub run start 来启动 hub
 *
 * npm start hub:hel
 * # 转为 pnpm --filter hub run start:hel 来启动 hel 模式的 hub
 * ```
 *
 * @example
 * 构建，xxx 为 .build 会命中构建流程
 * ```bash
 * npm start .build hub
 * # 转为 pnpm --filter hub run build 来构建 hub
 * # 等效于根目录执行 npm run build hub
 *
 * npm start .build hub:hel
 * # 转为 pnpm --filter hub run build:hel 来构建 hub
 * # 等效于根目录执行 npm run build:hel hub
 * ```
 */
export declare function executeStart(devInfo: IMonoDevInfo): void;

/**
 * 准备 hel 微模块相关的入口文件
 */
export declare function prepareHelEntry(devInfo: IMonoDevInfo, depData: IMonoAppDepData, appData?: ICWDAppData): void;

/**
 * 获取 hel-mono 大仓架构里的开发数据
 */
export declare function getMonoDevData(devInfo: IMonoDevInfo, appSrc?: string): IMonoDevData;

/**
 * 使用 tsc 构建后台产物，并复制到 hel_dist/srv 目录下
 */
export declare function buildSrvModToHelDist(): IMonoDevData;

export declare const monoUtil: {
  /** 打印hel-mono运行普通日志 */
  helMonoLog: (...args: any[]) => void;
  /** 打印hel-mono运行警告日志 */
  helMonoErrorLog: (...args: any[]) => void;
  /** 打印临时调试日志 */
  helMonoLogTmp: (...args: any[]) => void;
  /**
   * 清理日志
   * @param markStartTime [true]
   * @param isTmp [false]
   * @returns
   */
  clearMonoLog: (markStartTime?: boolean, isTmp?: boolean) => void;
  ensureSlash: (inputPath: string, needsSlash?: boolean) => string;
  getNameData: (mayPkgOrDir: string, devInfo: IMonoDevInfo) => INameData;
};
