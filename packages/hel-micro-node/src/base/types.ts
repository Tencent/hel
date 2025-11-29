import type { AxiosResponse } from 'axios';
import type { IMeta } from 'hel-types';
import type {
  BeforePreloadOnce,
  GetMeta,
  GetSocketUrlWhenReconnect,
  IDownloadNodeServerModFilesOptions,
  IDownloadServerModFilesOptions,
  IFetchModMetaBaseOptions,
  IFetchModMetaOptions,
  IFileDownloadInfo,
  IGetModDescOptions,
  IGetModRootDirDataOptions,
  IHMNHooks,
  IImportHelModByMetaOptions,
  IImportHelModByMetaSyncOptions,
  IImportHelModByPathOptions,
  IImportHelModOptions,
  IImportNodeModByMetaOptions,
  IImportNodeModByMetaSyncOptions,
  IImportNodeModByPathOptions,
  IImportNodeModOptions,
  IImportNodeModResult,
  IMapModOptions,
  IMockAutoDownloadOptions,
  IModDesc,
  IModIns,
  IModManagerItem,
  IModManagerItemBase,
  IModShape,
  INameData,
  INodeModFallbackConf,
  INodeModMapper,
  IOnFilesReadyParams,
  IPlatformConfig,
  IPrepareFilesParams,
  IRegisterPlatformConfig,
  IResolveModResult,
  ISDKGlobalBaseConfig,
  ISDKGlobalConfig,
  IShouldAcceptVersionParams,
  IStdNodeModMapper,
  IWebFileInfo,
  OnFilesReady,
  OnFilesReadySync,
  PrepareFiles,
  PrepareFilesSync,
} from './types-srv-mod';

export type DictData = Record<string, any>;

export type {
  IFetchModMetaOptions,
  IFetchModMetaBaseOptions,
  ISDKGlobalConfig,
  IModShape,
  IDownloadServerModFilesOptions,
  IDownloadNodeServerModFilesOptions,
  IHMNHooks,
  IMapModOptions,
  INodeModMapper,
  IStdNodeModMapper,
  INodeModFallbackConf,
  IResolveModResult,
  IWebFileInfo,
  IFileDownloadInfo,
  IModIns,
  IPrepareFilesParams,
  PrepareFiles,
  IOnFilesReadyParams,
  OnFilesReady,
  OnFilesReadySync,
  PrepareFilesSync,
  IRegisterPlatformConfig,
  IImportHelModByMetaSyncOptions,
  IImportHelModByMetaOptions,
  IImportHelModByPathOptions,
  IImportNodeModResult,
  IImportNodeModOptions,
  IImportNodeModByPathOptions,
  IImportNodeModByMetaOptions,
  IImportNodeModByMetaSyncOptions,
  ISDKGlobalBaseConfig,
  IModManagerItemBase,
  IModDesc,
  IModManagerItem,
  IImportHelModOptions,
  INameData,
  IPlatformConfig,
  IMockAutoDownloadOptions,
  IGetModRootDirDataOptions,
  IMeta,
  GetMeta,
  IGetModDescOptions,
  IShouldAcceptVersionParams,
};

/** 形如：xxx-mod, @scope/xxx-mod */
export type PkgName = string;
/** 形如：xxx-hel-mod, @scope/xxx-hel-mod  */
export type HelModName = string;
/** 形如：xxx-hel-mod/sub-mod1, xxx-hel-mod/sub-mod2, 不带子路径时， HelModName 等于 HelModPath */
export type HelModPath = string;
/** 即可能是单纯的 hel 模块名，也可能是带子路径的 hel 模块名 */
export type HelModOrPath = string;
/** 平台值 */
export type Platform = string;

/**
 * hel-meta 加工后的数据
 */
export interface IModInfo {
  name: string;
  /** 模块元数据，此数据为裁剪后的数据，用于下发给前台 */
  meta: IMeta;
  /** 模块元数据，此数据为完整数据，用于内部使用 */
  fullMeta: IMeta;
  /** 模块对应版本的生成时间 */
  createTime: number;
  /** 包含有 <link> 标签的 css html 字符串 */
  cssHtmlStr: string;
}

/**
 * 各个模块该如何处理预设元数据（会随首页一起下发到web前端的hel数据）的相关配置，
 * 服务于 preloadMiddleware 或 initMiddleware 函数的配置项
 */
export interface IModConf {
  /**
   * default: false
   * 获取到最新的模块元数据时，是否更新 hel 预设元数据，适用于模块粒度的包体
   */
  updatePresetMeta?: boolean;
  /**
   * default: false
   * 获取到最新的模块元数据时，是否更新页面资源缓存，适用于应用粒度的包体
   */
  updatePageAsset?: boolean;
  /**
   * default: false
   * 获取到最新的模块元数据时，是否提取模块css字符串存放到模块信息中，适用于ssr场景需要提前注入css到下发的首屏html代码里
   */
  extractCssStr?: boolean;
  /**
   * default: false
   * 是否针对js资源使用 preload 做拉取，生成如下的类似 html 标签
   * <link rel="preload" href="https://xx.js" as="script">
   */
  isPreloadJs?: boolean;
  /**
   * default: false
   * 是否是 hel 主项目渲染入口对应产物
   */
  isHelEntry?: boolean;
  /**
   * default: false
   * 是否是默认的 hel 主项目渲染入口对应产物
   */
  isDefaultHelEntry?: boolean;
  /**
   * 初始模块名称或路径，用于 initMiddleware 流程里的 server 模块兜底，
   * 执行 preloadMiddleware 时，为保证客户端和服务端版本一致行，此参数不再有效
   */
  serverModInitPath?: string;
  /**
   * 拉取模块参数
   */
  fetchOptions?: IFetchModMetaOptions;
}

export type ModConfDict = Record<string, IModConf>;

/** 组相关配置 */
export interface IGroupConfOptions {
  /** 七彩石组名 */
  group: string;
  /** 从七彩石服务拉取组数据失败时，本地存在的组数据兜底文件路径，文件内部为整个 group 数据（包含版本信息等） */
  backupConfFilePath?: string;
}

export interface IAssetNameInfo {
  appName: string;
  entryName: string;
  /** {appName}/{entryName} */
  name: string;
}

export type GetHelRenderParams = (cbParams: { ctx: any; viewPath: string; pageData?: any })
  => Promise<{ viewPath: string; pageData?: object }>;

/**
 * 平台对应的 sdk 上下文，主要包含各种配置项
 */
export interface ISDKPlatContext {
  platform: string;
  registrationSource: string;
  /**
   * 是否被 registerPlatform 激活
   */
  isActive: boolean;
  api: any;
  /**
   * 平台 api 地址，
   * 默认值：'https://unpkg.com'
   */
  helpackApiUrl: string;
  /**
   * default: false
   */
  isApiUrlOverwrite: boolean;
  /**
   * default: ''
   * web-socket 长连接 url，
   * 此值需要用户基于 hel-micro-node sdk 做二次封装后注入，
   * sdk 接收版本变化的消息后，会主动调用 helpackApiUrl 获取到最新版本的 hel 模块元数据
   */
  helpackSocketUrl: string;
  getSocketUrlWhenReconnect?: GetSocketUrlWhenReconnect;
  socketHttpPingWhenTryReconnect?: () => Promise<boolean>;
  /**
   * default: 见 HEL_SDK_SRC
   * hel 基础包 cdn 地址
   */
  helSdkSrc: string;
  /**
   * hel 项目入口胶水代码
   */
  helEntrySrc: string;
  /**
   * hel 模块名和模块配置映射关系
   */
  mod2conf: Record<string, IModConf>;
  /** 已注册的所有远程模块名，内部自动通过 mod2conf 计算出来 */
  modNames: string[];
  /**
   * 用户可自己实现此函数，重写 pageData 生成逻辑
   */
  getHelRenderParams: GetHelRenderParams;
  /**
   * 视图名称和资源名称的映射管理
   */
  view2assetName: Record<string, string>;
  /**
   * 所有的资源名称，格式形如 {modName}/{assetEntryName}，
   * 内部通过用户透传的 view2assetName 计算出来，如 name 无应用名前缀，会抛出错误
   */
  assetNameInfos: IAssetNameInfo[];
  /** 资源名称和视图名称的映射管理，内部通过 view2assetName 计算出来，key 格式见 assetNames 说明 */
  assetName2view: Record<string, string>;
  /** 视图名称与应用名称映射管理，内部通过 view2assetName 计算出来 */
  view2appName: Record<string, string>;
  /** 从 helpack 服务拉取组数据失败时，本地存在的 hel-meta 兜底文件路径 */
  helMetaBackupFilePath: string;
  /**
   * default: false，
   * 为 true 则监听到模块变化时就会向 meta-cache 模块写入数据
   */
  careAllModsChange: boolean;
  /**
   * default: false，
   * true: 由 mapAndPreload 来映射模块或由 preloadMiddleware 启动 sdk 来生成中间件，
   * 此时内部的 updateModPresetData 会调用 updateForServerFirst，表示优先更新可能存在的 server 模块
   */
  isPreloadMode: boolean;
  /**
   * 获取hel模块元数据，如没有特殊的请求路径，不用配置此项，内部会走自己预设的地址去请求
   */
  getMeta?: GetMeta;
  /**
   * ws 长连接首次建立连接成功时会调用 getEnvInfo 获取需上报的 envInfo 对象
   */
  getEnvInfo: () => null | Record<string, any>;
  /** 用户自定义的 get 函数，不透传时会使用内置的 axios.get */
  httpGet?: <T extends any>(url: string) => Promise<AxiosResponse<T, any>>;
  /**
   * 替换掉内部默认的准备文件过程，服务于一些需自定义下载逻辑或测试函数复制本地文件的场景
   */
  prepareFiles?: PrepareFiles;
  beforePreloadOnce?: BeforePreloadOnce;
  /** registerPlatform 设定的 hooks */
  regHooks: IHMNHooks;
  confHooks: IHMNHooks;
  /** addBusinessHooks 设定的 hooks */
  bizHooks: IHMNHooks;
  shouldAcceptVersion?: (params: IShouldAcceptVersionParams) => boolean;
}

/** 这些属性在内置对象里是必存在的，但对应用户透传的参数的来说是可选或不用透传的 */
type ExcludeProps =
  | 'view2assetName'
  | 'assetNameInfos'
  | 'assetName2view'
  | 'view2appName'
  | 'mod2conf'
  | 'modNames'
  | 'helpackApiUrl'
  | 'receiveAllMod'
  | 'platform'
  | 'isActive'
  | 'registrationSource'
  | 'helSdkSrc'
  | 'helEntrySrc'
  | 'isPreloadMode'
  | 'helpackSocketUrl'
  | 'beforePreloadOnce'
  | 'careAllModsChange';

/**
 * 用户初始化 node-hel 中间件需传递的可配置选项
 */
export interface IInitMiddlewareOptions extends Omit<ISDKPlatContext, ExcludeProps> {
  /**
   * default: unpkg
   */
  platform?: string;
  helSdkSrc?: string;
  helEntrySrc?: string;
  helpackApiUrl?: string;
  mod2conf?: ISDKPlatContext['mod2conf'];
  /**
   * 视图名称和资源名称的映射管理
   * @example
   * ```
   * { 'article.ejs': 'xHelMod/static', 'tag.ejs': 'yHelMod/tag' }
   * ```
   */
  view2assetName?: ISDKPlatContext['view2assetName'];
  /** 谨慎使用，此参数经用于测试时模拟一个redis实例 */
  redisMock?: any;
}

type ExcludePreloadProps =
  | 'isApiUrlOverwrite'
  | 'helMetaBackupFilePath'
  | 'helpackSocketUrl'
  | 'beforePreloadOnce'
  | 'careAllModsChange'
  | 'getHelRenderParams'
  | 'shouldAcceptVersion'
  | 'getEnvInfo'
  | 'api'
  | 'regHooks'
  | 'bizHooks'
  | 'confHooks';

/**
 * 对于 preload 流程来说，helMetaBackupFilePath 是非必须的
 */
export interface IPreloadMiddlewareOptions extends Omit<IInitMiddlewareOptions, ExcludePreloadProps> {
  helMetaBackupFilePath?: string;
}

export type THookType = 'onInitialHelMetaFetched' | 'onHelModLoaded' | 'onMessageReceived';
