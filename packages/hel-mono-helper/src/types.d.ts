import type { ISubAppBuildDesc } from 'hel-dev-utils';

type Dict<T = any> = Record<string, T>;

type PkgName = string;

type PkgVer = string;

type BelongToDir = string;

type DepsObj = Record<PkgName, PkgVer>;

export interface IMonoRootInfo {
  monoRoot: string;
  monoRootHelDir: string;
  monoRootHelLog: string;
  monoDepJson: string;
  monoDepForJson;
}

export interface IPkgInfo {
  /** 包名 */
  pkgName: string;
  /** 父目录名 */
  belongTo: string;
  /** 项目目录名 */
  dirName: string;
  /** 是否子模块 */
  isSubMod: boolean;
  /** 代理包名 */
  proxyPkgName: string;
  /** 代理包项目src路径 */
  proxySrcPath: string;
}

export interface INameData {
  pkgName: string;
  /**
   * 应用本身的根目录名
   * ```bash
   *                    👇 hub 即 dirName
   * /path/to/root/apps/hub/src/....
   * ```
   */
  dirName: string;
  isSubMod: boolean;
  /**
   * ```bash
   * 应用在大仓里的所属目录名
   *                👇 apps 即 belongTo
   * /path/to/root/apps/hub/src/....
   * ```
   */
  belongTo: string;
}

export interface INameMap {
  pkgName2DirName: Dict<string>;
  pkgName2Deps: Dict<DepsObj>;
  dirName2PkgName: Dict<string>;
  packNames: string[];
  dirNames: string[];
}

export interface IPkgMonoDepData extends IPkgInfo {
  appDirPath: string;
  prefixedDir: string;
  deps: Record<string, string>;
}

export interface IMonoNameMap {
  monoNameMap: Record<BelongToDir, { isSubMod: boolean; nameMap: INameMap }>;
  monoDep: { createdAt: string; depData: Record<string, IPkgMonoDepData> };
  /**
   * 包名与应用的目录路径映射
   */
  pkg2AppDirPath: Dict<string>;
  /**
   * 包名与 dependencies 对象映射
   */
  pkg2Deps: Dict<DepsObj>;
  /**
   * 包名与 belongTo 目录映射
   */
  pkg2BelongTo: Dict<string>;
  /**
   * 包名与项目目录映射
   */
  pkg2Dir: Dict<string>;
  /**
   * 包名与带belongTo前缀的目录名映射
   */
  prefixedDir2Pkg: Dict<string>;
  /**
   * 包名与包名信息对象映射
   */
  pkg2Info: Dict<IPkgInfo>;
}

/** 依赖信息 */
export interface IDepInfo {
  pkgName: string;
  belongTo: string;
  dirName: string;
}

export interface IMonoAppDepData extends IMonoNameMap {
  /** 所有的大仓直接依赖或间接依赖（以workspace:开头的依赖） */
  pkgNames: string[];
  depInfos: IDepInfo[];
}

/**
 * 根据 cwd 值推导出的运行中的应用的相关数据
 */
export interface ICWDAppData {
  /**
   * app是否属于大仓根hel目录
   * @example
   * /path/to/hel-mono/.hel
   */
  isForRootHelDir: boolean;
  /**
   * app是否是子模块
   */
  isSubMod: boolean;
  /**
   * app所属项目的父目录
   * @example
   * ```bash
   *                          ⬇︎(apps即belongTo)
   * /path/to/hel-mono/.hel/apps/{dir-name}
   *
   *                     ⬇︎(apps即belongTo)
   * /path/to/hel-mono/{apps}/{dir-name}
   * ```
   */
  belongTo: string;
  /**
   * app所属项目的父目录完整路径
   */
  belongToDirPath: string;
  /**
   * app所属项目的目录
   * @example
   * ```bash
   *                              ⬇︎(hub即appDir)
   * /path/to/hel-mono/.hel/apps/hub
   *
   *                         ⬇︎(hub即appDir)
   * /path/to/hel-mono/apps/hub
   * ```
   */
  appDir: string;
  /**
   * app所属项目的目录完整路径
   * @example
   * /path/to/hel-mono/apps/hub
   */
  appDirPath: string;
  /**
   * app所属项目的src目录完整路径
   */
  appSrcDirPath: string;
  /**
   * app所属项目的对应的包名
   */
  appPkgName: string;
  /**
   * 调试域名( default: 'http://localhost:3000' )
   */
  appPublicUrl: string;
  /**
   * app所属项目的hel代理目录完整路径
   */
  helDirPath: string;
  /**
   * mono根hel目录完整路径
   */
  rootHelDirPath: string;
  /**
   * 当app所属项目在mono根hel目录下时，它对应的真实项目的目录完整路径
   */
  realAppDirPath: string;
  /**
   * 当app所属项目在mono根hel目录下时，它对应的真实项目的src目录完整路径
   */
  realAppSrcDirPath: string;
  /**
   * 当app所属项目在mono根hel目录下时，它对应的真实项目的package.json文件完整路径
   */
  realAppPkgJsonPath: string;
  /**
   * 当app所属项目在mono根hel目录下时，它对应的真实项目的包名
   */
  realAppPkgName: string;
  /**
   * hel-mono 大仓根目录路径
   */
  monoRoot: string;
}

/**
 * 应用在大仓里的相关开发数据
 */
export interface IMonoDevData {
  babelLoaderInclude: string[];
  appAlias: Record<string, string>;
  jestAlias: Record<string, string>;
  appExternals: Record<string, string>;
  /**
   * 基于 hel-dev-utils 生成的应用信息
   */
  appInfo: ISubAppBuildDesc;
  /**
   * 应用自身相关开发数据
   */
  appData: ICWDAppData;
  appPublicUrl: string;
  /**
   * 应用index入口文件完整路径
   */
  appSrcIndex: string;
  resolveMonoRoot: (relativePath: string) => string;
}
