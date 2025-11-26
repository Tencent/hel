import type { IMeta } from 'hel-types';

/**
 * 'all', 允许所有更新模式
 * 'server' 允许服务端控制更新（ 来自 helpack ）
 * 'client' 允许客户端控制更新（ 来自 importMod ）
 */
export type ModAllowUpdateMode = 'all' | 'server' | 'client';

/**
 * 当出现重连时，尝试获取新的连接 ws url，如未设置此函数，会复用 options.url，
 * 通常存在名字服务时需设置此函数，通过名字服务获取新的连接 ws url，因为旧的机器可能已经销毁，
 * 此时 options.url 将永远也连接不上
 */
export type GetSocketUrlWhenReconnect = () => Promise<string>;

/**
 * default: false, 内部使用的属性
 * 为 false 时，导入hel模块的行为会影响 require/import 导出全局模块实例(前提是已映射)
 * 为 true 时，不会影响全局模块实例
 */
export type Standalone = boolean;

export interface IFetchModMetaBaseOptions {
  /**
   * 拉取模块时指定的版本号，
   * 是 unpkg 时，会拉取对应版本数据，
   * 是 helpack 时，指定版本号时，projId branch gray 将无效
   */
  ver?: string;
  /**
   * 此参数仅对 helpack 有效，
   * 拉取指定项目id的模块元数据，指定 projId 时，branch gray 将无效，
   * 若 projId 无对应的元数据，则降级使用线上最新版本
   */
  projId?: string;
  /**
   * 此参数仅对 helpack 有效，
   * 拉取指定分支的模块元数据，指定 时，branch 时，gray 将无效，
   * 若 branch 无对应的元数据，则降级使用线上最新版本
   */
  branch?: string;
  /**
   * default: false，
   * 此参数仅对 helpack 有效，
   * 获取可能在线上或灰度中的模块元数据，true：强制使用灰度版本，无灰度则读线上，false：强制使用线上版本
   */
  gray?: boolean;
}

export interface IFetchModMetaOptions extends IFetchModMetaBaseOptions {
  /**
   * default: 'unpkg',
   * 表示这个平台的 hel 模块和 node 模块映射起来
   */
  platform?: string;
  /**
   * default: '',
   * 请求 helpack 模块管控台获取 meta 的 url，
   * ```text
   * 未配置的话，针对 unpkg 会发起 '${unpkgHost}/hel_dist/hel-meta.json' 类似请求，
   * 例如：https://unpkg.com/hel-demo-lib1/hel_dist/hel-meta.json
   * 未配置的话，针对 hel 会发起 '${helpackApiUrl}/${modName}[/{modVersion}]' 类似请求，
   * 例如：https://helmicro.com/openapi/meta/hel-hello-helpack
   * 如配置了具体的 helpackApiUrl，则发起和 hel 平台一样格式的请求
   * ```
   */
  helpackApiUrl?: string;
}

interface IGetMetaParams extends Omit<IFetchModMetaOptions, 'platform'> {
  platform: string;
  helModName: string;
}

export type BeforePreloadOnce = () => Promise<{ helpackSocketUrl?: string } | void>;

export type GetMeta = (params: IGetMetaParams) => Promise<IMeta>;

/**
 * 无本地模块实现时，有2个作用
 * 1 内部会依据此参数创建一个假模块用于代理，辅助 requireMod 生成的代理模块可查看模块形状
 * 2 可让用户在头部提前解构模块的属性
 */
export interface IModShape {
  /**
   * 这些key对应值是函数
   */
  fnKeys?: string[];
  /**
   * 这些key对应值是普通json对象
   */
  dictKeys?: string[];
}

export interface INodeModFallbackConf {
  /**
   * default: false,
   * 为 true 表示强制使用备用模块，此时 hel 模块不在生效
   * 为 false 表示加载 hel 模块失败时才尝试使用备用模块
   */
  force?: boolean;
  /**
   * 备用模块路径或名称，未配置时，优先采用 mod, mod 没有配置再使用 nodeName 对应的模块
   */
  path?: string;
  /**
   * 备用模块对应的模块对象
   */
  mod?: any;
}

export interface IMapModOptions extends IFetchModMetaOptions {
  /**
   * hel模块名，可包含子路径，未设置时，表示 hel 模块名和 node 模块名同名
   */
  helModName?: string;
  /**
   * default: true，
   * 是否要解析本地的原始模块，配置为 false 时，建议同步配置 fnKeys，dictKeys，
   * 方便创建假模块时，可让内部感知到哪些属性是方法，哪些属性是普通对象，
   * 以便支持用在文件头部提前解构出这些属性对应的包裹方法或代理对象时，动态更新也能正常生效
   */
  resolveRawMod?: boolean;
  /**
   * 替换掉内部默认的准备文件过程，服务于一些需自定义下载逻辑或测试函数复制本地文件的场景
   */
  prepareFiles?: PrepareFiles;
  /**
   * default: ['all']
   * 获取初始版本模块后，允许的模块更新模式，如设置为 [] 表示不再接受任何更新
   */
  allowUpdateMode?: ModAllowUpdateMode[];
  /**
   * 备用模块相关配置
   */
  fallback?: INodeModFallbackConf;
  modShape?: IModShape;
  /**
   * default: false,
   * 设置了 globalConfig.strict 为 false 时，虚拟 node 模块无备份模块或模块形状数据时，载入将报错，
   * 如用户不想添加备份模块，也不想设置形状数据，当希望程序能正常启动，
   * 则可设置 dangerouslyNoShape 为 true，但结果是提前解构的属性（函数、对象）不再支持热更新
   * @example
   * ```
   * // bad
   * consts { hello } = require('virtual-mod');
   *
   * // ok
   * const mod =  require('virtual-mod');
   * // 只能在调用处 mod.hello() 才能保证执行的是更新后的代码
   * ```
   */
  dangerouslyNoModShape?: boolean;
}

export type INodeModMapper = Record<string, string | boolean | IMapModOptions>;

export type IStdNodeModMapper = Record<string, IMapModOptions>;

export interface IWebFileInfo {
  /** hel 模块名 */
  name: string;
  /** 当前模块相对入口路径 */
  relPath: string;
  urls: string[];
  webDirPath: string;
  /** 服务端入口 url */
  indexUrl?: string;
  /** 推导出的模块根目录名 */
  modRootDirName: string;
  /** 推导出的模块版本号 */
  modVer: string;
}

/**
 * 文件下载描述信息
 */
export interface IFileDownloadInfo {
  /**
   * 文件对应网络路径
   */
  url: string;
  /**
   * 下载文件对应的存储目录
   */
  fileDir: string;
  /**
   * 下载文件对应的存储名称
   */
  fileName: string;
}

/** 当前激活的模块实例描述 */
export interface IModIns<T extends any = any> {
  /**
   * 导出模块对象
   */
  mod: T;
  /**
   * 导出模块完整路径，形如：/path/to/mod-files/v1/xxx.js
   */
  modPath: string;
  /**
   * 模块相对版本目录的子路径，形如 srv/hel-hello/index.js 等，
   * 如没有放在到子目录下，则形如 index.js、my-name.js 等
   */
  modRelPath: string;
  /**
   * 主模块路径，当 isMainMod=true 时，mainModPath===modPath
   */
  mainModPath: string;
  /**
   * 当前激活模块是否是默认导出模块
   */
  isMainMod: boolean;
  /**
   * 当前版本模块目录根路径，形如：
   * /path/to/mod-files/v1、
   * /path/to/.hel_modules/hel+xxx/13455443214、
   * /path/to/.hel_modules/npm+@tencent+some-lib/1.1.0、
   */
  modDirPath: string;
  /**
   * 模块在 <hel_modules> 下的根目录路径
   */
  modRootDirPath: string;
  /**
   * 模块版本号，形如：v1
   */
  modVer: string;
  /**
   * true，是存在于本地磁盘里的初始模块，此模块的硬盘数据不会被清理掉
   */
  isInit: boolean;
}

export interface IPrepareFilesParams {
  /**
   * hel 模块名，即 helpack 平台对应的应用名称
   */
  name: string;
  /**
   * 文件需要下载或复制到此目录
   */
  modDirPath: string;
  /**
   * 供参考的下载文件信息
   */
  filePaths: { fileWebPath: string; fileLocalPath: string }[];
  /**
   * 提供给用户使用下载函数句柄
   */
  downloadFile: (fileWebPath: string, fileLocalPath: string) => Promise<void>;
  /**
   * 写入模块入口文件内容，设置 skipMeta=true，可用此函数来自定义模块入口代码内容
   */
  writeIndexContent: (indexContent: string) => void;
}

/**
 * 自定义的下载函数，支持同步和异步，服务于一些需自定义下载逻辑或测试函数复制本地文件的场景
 */
export type PrepareFiles = (params: IPrepareFilesParams) => void | Promise<void>;

export interface IOnFilesReadyBaseParams {
  /**
   * hel 模块名，即 helpack 平台对应的应用名称
   */
  name: string;
  /**
   * 文件所在的版本根目录
   */
  modDirPath: string;
  /**
   * 模块的本地文件列表
   */
  files: string[];
}

export interface IOnFilesReadyParams extends IOnFilesReadyBaseParams {
  meta: IMeta;
}

/**
 * 文件已就绪后，需进一步处理的函数，当本地存在可复用文件时或当网络下载完成时，此函数都会触发
 */
export type OnFilesReady = (params: IOnFilesReadyParams) => void | Promise<void>;

export type OnFilesReadySync = (params: IOnFilesReadyBaseParams) => void;

/**
 * 自定义的准备文件的同步函数
 */
export type PrepareFilesSync = (params: IPrepareFilesParams) => void;

export interface IImportNodeModByMetaOptions {
  prepareFiles?: PrepareFiles;
  onFilesReady?: OnFilesReady;
  reuseLocalFiles?: boolean;
}

export interface IImportHelModByMetaOptions extends IImportNodeModByMetaOptions {
  helModNameOrPath?: string;
  platform?: string;
}

export interface IInnerImportModByMetaOptions extends IImportHelModByMetaOptions {
  standalone: Standalone;
}

export interface IDownloadServerModFilesOptions extends IFetchModMetaOptions {
  /**
   * 文件已就绪后，需进一步处理的函数，当本地存在可复用文件时或当网络下载完成时，此函数都会触发
   * cluster worker 模式下此函数只会触发一次
   */
  onFilesReady?: OnFilesReady;
  /**
   * default: true, 是否复用本地文件，true：尝试复用本地可能存在的文件，false：不复用本地文件
   * 谨慎设置此项，当设置为 false 时，总是从网络下载文件，不再复用本地磁盘可能已存在文件
   */
  reuseLocalFiles?: boolean;
}

export type IDownloadNodeServerModFilesOptions = Omit<IDownloadServerModFilesOptions, 'platform'>;

export interface IImportNodeModByMetaSyncOptions {
  prepareFiles: PrepareFilesSync;
  onFilesReady?: OnFilesReadySync;
  helModNameOrPath?: string;
}

export interface IImportHelModByMetaSyncOptions extends IImportNodeModByMetaSyncOptions {
  platform?: string;
}

export interface IInnerImportModByMetaSyncOptions extends IImportHelModByMetaSyncOptions {
  standalone: Standalone;
}

export interface IImportNodeModByPathOptions {
  /**
   * 未指定时，内部把模块路径当做版本号
   */
  ver?: string;
}

export interface IImportHelModByPathOptions extends IImportNodeModByPathOptions {
  platform?: string;
}

export interface IInnerImportModByPathOptions extends IImportHelModByPathOptions {
  standalone: Standalone;
}

export interface IModManagerItemBase {
  /** 所属平台 */
  platform: string;
  /** hel 模块名称 */
  modName: string;
  /** 当前模块版本号 */
  modVer: string;
  /**
   * 当前模块的在本机磁盘上的根目录路径（含版本号modVer），形如：
   * /path/xx/mod-files/mod/ver-1
   */
  modDirPath: string;
  /**
   * 当前模块的在本机磁盘上的根目录路径（不含版本号），形如：
   * /path/xx/mod-files/mod
   */
  modRootDirPath: string;
  /**
   * 当前版本的默认导出模块入口文件的完整路径，形如：
   * /path/xx/mod-files/ver-1/index.js
   * /path/xx/mod-files/ver-1/a:b:c.js
   * 存在子路径时，且该子路径对应模块就是默认导出模块时，激活的模块路径可能是：
   * /path/xx/mod-files/ver-1/srv/some-dir/index.js
   */
  modPath: string;
  /** 下载次数 */
  downloadCount: number;
  /**
   * 第一个下载的版本号
   */
  firstDownloadVer: string;
  /** 本机磁盘上已下载的多个版本对应目录路径 */
  storedVers: string[];
}

export interface IModDesc extends IModManagerItemBase {
  /**
   * 其他激活的子路径模块的路径，key: 子路径名称，value：模块路径
   */
  exportedModPaths: Record<string, string>;
}

export interface IModManagerItem<T extends any = any> extends IModManagerItemBase {
  /** 当前版本的默认导出模块 */
  mod: T;
  /**
   * 当前版本的其他子路径导出的模块，key 形如：
   * some-dir
   * other-dir/sub-path
   */
  exportedMods: Map<string, { mod: any; path: string }>;
  /*
   * 当前版本对应的所有已导出模块的完整路径，
   * 如存在子路径导出，则此数组长度大于1
   */
  modPaths: string[];
  /** 本机磁盘上已下载的多个版本对应目录路径 */
  storedDirs: string[];
}

export interface IImportHelModOptions extends IFetchModMetaOptions {
  /**
   * default: false，
   * 设置为 true 表示跳过 meta 获取过程，完全靠 prepareFiles 函数来提供模块可执行文件
   */
  skipMeta?: boolean;
  /**
   * 自定义版本号，此参数仅当 skipMeta=true 才有效，控制生成的版本号目录名称，
   * 方便用户自己规划版本号规则（默认是时间戳作为版本号）
   */
  customVer?: string;
  /**
   * 准备文件函数，此参数仅当 skipMeta=true 才有效
   */
  prepareFiles?: PrepareFiles;
  /**
   * 文件已就绪后，需进一步处理的函数，当本地存在可复用文件时或当网络下载完成时，此函数都会触发
   */
  onFilesReady?: OnFilesReady;
  /**
   * default: true, 是否复用本地文件，true：尝试复用本地可能存在的文件，false：不复用本地文件
   * 谨慎设置此项，当设置为 false 时，总是从网络下载文件，不再复用本地磁盘可能已存在的文件
   */
  reuseLocalFiles?: boolean;
}

export type IImportNodeModOptions = Omit<IImportHelModOptions, 'platform'>;

export interface IInnerImportModOptions extends IImportHelModOptions {
  /**
   * @see Standalone
   */
  standalone: Standalone;
}

export interface INameData {
  /** hel模块名（即helpack平台应用名） */
  helModName: string;
  /** 含相对路径的文件名，形如：'d/d1/b.js' */
  relPath: string;
  /** 完整的带子路径的hel模块名，形如：'some-mod/a/b' */
  helModPath: string;
  /** 原始传入的hel路径（可能包含子路径） */
  helModNameOrPath: string;
  /** 代理文件名称 */
  proxyFileName: string;
}

export interface IOnHelModLoadedParams {
  helModName: string;
  helModPath: string;
  /**
   * 如为空字符串，表示当前 hel 模块并未映射到 node 模块
   */
  pkgName: string;
  version: string;
  isInitialVersion: boolean;
}

export interface IOnInitialVersionFetchedParams {
  helModName: string;
  version: string;
}

export interface IOnMessageReceivedParams {
  helModName: string;
  msgType: string;
}

export interface IShouldAcceptVersionParams {
  nodeModName: string;
  helModName: string;
  platform: string;
  currentMeta: IMeta | null;
  newMeta: IMeta;
}

/**
 * hel-micro-node 相关 hooks
 */
export interface IHMNHooks {
  /**
   * 初始版本的 hel 模块 meta 数据获取到时触发的钩子
   */
  onInitialHelMetaFetched: (params: IOnInitialVersionFetchedParams) => void;
  /**
   * hel 模块载入完毕时触发的钩子，当存在模块替换时（如后台切换了新版本），该钩子会被多次触发
   */
  onHelModLoaded: (params: IOnHelModLoadedParams) => void;
  /**
   * 收到 ws 长连接消息时触发的钩子
   */
  onMessageReceived: (params: IOnMessageReceivedParams) => void;
}

export interface ISDKGlobalBaseConfig {
  /**
   * default: <proj>/node_modules/.hel_modules
   * hel 服务端模块存储路径，如需修改，在应用程序的入口处尽早通过 setConfig 设置才能生效
   */
  helModulesDir: string;
  /**
   * default: <proj>/node_modules/.hel_modules/.proxy
   * hel 服务端模块代理文件存储路径，如需修改，在应用程序的入口处尽早通过 setConfig 设置才能生效
   */
  helProxyFilesDir: string;
  /**
   * default: <proj>/node_modules/.hel_modules/.log
   * hel 服务端模块运行日志存储路径，如需修改，在应用程序的入口处尽早通过 setConfig 设置才能生效
   */
  helLogFilesDir: string;
  /**
   * 是否为严格模式，default: true ，
   * true: node 模块必须存在；
   * false: node 模块可以不存在，只要提供了假模块实现即可
   */
  strict: boolean;
  /**
   * setBaseConfig 调用配置的 hooks
   */
  hooks: IHMNHooks;
  shouldAcceptVersion: (params: IShouldAcceptVersionParams) => boolean;
}

export interface ISDKGlobalConfig extends Partial<Omit<ISDKGlobalBaseConfig, 'hooks' | 'shouldAcceptVersion'>> {
  hooks?: Partial<IHMNHooks>;
  /**
   * 收到新版本变更通知，是否接受该版本
   */
  shouldAcceptVersion?: (params: IShouldAcceptVersionParams) => boolean;
}

/**
 * 平台对应的设置参数
 * 如是由 registerPlatform 导出的 api 调用 setPlatformConfig，各项默认值是其注册的值
 */
export interface IPlatformConfig {
  /**
   * default: unpkg
   */
  platform?: string;
  /**
   * default：https://unpkg.com，
   * hel 模块元数据拉取路径，抓元数据请求形如：
   * @example 还可设置为
   * ```
   * 1 jsdelivr https://cdn.jsdelivr.net/npm/hel-demo-lib1
   * 会发起类型请求抓元数据
   * https://cdn.jsdelivr.net/npm/hel-demo-lib1/hel_dist/hel-meta.json
   * ```
   * 如配置了 getMeta 函数，此设置将无效
   */
  helpackApiUrl?: string;
  /**
   * 获取hel模块元数据，配置此项后，helpackApiUrl 将不再起作用
   */
  getMeta?: GetMeta;
  /**
   * default: ''，
   * web-socket 长连接 url，sdk 接收版本变化的消息后，会主动调用 helpackApiUrl 获取到最新版本的 hel 模块元数据
   * 支持 setConfig 重写，也支持在 beforePreloadOnce （通常服务于给予 hel-micro-node 做二次封装的场景）重写，
   * 格式形如： 'ws://localhost:8080', 'ws://123.1.2.101:8080''
   */
  helpackSocketUrl?: string;
  /** 从 helpack 服务拉取组数据失败时，本地存在的 hel-meta 兜底文件路径 */
  helMetaBackupFilePath?: string;
  /**
   * 长连接断开后触发此函数重新获取长连接地址，适用于后台集群部署机器扩容或消容时，地址发生变化的情况
   */
  getSocketUrlWhenReconnect?: GetSocketUrlWhenReconnect;
  /**
   * helpack一旦关闭，如配置此函数，会基于 http 做短暂的轻量级轮询（相比socket尝试重连会更轻量），以便加速重连成功时机
   */
  socketHttpPingWhenTryReconnect?: () => Promise<boolean>;
  /**
   * 此接口偏向于面向库开发者，在后台服务端需要先通过名字服务查到模块管控台的ip和地址，然后再传给sdk的场景，
   * 所有的 preload 接口拉取模块元数据之前，会触发该方法且该方法仅会被调用一次，目前支持设定 helpackSocketUrl（ 未设定时才能设定 ）
   */
  beforePreloadOnce?: BeforePreloadOnce;
  /**
   * default: false，
   * true 表示关心所有模块的变化，建立长连接后，所有模块的元数据变化后都会推给 sdk，sdk 内部会采用 lru-cache 缓存起来，
   * 谨慎设置此值，仅当需使用 sdk 作为一个模块元数据提供方并加速数据获取能力时才需要设置为 true，
   * 注：没有通过 mapNodeMods 或 preloadMiddleware 映射的模块，
   * sdk 收到了模块元数据变化消息，也不会更新其导出对象，仅是缓存起来用来提速顶层接口 fetchModMeta 接口响应速度
   */
  careAllModsChange?: boolean;
  hooks?: Partial<IHMNHooks>;
  /**
   * ws 长连接首次建立连接成功时，会上报 envInfo 对象，提供 getEnvInfo 让用户定制此对象
   */
  getEnvInfo?: () => Record<string, any>;
}

export interface IRegisterPlatformConfig extends Omit<IPlatformConfig, 'platform'> {
  /**
   * 平台值，如何获取这个平台的元数据
   */
  platform: string;
  /**
   * 注册来源，通常和包名同名即可，用于提示此名称已被那个包注册了
   */
  registrationSource: string;
}

export interface IMockAutoDownloadOptions {
  platform?: string;
  /**
   * 可通过此函数改写某些文件的内容
   */
  onFilesReady?: OnFilesReady;
  /**
   * 不重写此函数的话，默认行为是将获取到的最新版本的文件列表复制到另一个版本加后缀的文件里，例如获取到的版本是 xxx-133555661234
   * 定时器存储的版本是 xxx-133555661234_1, xxx-133555661234_2, xxx-133555661234_3...
   */
  prepareFiles?: PrepareFiles;
  /**
   * default: 10000, 单位 ms
   */
  intervalMs?: number;
}

export interface IGetModRootDirDataOptions {
  webDirPath: string;
  meta: IMeta;
  platform: string;
}

export interface IGetModDescOptions {
  allowNull?: boolean;
  platform?: string;
}

export interface IResolveModResult {
  /**
   * hel 模块对应的 node 模块名称，无值表示未在 mapNodeMods 或 mapAndPreload 里映射过
   */
  nodeModName: string;
  /**
   * hel 模块对应的 node 模块的入口文件记录，无值表示未在 mapNodeMods 或 mapAndPreload 里映射过
   */
  nodeModFilePath: string;
  /**
   * hel模块名称
   */
  helModName: string;
  /**
   * hel模块导入路径，用户以子路径导入 hel 模块时，helModName 和 helModPath 不一致
   * @example
   * ```ts
   * // 'helModName: \@hel-demo/my-lib helModPath: \@hel-demo/my-lib\/sub-path'
   * import('@hel-demo/my-lib/sub-path');
   * ```
   */
  helModPath: string;
  /**
   * hel模块入口文件路径
   */
  helModFilePath: string;
  /**
   * hel 模块对应的兜底模块的路径，无值表示未在 mapNodeMods 或 mapAndPreload 里映射过
   */
  helModFallbackPath: string;
  /**
   * true：是导出的主模块
   */
  isMainMod: boolean;
  /**
   * hel代理模块的文件路径
   */
  proxyFilePath: string;
  /**
   * 激活后的hel模块版本号
   */
  helModVer: string;
}

export interface IImportNodeModResult<T = any> {
  mod: T;
  isUpdated: boolean;
}
