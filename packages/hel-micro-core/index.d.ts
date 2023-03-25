import { ApiMode, IEmitAppInfo, ISubApp, ISubAppVersion, Platform } from 'hel-types';
export interface EventBus {
  on: (name: string, cb: (...args: any[]) => void) => void;
  emit: (name: string, ...args: any[]) => void;
  off: (name: string, cb: (...args: any[]) => void) => void;
}

export const DEFAULT_ONLINE_VER = '__default_online_ver__';

export const helEvents: {
  // renderApp 发射的是 SUB_APP_LOADED
  SUB_APP_LOADED: 'subAppLoaded';
  // libReady 发射的是 SUB_LIB_LOADED
  SUB_LIB_LOADED: 'SubLibLoaded';
  // 3.2+ 新增样式字符串获取完毕事件
  STYLE_STR_FETCHED: 'StyleStrFetched';
};

type HelLoadStatus = {
  NOT_LOAD: 0;
  LOADING: 1;
  LOADED: 2;
};

export const helLoadStatus: HelLoadStatus;

export type HelLoadStatusEnum = HelLoadStatus[keyof HelLoadStatus];

export function getHelEventBus(): EventBus;

export function getUserEventBus(): EventBus;

export type Origin = {
  apiMode: string;
  apiPrefix: string;
  apiSuffix: string;
  apiPathOfApp: string;
  apiPathOfAppVersion: string;
  getApiPrefix: IGetApiPrefix;
  getSubAppAndItsVersionFn?: IGetSubAppAndItsVersionFn;
  userLsKey: string;
  getUserName?: IGetUserName;
  onFetchMetaFailed?: IOnFetchMetaFailed;
  shouldUseGray?: IShouldUseGray;
};

export interface IHelMicroDebug {
  /** 0: 不打印，1: log, 2: trace */
  logMode: number;
  logFilter: '';
  isInit: boolean;
}

export interface SharedCache {
  isConfigOverwrite: boolean;
  initPack: 'inner' | 'out';
  platform: Platform;
  /**
   * hel-lib-proxy.exposeLib 生成的代理对象会指向此对象
   */
  appName2Lib: Record<string, Record<string, any>>;
  /**
   * 记录第一个载入的 Comp
   */
  appName2Comp: Record<string, any>;
  /**
   * 记录 lib 是否已分配到 appName2Lib 的 libMap 里
   */
  appName2isLibAssigned: Record<string, boolean>;
  /**
   * 记录第一个载入的 emitApp
   */
  appName2EmitApp: Record<string, IEmitAppInfo>;
  /** 应用各个版本对应的lib */
  appName2verEmitLib: Record<string, Record<string, Record<string, any>>>;
  /** 应用各个版本对应的appInfo */
  appName2verEmitApp: Record<string, Record<string, IEmitAppInfo>>;
  /** 应用各个版本的load状态，用于控制loadApp或loadAppAssets是否要再次执行 0:未加载 1:加载中 2:加载结束  */
  appName2verLoadStatus: Record<string, Record<string, HelLoadStatusEnum>>;
  /**
   * 应用各个版本对应的样式字符串
   */
  appName2verStyleStr: Record<string, Record<string, string>>;
  /**
   * 应用各个版本对应的样式字符串是否已获取过
   */
  appName2verStyleFetched: Record<string, Record<string, HelLoadStatusEnum>>;
  /**
   * 应用各个版本对应的额外样式列表（由sdk注入）
   */
  appName2verExtraCssList: Record<string, Record<string, HelLoadStatusEnum>>;
  /**
   * 应用各个版本对应的版本数据
   */
  appName2verAppVersion: Record<string, Record<string, ISubAppVersion>>;
  /**
   * 记录第一个载入的app数据
   */
  appName2app: Record<string, ISubApp>;
  /**
   * 记录第一个载入的版本数据
   */
  appName2appVersion: Record<string, ISubAppVersion>;
  /**
   * 记录第一个载入的样式字符串
   */
  appName2styleStr: Record<string, string>;
  /**
   * 组名对应的第一个加载的模块版本号，用于辅助 tryGetVersion 推导版本号用，在 setVersion 时会写入
   */
  appGroupName2firstVer: Record<string, string>;
  apiPrefix: ''; // 必须
  /** 是否严格匹配版本 */
  strictMatchVer: true;
  apiMode: 'jsonp';
  apiSuffix: '';
  apiPathOfApp: string;
  apiPathOfAppVersion: '';
  getApiPrefix: IGetApiPrefix;
  getSubAppAndItsVersionFn?: IGetSubAppAndItsVersionFn;
  userLsKey: '';
  getUserName?: IGetUserName;
  onFetchMetaFailed?: IOnFetchMetaFailed;
  shouldUseGray?: IShouldUseGray;
  isOriginInitCalled: boolean;
  origin: Origin;
}

/**
 * 返回指定平台的共享 cache，不传递的话，则返回默认平台 cache
 * @param platform
 */
export function getSharedCache(platform?: Platform): SharedCache;

/**
 * 返回 debug 对象，支持设置一些调试参数
 */
export function getHelDebug(): IHelMicroDebug;

export interface ILibReadyOptions {
  platform?: Platform;
  versionId?: string;
  appName?: string;
}

export interface IAppReadyOptions {
  platform?: string;
  versionId?: string;
  lifecycle?: IEmitAppInfo['lifecycle'];
  appName?: string;
}

export function libReady(appGroupName: string, appProperties: any, options?: ILibReadyOptions): void;

export function appReady(appGroupName: string, Comp: any, options?: IAppReadyOptions): void;

/**
 * 获取内置的平台默认值，现为 'unpkg'，如是来自 createInstace 实例调用，则返回的是对应的自定义平台
 */
export function getPlatform(): Platform;

/**
 *
 * @param platform
 */
export function getPlatformHost(platform?: Platform): string;

export interface IAppAndVer {
  app: ISubApp;
  version: ISubAppVersion;
}

/**
 * 定义获取 app 和 version 数据的函数，修改 hel-micro 的默认请求行为，可根据自己的实际需求来实现此函数逻辑
 * 如定义了 getSubAppAndItsVersionFn 函数，则 apiMode apiPrefix apiSuffix apiPathOfApp 设定均无效
 * @see https://tnfe.github.io/hel/docs/api/hel-micro/prefetch-lib#%E9%87%8D%E7%BD%AE%E5%85%83%E6%95%B0%E6%8D%AE%E6%8E%A5%E5%8F%A3
 * 优先级依次是：
 * 1 oirginInitOptions.getSubAppAndItsVersionFn
 * 2 platformConfig.getSubAppAndItsVersionFn
 * 3 unpkgConfig.getSubAppAndItsVersionFn
 */
export interface IGetSubAppAndItsVersionFn {
  (passCtx: {
    platform: string;
    appName: string;
    userName: string;
    versionId: string | undefined;
    url: string;
    innerRequest: (url?: string, apiMode?: ApiMode) => Promise<IAppAndVer>;
  }): Promise<IAppAndVer> | IAppAndVer;
}

/** 元数据获取失败时（远端和本地缓存均失败）的钩子函数，如返回自定元数据，则可作为兜底数据 */
export interface IOnFetchMetaFailed {
  (params: { appName: string }): Promise<IAppAndVer> | IAppAndVer | void;
}

/**
 * 采用 apiPrefix 优先级：
 * originInitOptions.getApiPrefix() --> platformConfig.apiPrefix  --> unpkgConfig.getApiPrefix() --> unpkgConfig.apiPrefix
 */
export type IGetApiPrefix = () => string;

/**
 * sdk端控制是否下发灰度版本，不定义次函数走后台内置的灰度规则
 * 定义了此函数，返回true或false则会覆盖掉后台内置的灰度规则，返回 null 依然还是会走后台内置的灰度规则
 */
export type IShouldUseGray = (passCtx: { appName: string }) => boolean | null;

/** 自定义的获取用户名函数，如用户定义了此函数，则 userLsKey 定义无效 */
export type IGetUserName = (passCtx: { platform: string; appName: string; userLsKey: string }) => string;

export interface IPlatformConfigFull {
  /**
   * 是否严格匹配版本，默认 true
   * 如存在有老包体未发射版本号的情况，这里可以置为 false，让系统能够正常运行
   */
  strictMatchVer: boolean;
  /**
   * api 请求模式，支持 'get' 和 'jsonp'，对于 'unpkg' 平台，默认是 'get'，对于 'hel' 平台，默认是 'jsonp'
   */
  apiMode: ApiMode;
  /**
   * 未指定 apiPrefix 的情况下，会根据 platform 值决定请求那个域名的接口
   */
  apiPrefix: string;
  /**
   * 设定了 apiSuffix，则请求一定会带上设定的后缀
   */
  apiSuffix: string;
  /**
   * default: /openapi/v1/app/info
   * 此设定仅针对 hel 平台有效
   * 最终会根据 apiMode 来决定拼成 /openapi/v1/app/info/getSubAppAndItsVersion 或 /openapi/v1/app/info/getSubAppAndItsVersionJsonp
   */
  apiPathOfApp: string;
  /**
   * default: 如果未指定，则和 apiPathOfApp 值保持一致
   * 此设定仅针对 hel 平台有效
   * 最终会根据 apiMode 来决定拼成 /openapi/v1/app/info/getSubAppVersion 或 /openapi/v1/app/info/getSubAppVersionJsonp
   */
  apiPathOfAppVersion: string;
  platform: Platform;
  getSubAppAndItsVersionFn: IGetSubAppAndItsVersionFn;
  /**
   * 默认 'HelUserRtxName'，hel请求时，尝试重 localStorage 的 {userLsKey} 下获取用户名，
   * 如获取不到会继续尝试从  cookie 的 {userLsKey} 下获取用户名，
   * 以便让后台知道请求者是谁从而觉得是否要下发灰度版本（如存在灰度版本）
   */
  userLsKey: string;
  getUserName: IGetUserName;
  onFetchMetaFailed?: IOnFetchMetaFailed;
  shouldUseGray: IShouldUseGray;
  origin: Origin;
}

export type IPlatformConfigFullForInit = Omit<IPlatformConfigFull, 'origin'>;

export type IPlatformConfig = Partial<IPlatformConfigFullForInit>;

export function initPlatformConfig(config: IPlatformConfig, platform?: Platform): void;

export function getPlatformConfig(platform?: Platform): IPlatformConfigFull;

export function isSubApp(): boolean;

/**
 * @deprecated
 */
export function trySetMasterAppLoadedSignal(): void;

export function getVerApp(appName: string, options?: IGetOptions): IEmitAppInfo | null;

export function setEmitApp(appName: string, emitApp: IEmitAppInfo): void;

export interface IGetOptions {
  versionId?: string;
  platform?: Platform;
  /** 默认：false，版本是否严格匹配一致 */
  strictMatchVer?: boolean;
}

export function getVerLib(appName: string, options?: IGetOptions): IEmitAppInfo['appProperties'];

export function setEmitLib(appName: string, emitApp: IEmitAppInfo, options?: { appGroupName?: string; platform?: Platform }): void;

export interface IGetVerOptions {
  versionId?: string;
  platform?: Platform;
}

export function getVersion(appName: string, options?: IGetVerOptions): ISubAppVersion | null;

export function setVersion(appName: string, versionData: ISubAppVersion, options?: { platform?: Platform }): void;

export function getAppMeta(appName: string, platform?: Platform): ISubApp | null;

export function setAppMeta(appMeta: ISubApp, platform?: Platform): void;

export interface IGetStyleOptions {
  // 对应样式获取来说，版本必须传
  platform?: Platform;
  versionId: string;
}
type ISetStyleOptions = IGetStyleOptions;

export function getAppStyleStr(appName: string, options?: IGetStyleOptions): string;

export function setAppStyleStr(appName: string, styleStr: string, options: ISetStyleOptions): void;

export function setVerLoadStatus(appName: string, loadStatus: HelLoadStatusEnum, options?: IGetVerOptions): void;

export function getVerLoadStatus(appName: string, options?: IGetVerOptions): HelLoadStatusEnum;

export function setVerStyleStrStatus(appName: string, loadStatus: HelLoadStatusEnum, options?: IGetVerOptions): void;

export function getVerStyleStrStatus(appName: string, options?: IGetVerOptions): HelLoadStatusEnum;

export function setVerExtraCssList(appName: string, cssList: string[], options?: IGetVerOptions): void;

export function getVerExtraCssList(appName: string, options?: IGetVerOptions): string[];

export function tryGetVersion(appGroupName: string, platform?: Platform): string;

export function tryGetAppName(versionId: string, appGroupName?: string): string;

export function log(...args: any[]): void;

export function allowLog(): boolean;

export function getGlobalThis(): typeof globalThis;

/**
 * 辅助测试之用，正常情况下不需要调用此函数
 */
export function setGlobalThis(mockGlobalThis: any);

/**
 * 重置 globalThis，帮助一些微前端框架的子应用运行 hel-micro 时能够正常获取子模块
 */
export function resetGlobalThis(mockGlobalThis: any);

/**
 * 优先获取用户为某个应用单独设定的平台值，目前设定的时机有 preFetch、preFetchLib 时指定的平台值
 * @returns
 */
export function getAppPlatform(appGroupName: string): Platform;

/**
 * 记录完就返回应用的所属平台值
 */
export function setAppPlatform(appGroupName: string, platform?: Platform): Platform;

export interface IOriginInitOptions {
  getApiPrefix?: IGetApiPrefix;
  getSubAppAndItsVersionFn?: IGetSubAppAndItsVersionFn;
  getUserName?: IGetUserName;
}

/**
 * 此函数服务于基于 hel-micro 二次封装后发布的定制包，供 createInstance 调用
 * 当 originInit 调用后，依然还能允许调用一次 init（initPlatformConfig） 重新一些平台参数
 * 但如果先调用了 init 那么 originInit 是不能被调用的，
 * 而 createInstance 内部逻辑会先调用 originInit 注入自己的平台相关参数后，再返回 apis 实例集合供上层用户使用，
 * apis.init 就给用户一次额外的机会定义或覆盖此平台的相关参数
 */
export function originInit(platform: Platform, options?: IOriginInitOptions): void;

declare type DefaultExport = {
  DEFAULT_ONLINE_VER: typeof DEFAULT_ONLINE_VER;
  helEvents: typeof helEvents;
  helLoadStatus: typeof helLoadStatus;
  getHelEventBus: typeof getHelEventBus;
  getUserEventBus: typeof getUserEventBus;
  getHelDebug: typeof getHelDebug;
  getSharedCache: typeof getSharedCache;
  libReady: typeof libReady;
  appReady: typeof appReady;
  getPlatform: typeof getPlatform;
  getPlatformHost: typeof getPlatformHost;
  getPlatformConfig: typeof getPlatformConfig;
  initPlatformConfig: typeof initPlatformConfig;
  originInit: typeof originInit;
  isSubApp: typeof isSubApp;
  trySetMasterAppLoadedSignal: typeof trySetMasterAppLoadedSignal;
  // 应用Comp get set
  getVerApp: typeof getVerApp;
  setEmitApp: typeof setEmitApp;
  // 应用lib get set del
  getVerLib: typeof getVerLib;
  setEmitLib: typeof setEmitLib;
  // 应用元数据 get set
  getAppMeta: typeof getAppMeta;
  setAppMeta: typeof setAppMeta;
  // 版本元数据 get set
  getVersion: typeof getVersion;
  setVersion: typeof setVersion;
  // 应用的所有样式字符串 get set
  getAppStyleStr: typeof getAppStyleStr;
  setAppStyleStr: typeof setAppStyleStr;
  // 版本获取状态 get set
  setVerLoadStatus: typeof setVerLoadStatus;
  getVerLoadStatus: typeof getVerLoadStatus;
  // 样式字符串获取状态 get set
  getVerStyleStrStatus: typeof getVerStyleStrStatus;
  setVerStyleStrStatus: typeof setVerStyleStrStatus;
  // sdk注入的额外样式列表 get set
  getVerExtraCssList: typeof getVerExtraCssList;
  setVerExtraCssList: typeof setVerExtraCssList;

  getAppPlatform: typeof getAppPlatform;
  setAppPlatform: typeof setAppPlatform;
  tryGetVersion: typeof tryGetVersion;
  tryGetAppName: typeof tryGetAppName;
  log: typeof log;
  allowLog: typeof allowLog;
  getGlobalThis: typeof getGlobalThis;
  setGlobalThis: typeof setGlobalThis;
  resetGlobalThis: typeof resetGlobalThis;
};

declare let defaultExport: DefaultExport;
export default defaultExport;
