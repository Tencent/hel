import type { ISubAppBuildDesc } from 'hel-dev-utils-base';
import type { IHelMonoJsonBase, IHelMonoJsonRuntimeConf, IPkgHelConf, MonoAppConfs } from 'hel-mono-types';

type Dict<T = any> = Record<string, T>;

type PkgName = string;

type PkgVer = string;

type BelongToDir = string;

type DepsObj = Record<PkgName, PkgVer>;

export interface IArgvOptions {
  modTemplate: string;
  pkgName: string;
  copyToBelongTo: string;
  copyToDir: string;
  alias: string;
  copyFromPath: string;
  copyToPath: string;
}

export interface IMonoRootInfo {
  monoRoot: string;
  monoRootHelDir: string;
  monoRootHelLog: string;
  monoRootHelTmpLog: string;
  cmdHistoryLog: string;
  monoDepJson: string;
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
}


export interface IInnerPkgInfo extends IPkgInfo {
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
  alias: string;
  appDirPath: string;
  prefixedDir: string;
  deps: Record<string, string>;
  hel: IPkgHelConf,
}

export interface IInnerPkgMonoDepData extends IInnerPkgInfo {
  alias: string;
  appDirPath: string;
  prefixedDir: string;
  deps: Record<string, string>;
  hel: IPkgHelConf,
}

export type DepDataDict = Record<string, IPkgMonoDepData>;

export type InnerDepDataDict = Record<string, IInnerPkgMonoDepData>;

export interface IMonoNameMap {
  monoNameMap: Record<BelongToDir, { isSubMod: boolean; nameMap: INameMap }>;
  dir2Pkgs: Dict<string[]>;
  monoDep: { createdAt: string; depData: InnerDepDataDict };
  monoDepPure: { createdAt: string; depData: DepDataDict };
  /**
   * 包名与应用的目录路径映射
   */
  pkg2AppDirPath: Dict<string>;
  /**
   * 包名与 dependencies 对象映射
   */
  pkg2Deps: Dict<DepsObj>;
  /**
   * 包名与 peerDependencies 对象映射
   */
  pkg2PeerDeps: Dict<DepsObj>;
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
  pkg2Info: Dict<IInnerPkgInfo>;
  /**
   * 包名与可提为外部资源的映射，已把内置的 PKG_NAME_WHITE_LIST 名单的包排除
   */
  pkg2CanBeExternals: Dict<IInnerPkgInfo>;
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
   * app是否属于大仓根hel目录（此功能仅作研究，不再有实用性）
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
   * @example
   * /path/to/hel-mono/apps/hub/src
   * app所属项目的src目录完整路径
   */
  appSrcDirPath: string;
  /**
   * 动态计算出的 tsconfig.json 的 paths 值
   */
  appTsConfigPaths: string;
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
  /**
   * hel-mono.json 里指定的大仓全局使用的用户自定义外部资源，配置后，需要在 dev/public/index.html 添加相应链接
   */
  customExternals: Record<string, string>;
  /**
   * 构建应用时依据大仓所有模块一级依赖推导出的 externals，这些模块可提升为外部资源
   */
  liftableExternals: Record<string, string>;
  liftableExternalDeps: Record<string, object>;
  /**
   * 基于 hel-dev-utils-base 生成的应用信息
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
  /**
   * 提供给应用真正使用的 html 文件路径
   */
  appHtml: string;
  /**
   * 应用对应的原始 html 文件路径
   */
  rawAppHtml: string;
  /**
   * 动态计算出的应用的 tsconfig.json 里的 paths 值
   */
  appTsConfigPaths: string;
  resolveMonoRoot: (relativePath: string) => string;
}

/**
 * hel-mono-helper 内部使用的大仓开发信息数据
 */
export interface IMonoDevInfo extends IHelMonoJsonBase, IHelMonoJsonRuntimeConf, IGetModMonoDataDictResult {
  /**
   * 各应用（或子模块）的大仓开发配置
   */
  appConfs: MonoAppConfs;
}

export interface IPrepareHelEntrysOptions {
  isForRootHelDir: boolean;
  devInfo: IMonoDevInfo;
  nameData: INameData;
  startDeps?: boolean;
}

export interface IExecuteStartOptions {
  /** 读取应用模板的目录路径 */
  tplsDemoDirPath: string;
  /** 读取模块模板的目录路径 */
  tplsDemoModDirPath: string;
}

export interface IPrepareHelEntryFilesOptions {
  devInfo: IMonoDevInfo;
  depData: IMonoAppDepData;
  appData: ICWDAppData;
  /**
   * 为 true，表示生成独立的 ex 目录
   */
  forEx: boolean;
}

export interface IGetModMonoDataDictResult {
  monoDict: Record<string, IPkgMonoDepData>;
  prefixedDirDict: Record<string, IPkgMonoDepData>;
  dirDict: Record<string, IPkgMonoDepData>;
}

/**
 * cwd 上携带的信息
 */
export interface ICWDInfo {
  curCwd: string;
  exCwd: string;
  forEX: string;
}

export interface IReplaceExHtmlContentOptions {
  appData: ICWDAppData;
  devInfo: IMonoDevInfo;
  pkg2CanBeExternals: Record<string, object>;
  isCurProjectEx: boolean;
  pkg2Deps: Record<string, object>;
}

export interface IGetAppExternalsOptions {
  appData: ICWDAppData;
  devInfo: IMonoDevInfo;
  depInfos: any;
  isCurProjectEx: boolean;
  liftableExternals: Record<string, string>;
}
