import { ApiMode, IEmitAppInfo, ISubApp, ISubAppVersion, Platform } from 'hel-types';

type AppNameKey = string;
type CustomKey = string;
type VerKey = string;

export interface EventBus {
  on: (name: string, cb: (...args: any[]) => void) => void;
  emit: (name: string, ...args: any[]) => void;
  off: (name: string, cb: (...args: any[]) => void) => void;
}

export const helConsts: {
  CORE_VER: string;
  DEFAULT_API_URL: '/openapi/v1/app/info';
  DEFAULT_API_PREFIX: 'https://unpkg.com';
  DEFAULT_ONLINE_VER: '__default_online_ver__';
  DEFAULT_USER_LS_KEY: 'HelUserRtxName';
  DEFAULT_PLAT: 'unpkg';
  PLAT_UNPKG: 'unpkg';
  PLAT_HEL: 'hel';
  /** commonData.CSS_STR ，存放样式字符串 map */
  KEY_CSS_STR: 'CSS_STR';
  /** commonData.ASSET_CTX ，资源对应的具体上下文 */
  KEY_ASSET_CTX: 'ASSET_CTX';
  /** commonData.STYLE_TAG_ADDED ，对应的样式字符串 { [key: 'app-group-name' ]: string } */
  KEY_STYLE_TAG_ADDED: 'STYLE_TAG_ADDED';
  /** commonData.CSS_LINK_TAG_ADDED ，对应的样式url列表 { [key: 'http://localhost:3000' ]: string[] } */
  KEY_CSS_LINK_TAG_ADDED: 'CSS_LINK_TAG_ADDED';
  /** commonData.IGNORE_CSS_PREFIX_LIST ，忽略样式前缀列表 string[] */
  KEY_IGNORE_CSS_PREFIX_LIST: 'IGNORE_CSS_PREFIX_LIST';
  /** commonData.IGNORE_STYLE_TAG_KEY ，忽略样式前缀列表 { [key: string ]: 1|0 } */
  KEY_IGNORE_STYLE_TAG_KEY: 'IGNORE_STYLE_TAG_KEY';
  /** commonData.IGNORE_CSS_PREFIX_2_GNAME ，忽略样式前缀对应的组名 { [key: 'http://localhost:3000' ]: string } */
  KEY_IGNORE_CSS_PREFIX_2_GNAME: 'IGNORE_CSS_PREFIX_2_GNAME';
  /** commonData.IGNORE_CSS_PREFIX_2_NAME ，忽略样式前缀对应的应用名 { [key: 'http://localhost:3000' ]: string } */
  KEY_IGNORE_CSS_PREFIX_2_NAME: 'IGNORE_CSS_PREFIX_2_NAME';
};

export const helEvents: {
  // renderApp 发射的是 SUB_APP_LOADED
  SUB_APP_LOADED: 'subAppLoaded';
  // libReady 发射的是 SUB_LIB_LOADED
  SUB_LIB_LOADED: 'SubLibLoaded';
  // 3.2+ 新增样式字符串获取完毕事件
  STYLE_STR_FETCHED: 'StyleStrFetched';
  /** 4.2.3+ 用于监听动态添加的 style 标签，方便上层用到 shadowdom 的地方可以接收样式并转移到 shadowdom 内部 */
  STYLE_TAG_ADDED: 'StyleTagAdded';
  /** 4.2.6+ 用于监听动态添加的 link 标签，方便上层用到 shadowdom 的地方可以接收样式并转移到 shadowdom 内部 */
  CSS_LINK_TAG_ADDED: 'CssLinkTagAdded';
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

export interface IEvName {
  styleTagAdded(groupName: string): string;
  cssLinkTagAdded(host: string): string;
}

export const evName: IEvName;

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

export interface IHelMeta {
  app: ISubApp;
  version: ISubAppVersion;
}

export type IAppAndVer = IHelMeta;

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
    innerRequest: (url?: string, apiMode?: ApiMode) => Promise<IHelMeta>;
  }) => Promise<IHelMeta> | IHelMeta;
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
   * @deprecated since version v4.0
   * 建议配置到 options.hook.onFetchMetaFailed 里，此处保留此属性是为了让 v3 版本的用户升级到 v4 后，此钩子函数依然有效
   * 如同时配置 options.onFetchMetaFailed 和 options.hook.onFetchMetaFailed
   * 则 options.hook.onFetchMetaFailed 优先有效
   */
  onFetchMetaFailed: (params: { platform: string; appName: string; versionId: string }) => Promise<IHelMeta> | IHelMeta | void;
  /**
   * default: null ，仅当 semverApi 为 false 时，设置此值才会有效
   * sdk端控制是否下发灰度版本，不定义次函数走后台内置的灰度规则
   * 定义了此函数，返回true或false则会覆盖掉后台内置的灰度规则，返回 null 依然还是会走后台内置的灰度规则
   */
  shouldUseGray: (passCtx: { appName: string }) => boolean | null;
  hook: {
    /**
     * 用于做一些额外提示之用，如 params.fromFallback 为true，则表示 meta 数据来自于 onFetchMetaFailed 钩子返回的数据
     */
    onFetchMetaSuccess?: (params: { fromFallback: boolean; app: ISubApp; version: ISubAppVersion }) => void;
    /**
     * 元数据获取失败时（远端和本地缓存均失败）的钩子函数，如返回自定元数据，则可作为兜底数据
     */
    onFetchMetaFailed?: (params: { platform: string; appName: string; versionId: string }) => Promise<IHelMeta> | IHelMeta | void;
    beforeAppendAssetNode?: (passCtx: {
      /** link 元素或 script 元素 */
      el: HTMLLinkElement | HTMLScriptElement;
      /** 元素的样式 */
      url: string;
      /** 元素节点类型，辅助用户自己去收窄 el 具体类型 */
      tagName: 'LINK' | 'SCRIPT';
      nativeAppend: Node['appendChild'];
      setAssetUrl: (url: string) => void;
    }) => HTMLElement | void;
  };
}

export interface IPlatformConfigInitFull extends IControlPreFetchOptions {
  /**
   * default: null
   * 信任的应用名单，当使用方拿到获取模块的 emitInfo 后，其他条件均满足目标模块特征，
   * 但因平台名字不同会被 judgeAppReady 判断失败而过滤掉，如果此时我们相信这个模块的确是我们想要的模块，
   * 可将模块名加入信任名单，这样可以让 preFetchLib 把模块正常返回给上层调用者
   * ----------- 注：平台名不同可能有多种原因 -----------
   * 1 历史包发射模块时未正常设置平台名
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
   * 应用各个版本对应的自定义数据
   */
  appName2verCustomData: Record<AppNameKey, Record<CustomKey, Record<VerKey, any>>>;
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

/**
 * calling isSubApp is unsafe, cause it will return wrong result when they were lift up to webpack
 * externals, please install hel-iso and call its isSubApp instead
 * more details see: https://tnfe.github.io/hel/docs/tutorial/attention-is-subapp
 * 此方法已不鼓励使用，建议替换为 hel-iso 包体里的 isSubApp
 * 因为当 hel-micro/hel-lib-proxy 提升到 webpack external 里时，此方法将返回错误结果
 * 此处保留是为了让老用户升级到最新版本时，如未使用 hel-micro/hel-lib-proxy external 模式依然能够编译通过并正常运行
 * @deprecated
 */
export function isSubApp(): boolean;

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
  platform?: Platform;
  versionId?: string;
}

export function getVersion(appName: string, options?: IGetVerOptions): ISubAppVersion | null;

export function setVersion(appName: string, versionData: ISubAppVersion, options?: { platform?: Platform }): void;

export function getAppMeta(appName: string, platform?: Platform): ISubApp | null;

export function setAppMeta(appMeta: ISubApp, platform?: Platform): void;

export interface IGetStyleOptions {
  // 对应样式获取来说，版本必须传
  versionId: string;
  platform?: Platform;
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

export interface IGetCustomDataOptions {
  customKey: string;
  platform?: string;
  versionId?: string;
}

export interface ISetCustomDataOptions<T extends any = any> extends IGetCustomDataOptions {
  customValue: T;
}

/**
 * 获取应用的自定义数据
 */
export function getCustomData<T extends any = any>(appName: string, options: IGetCustomDataOptions): T | null;

/**
 * 设置应用的自定义数据
 */
export function setCustomData(appName: string, options: ISetCustomDataOptions): void;

/**
 * 获取通用自定义数据
 */
export function getCommonData<T extends any = any>(customKey: string, dataKey: string): T | null;

/**
 * 设置通用自定义数据
 */
export function setCommonData(customKey: string, dataKey: string, data: any): void;

interface ICommonDataUtil {
  /**
   * 设置忽略 append 的 css 前缀名单，设置后，满足以此前缀开头的 css 见不会被加载，
   * 再配合监听 evName.cssLinkTagAdded，并调用 commonDataUtil.getCssUrlList 拿到此前缀下的所有css列表
   * 以达到样式安全转移到 shadowdom 内部的目的
   */
  setIgnoreCssPrefix(ignoreCssPrefix: string): void;
  setIgnoreStyleTagKey(key: string): void;
  getIgnoreStyleTagMap(): Record<string, 1>;
  setIgnoreCssPrefixKey(ignoreCssPrefix: string, key: string): void;
  getIgnoreCssPrefixKeys(ignoreCssPrefix: string): string[];
  getMatchedIgnoreCssPrefix(url: string): string;
  getIgnoreCssPrefixCssUrlList(ignoreCssPrefix: string): string[];
  setIgnoreCssPrefixCssUrl(ignoreCssPrefix: string, url: string): void;
  getStyleTagText(key: string): string;
  clearStyleTagText(key: string): void;
  appendStyleTagText(key: string, text: string): void;
}

/** 操作 commonData 的内置方法集合 */
export const commonDataUtil: ICommonDataUtil;

/**
 * 此函数服务于基于 hel-micro 二次封装后发布的定制包，供 createInstance 调用
 * 当 originInit 调用后，依然还能允许调用一次 init（initPlatformConfig） 重新一些平台参数
 * 但如果先调用了 init 那么 originInit 是不能被调用的，
 * 而 createInstance 内部逻辑会先调用 originInit 注入自己的平台相关参数后，再返回 apis 实例集合供上层用户使用，
 * apis.init 就给用户一次额外的机会定义或覆盖此平台的相关参数
 */
export function originInit(platform: Platform, options?: IPlatformConfig): void;

export interface NullDef {
  /** default: [null, undefined, ''], 空值范围 */
  nullValues?: any[];
  /** default: true, {} 算不算空，true 算空，false 不算空 */
  emptyObjIsNull?: boolean;
  /** default: true, [] 算不算空，true 算空，false 不算空 */
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
  /**
   * for pretty format multi line string when use \`...\`
   * @param {*} mayLineBreakStr
   * @param {'MULTI' | 'ONE'} [mode='MULTI']
   * @returns
   * ```
   * // usage 1
   * pfstr(`
   *   line1 line1 line1,
   *   line2 line2 line2.
   * `);
   * // will print:
   * line1 line1 line1,
   * line2 line2 line2.
   * // attention: end <br/> will be removed automatically in MULTI mode
   * pfstr(`
   *   line1 line1 line1,<br/>
   *   line2 line2 line2.
   * `);
   * // will print:
   * line1 line1 line1,
   * line2 line2 line2.
   *
   * // usage 2, set mode='ONE' to print no line break string
   * pfstr(`
   *   line1 line1 line1,
   *   line2 line2 line2.
   * `, 'ONE');
   * // will print:
   * line1 line1 line1, line2 line2 line2.
   *
   * // usage 3, add <br/> to control line break
   * pfstr(`
   *   line1 line1 line1,
   *   line2 line2 line2,<br/>
   *   line3 line3 line3.
   * `, 'ONE');
   * // will print:
   * line1 line1 line1,
   * line2 line2 line2,line3 line3 line3.
   * ```
   */
  pfstr: (mayLineBreakStr: string, mode: 'MULTI' | 'ONE') => string;
  /**
   * call pfstr(mayLineBreakStr, 'ONE');
   */
  nbstr: (mayLineBreakStr: string) => string;
  /**
   * pass mayLineBreakStr to nbstr then alert it
   * @param {boolean} alertInDev - default: true, on alert string in development environment,
   * if set false, it will always alert
   */
  nbalert: (mayLineBreakStr: string, alertInDev?: boolean) => string;
  setDataset: (el: Element, key: string, val: string) => void;
  disableNode: (el: Element) => void;
};

export const commonUtil: CommonUtil;

export interface IInjectPlatOptions {
  /** 不处理的名称 */
  ignoreKeys?: string[];
  /** 把第一位实参作为包含平台值对象处理的函数名称列表（默认把第一位实参当做包含平台值的对象） */
  arg1PlatObjFnKeys?: string[];
}

/**
 * 对函数注入平台值参数，辅助上层模块生成 ins 对象
 * @returns {Record<string, any>} - newMod
 */
export function inectPlatToMod<T extends Record<string, any> = Record<string, any>>(
  platform: string,
  mod: T,
  options?: IInjectPlatOptions,
): T;
