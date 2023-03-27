import { ApiMode, IEmitAppInfo, ISubApp, ISubAppVersion, Platform } from 'hel-types';
export interface EventBus {
  on: (name: string, cb: (...args: any[]) => void) => void;
  emit: (name: string, ...args: any[]) => void;
  off: (name: string, cb: (...args: any[]) => void) => void;
}

export const helConsts: {
  DEFAULT_API_URL: '/openapi/v1/app/info';
  DEFAULT_API_PREFIX: 'https://unpkg.com';
  DEFAULT_ONLINE_VER: '__default_online_ver__';
  DEFAULT_USER_LS_KEY: 'HelUserRtxName';
  DEFAULT_PLAT: 'unpkg';
  PLAT_UNPKG: 'unpkg';
};

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

export interface IHelMicroDebug {
  /** 0: 不打印，1: log, 2: trace */
  logMode: number;
  logFilter: '';
  isInit: boolean;
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

export interface IAppAndVer {
  app: ISubApp;
  version: ISubAppVersion;
}

export interface IControlPreFetchOptions {
  platform: Platform;
  /**
   * default: true
   * 表示是否走语义化版本 api 请求，不设定此项的话最终会匹配到兜底值 true，匹配路径如下
   * ```
   * preFetchOptions.semverApi --> platInitOptions.semverApi --> originInitOptions.semverApi  --> true
   * ```
   * 表示是否走语义化版本 api 请求
   * ```
   * 为 true ，生成的请求链接格式形如：{apiPrefix}/{name}@{version}/hel_dist/hel-meta.json
   * 例子：https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json
   * 为 false ，生成的请求链接格式形如：{apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersion?name={name}&version={version}
   * ```
   */
  semverApi: boolean;
  /**
   * default: true
   * 表示是否严格匹配版本，不设定此项的话最终会匹配到兜底值 true，匹配路径如下
   * ```
   * preFetchOptions.strictMatchVer --> platInitOptions.strictMatchVer --> originInitOptions.strictMatchVer  --> true
   * ```
   * 如存在有老包体未发射版本号的情况，这里可以置为 false，让sdk能够正常获取到模块
   */
  strictMatchVer: boolean;
  /**
   * default：'get'
   * semverApi 为 true 时，设置此值无效，一定会发起 get 请求
   * 仅当 semverApi 为 false 时，设置此值才会有效
   * - 设置为 get 会发起如下格式的 get 请求
   * {apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersion?name={name}&version={version}
   * - 设置为 jsonp 会发起如下格式的 jsonp 请求
   * {apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersionJsonp?name={name}&version={version}
   */
  apiMode: ApiMode;
  /**
   * default: 'https://unpkg.com'
   * 请求接口的域名前缀，匹配规则见 getApiPrefix 描述
   */
  apiPrefix: string;
  /**
   * default: null
   * 生成 apiPrefix 的函数，同一个 option 层级下 getApiPrefix 返回值优先级会高于 apiPrefix 传值
   * ```
   * // 按以下优先级依次获取
   * 1 preFetchOptions.getApiPrefix()
   * 2 preFetchOptions.apiPrefix
   * 3 platInitOptions.getApiPrefix()
   * 4 platInitOptions.apiPrefix
   * 5 originInitOptions.getApiPrefix()
   * 6 originInitOptions.apiPrefix
   * 7 内部兜底值 'https://unpkg.com'
   * ```
   */
  getApiPrefix: () => string;
  /**
   * default: ''
   * 设定了 apiSuffix，则请求一定会带上设定的后缀值
   */
  apiSuffix: string;
  /**
   * default: '/openapi/v1/app/info'，请求应用元数据的主路径，仅当 semverApi 为 false 时，设置此值才会有效
   * 内部会结合 apiMode 来决定拼成请求路由 ${apiPathOfApp}/getSubAppAndItsVersion 或 ${apiPathOfApp}/getSubAppAndItsVersionJsonp
   * ```
   * // 按以下优先级依次获取
   * 1 preFetchOptions.apiPathOfApp
   * 2 platInitOptions.apiPathOfApp
   * 3 originInitOptions.apiPathOfApp
   * 4 内部兜底值 '/openapi/v1/app/info'
   * ```
   */
  apiPathOfApp: string;
  /**
   * default: '/openapi/v1/app/info'，请求应用应用版本的主路径，仅当 semverApi 为 false 时，设置此值才会有效
   * 内部会结合 apiMode 来决定拼成请求路由 ${apiPathOfAppVersion}/getSubAppVersion 或 ${apiPathOfAppVersion}/getSubAppVersionJsonp
   * ```
   * // 按以下优先级依次获取
   * 1 preFetchOptions.apiPathOfAppVersion
   * 2 platInitOptions.apiPathOfAppVersion
   * 3 originInitOptions.apiPathOfAppVersion
   * 4 内部兜底值 '/openapi/v1/app/info'
   * ```
   */
  apiPathOfAppVersion: string;
  /**
   * default: null
   * 定义获取 app 和 version 数据的函数，修改 hel-micro 的默认请求行为，可根据自己的实际需求来实现此函数逻辑
   * 如定义了 getSubAppAndItsVersionFn 函数，则 apiMode apiPrefix apiSuffix apiPathOfApp 设定均无效
   * @see https://tnfe.github.io/hel/docs/api/hel-micro/prefetch-lib#%E9%87%8D%E7%BD%AE%E5%85%83%E6%95%B0%E6%8D%AE%E6%8E%A5%E5%8F%A3
   * ```
   * // 优先级依次是：
   * 1 preFetchOptions.getSubAppAndItsVersionFn
   * 2 platInitOptions.getSubAppAndItsVersionFn
   * 3 originInitOptions.getSubAppAndItsVersionFn
   * 4 内部请求行为
   * ```
   */
  getSubAppAndItsVersionFn: (passCtx: {
    platform: string;
    appName: string;
    userName: string;
    versionId: string | undefined;
    url: string;
    /** 内部请求句柄 */
    innerRequest: (url?: string, apiMode?: ApiMode) => Promise<IAppAndVer>;
  }) => Promise<IAppAndVer> | IAppAndVer;
  /**
   * default: 'HelUserRtxName'，仅当 semverApi 为 false 时，设置此值才会有效
   * 发起自定义平台请求时，尝试从 localStorage 的 {userLsKey} 下获取用户名，
   * 如获取不到会继续尝试从 cookie 的 {userLsKey} 下获取用户名，
   * 以便让后台知道请求者是谁从而决定是否要下发灰度版本（如存在灰度版本）
   */
  userLsKey: string;
  /**
   * default: null ，仅当 semverApi 为 false 时，设置此值才会有效
   * 自定义获取用户名的函数，如用户定义了此函数，则获取优先级会高于 userLsKey 定义对应的获取逻辑
   */
  getUserName: (passCtx: { platform: string; appName: string; userLsKey?: string }) => string;
  /**
   * 元数据获取失败时（远端和本地缓存均失败）的钩子函数，如返回自定元数据，则可作为兜底数据
   */
  onFetchMetaFailed: (params: { appName: string }) => Promise<IAppAndVer> | IAppAndVer | void;
  /**
   * default: null ，仅当 semverApi 为 false 时，设置此值才会有效
   * sdk端控制是否下发灰度版本，不定义次函数走后台内置的灰度规则
   * 定义了此函数，返回true或false则会覆盖掉后台内置的灰度规则，返回 null 依然还是会走后台内置的灰度规则
   */
  shouldUseGray: (passCtx: { appName: string }) => boolean | null;
}

export interface IPlatformConfigInitFull extends IControlPreFetchOptions {
  /**
   * 信任的应用名单，当使用方拿到获取模块的 emitInfo 后，其他条件均满足目标模块特征，
   * 但因平台名字不同会被 judgeAppReady 判断失败而过滤掉，如果此时我们相信这个模块的确是我们想要的模块，
   * 可将模块名加入信任名单，这样可以让 preFetchLib 把模块正常返回给上层调用者
   * ----------- 注：平台名不同可能有多种原因 -----------
   * 1 历史包发射模块时未正常平台名
   * 2 基于同一个仓库的包体做了迁移，改到了另一个平台上
   */
  trustAppNames: null | string[];
}

/** 暂时兼容上层库不报错 */
export type IShouldUseGray = IPlatformConfigInitFull['shouldUseGray'];

export type IPlatformConfig = Partial<IPlatformConfigInitFull>;

export interface IPlatformConfigFull extends IPlatformConfigInitFull {
  origin: IPlatformConfig;
}

export interface SharedCache extends IPlatformConfigFull {
  isConfigOverwrite: boolean;
  isOriginInitCalled: boolean;
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
}

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
export function setGlobalThis(mockGlobalThis: any, merge?: boolean);

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

/**
 * 此函数服务于基于 hel-micro 二次封装后发布的定制包，供 createInstance 调用
 * 当 originInit 调用后，依然还能允许调用一次 init（initPlatformConfig） 重新一些平台参数
 * 但如果先调用了 init 那么 originInit 是不能被调用的，
 * 而 createInstance 内部逻辑会先调用 originInit 注入自己的平台相关参数后，再返回 apis 实例集合供上层用户使用，
 * apis.init 就给用户一次额外的机会定义或覆盖此平台的相关参数
 */
export function originInit(platform: Platform, options?: IPlatformConfig): void;

interface NullDef {
  nullValues?: any[];
  /** {} 算不算空，true算空 */
  emptyObjIsNull?: boolean;
  emptyArrIsNull?: boolean;
}

export type CommonUtil = {
  noDupPush: (list: any[], item: any) => void;
  merge2List: (list1: string[], list2: string[]) => string[];
  okeys: (map: any) => string[];
  purify: (obj: Record<string, any>, isValueValid?: (val: any) => boolean) => Record<string, any>;
  getObjsVal: <T extends any = any>(objs: any[], key: string, backupVal?: any) => T;
  isNull: (value: any, nullDef?: NullDef) => boolean;
  safeParse: <T extends any = any>(jsonStr: any, defaultValue: T, errMsg?: string) => T;
  noop: (...args: any[]) => any[];
};

export const commonUtil: CommonUtil;
