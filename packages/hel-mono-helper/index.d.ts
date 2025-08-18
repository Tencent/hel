import type { IMonoDevInfo } from 'hel-mono-types';
import * as monoCst from './src/consts';
import type {
  ICWDAppData,
  IMonoAppDepData,
  IMonoDevData,
  IMonoNameMap,
  IMonoRootInfo,
  INameData,
  IPkgMonoDepData,
  IExecuteStartOptions,
} from './src/types';

export declare const cst: typeof monoCst;

/**
 * 基于 npm start xxx 来启动或构建应用（模块）
 * @example
 * 启动
 * ```bash
 * # 以传统模式启动 hub
 * npm start hub
 *
 * # 以 hel 模式启动 hub，启动宿主和对应的所有子依赖
 * npm start hub:hel
 *
 * # 以 hel 模式启动 hub，仅启动宿主
 * npm start hub:hwl
 *
 * # 以 hel 模式启动 hub，同时把对应的子模块依赖全部启动
 * npm start .deps hub
 *
 * # 以 hel 模式启动 hub，宿主拉取远程的已构建子模块
 * npm start hub:hwr
 * ```
 *
 * @example
 * 构建，xxx 为 .build 会命中构建流程
 * ```bash
 * # 以传统模式启动 hub
 * npm start .build hub
 *
 * # 以 hel 模式构建 hub
 * npm start .build hub:hel
 * ```
 */
export declare function executeStart(devInfo: IMonoDevInfo): void;

/**
 * 执行启动hel子依赖服务的命令，以下3种场景均能触发
 * ```txt
 * 1 在根目录执行 npm start .deps hub 触发
 * 2 在根目录执行 npm start hub:deps 触发
 * 3 在子目录执行 npm run start:deps 触发
 * ```
 */
export declare function executeStartDeps(devInfo: IMonoDevInfo, options?: IExecuteStartOptions): void;

/**
 * 基于 npm run build xxx 来构建应用（模块）
 */
export declare function executeBuild(devInfo: IMonoDevInfo): void;

/**
 * 准备 hel 微模块相关的入口文件，不透传 pkgOrDir 时会根据 cwd 自动推导
 */
export declare function prepareHelEntry(devInfo: IMonoDevInfo, pkgOrDir?: string): void;

/**
 * 获取 hel-mono 大仓架构里的开发数据
 */
export declare function getMonoDevData(devInfo: IMonoDevInfo, appSrc?: string): IMonoDevData;

/**
 * 根据包名获取对应 hel-mono 大仓里的依赖数据
 */
export declare function getPkgMonoDepData(devInfo: IMonoDevInfo, pkgName: string): IPkgMonoDepData | null;

/**
 * 使用 tsc 或 tsup 构建后台产物（默认tsc），并复制到 hel_dist/srv 目录下，
 * tsc 产物保留了原始的目录层级结构，产物可能为多个文件，
 * tsup 产物将所有代码合并为一个js文件，
 */
export declare function buildSrvModToHelDist(isUseTsup?: boolean): IMonoDevData;

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

  /**
   * true: 是 hel启动应用，此时 start 启动脚本会标识 process.env.HEL_START=1
   */
  isHelStart: () => boolean;
  /**
   * true: 走了 scripts/hel 相关脚本执行运行或构建
   * @returns
   */
  isHelMode: () => boolean;
  /**
   * hel应用（模块）处于 微模块 start 或 微模块 build 模式
   */
  isHelMicroMode: () => boolean;
  /**
   * hel应用（模块）处于整体构建模式（即传统的单一应用构建模式）
   */
  isHelAllBuild: () => boolean;
  /**
   * 获取应用构建hel产物所在的目录路径
   * @param buildDirName ['hel_dist']
   * @returns
   */
  getBuildDirPath: (devInfo: IMonoDevInfo, pkgName: string, buildDirName?: string) => string;
  getCWD: () => string;
  /**
   * 获取根据 cwd 值推导出的运行中的应用的相关数据
   */
  getCWDAppData: (devInfo: IMonoDevInfo, cwd?: string) => ICWDAppData;
  /**
   * 从 cwd 推导当前命令执行位置所属的包目录名
   */
  getCWDPkgDir: () => string;
  /**
   * 从 cwd 推导当前命令是否在根目录 .hel 下执行
   */
  getCWDIsForRootHelDir: () => boolean;
  getCmdKeywordName: (namIndex: number) => string;
  getCmdKeywords: (sliceStart: number) => string[];
  setCurKeyword: (keyword: string) => void;
  getDevInfoDirs: (devInfo: IMonoDevInfo) => { appsDirs: string[]; subModDirs: string[]; belongToDirs: string[] };
  /**
   * 获取 hel-mono-helper 自动推导出的大仓根目录信息
   */
  getMonoRootInfo: () => IMonoRootInfo;
  getPkgJson: (pkgFilePath: string) => Record<string, any>;
  getPort: (devInfo: IMonoDevInfo) => number;
  getMonoNameMap: (devInfo: IMonoDevInfo) => IMonoNameMap;
  getMonoAppDepData: (appSrc: string, devInfo: IMonoDevInfo, isAllDep?: boolean) => IMonoAppDepData;
  /**
   * 某些流水线环境可能无法推导出大仓根目录位置，但流水线上可以读到此位置对应的全局变量，可以调用此接口透传给 hel-mono-helper
   */
  setMonoRoot: (monoRoot: string) => IMonoRootInfo;
};
