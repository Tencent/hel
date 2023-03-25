import type { IGetSubAppAndItsVersionFn, IOnFetchMetaFailed, IPlatformConfig } from 'hel-micro-core';
import type { ApiMode, ILinkAttrs, IScriptAttrs, ISubApp, ISubAppVersion, Platform } from 'hel-types';

export interface IGetOptionsLoose {
  platform?: string;
  versionId?: string;
}

export type CssAppendType = 'static' | 'build';

export type AnyRecord = Record<string, any>;

export type VersionId = string;

/**
 * default: true
 * 是否走语义化版本 api 请求
 * 为true时，生成的请求链接格式形如：{apiPrefix}/{name}@{version}/hel_dist/hel-meta.json
 * 例子：https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json
 * 为false时，生成的请求链接格式形如：{apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersion?name={name}&version={version}
 */
export type SemverApi = boolean;

export interface IHelMeta {
  app: ISubApp;
  version: ISubAppVersion;
}

export interface IGroupedStyleList {
  static: string[];
  build: string[];
}

export interface IPlatAndVer {
  platform: string;
  versionId: string;
}

export interface IWaitStyleReadyOptions extends IPlatAndVer {
  platform: string;
  versionId: string;
  strictMatchVer?: boolean;
}

export interface ICustom {
  host: string;
  /** default: true */
  enable?: boolean;
  /** 调用方设定的组名，用于匹配远程模块组名，用于当模块名和组名不一致时，且框架无法推导调用方需要的组名时，用户需自己设定 */
  appGroupName?: string;
  /**
   * default: false
   * 谨慎设置此选项！当设置为 true 时，就是相信调试的远程模块一定和当前传入的名字是匹配的，
   * hel-micro 会跳过一切检查，将对应地址的远程模块返回给调用方，可能会造成模块不符合预期结果的危险后果
   */
  trust?: boolean;
  /** 额外附加的样式列表，方便基于web-dev-server调试组件时，样式不丢失，仅在 enable=true 时此配置才有效 */
  extraCssList?: string[];
  /**
   * default: 'only_cust'，仅在 enable=true 时此配置才有效
   *
   * IPreFetchOptionsBase.extraCssList: outCss,
   * IPreFetchOptionsBase.custom.extraCssList: custCss
   *
   * 配置了 outCss 时，如何处理 custCss 和 outCss 的关系
   * merge: custCss 和 outCss 合并
   * only_cust: 保留 custCss，丢弃 outCss
   * only_out: 丢弃 custCss，保留 outCss
   */
  cssStrategy?: 'merge' | 'only_cust' | 'only_out';
  /**
   * defaut: false
   * 是否跳过获取 hel-meta.json 的获取步骤，true：跳过，false：不跳过
   * 当用户设定 custom.host 配置时，hel-micro 采取总是相信该 host 存在一个 hel-meta.json 文件并尝试去获取
   * 如获取失败时再去解析该 host 对应的首页并现场解析出 hel-meta.json 数据
   * 因此获取动作可能会报一个 404 not found 符合预期的行为，用户可设定 skipFetchHelMeta 为 true 跳过此步骤
   * 但建议加载线上模块时（非本地联调时），保持 skipFetchHelMeta 为 false 比较好，有利于提高模块加载速度（ 无html解析hel-meta.json过程 ）
   */
  skipFetchHelMeta?: boolean;
}

export interface ILinkInfo {
  el: HTMLLinkElement;
  attrs: ILinkAttrs;
}

export interface IScriptInfo {
  el: HTMLScriptElement;
  attrs: IScriptAttrs;
}

export interface IIsLink {
  <Tag extends 'link' | 'script'>(
    tag: Tag,
    info: { el: HTMLLinkElement | HTMLScriptElement; attrs: ILinkAttrs | IScriptAttrs },
  ): info is Tag extends 'link' ? ILinkInfo : IScriptInfo;
}

export interface IChangeAttrsFnCtx {
  appName: string;
  appGroupName: string;
  /** 原始的属性对象 */
  attrs: ILinkAttrs | IScriptAttrs;
  tag: 'link' | 'script';
  /**
   * 提供给用户的辅助函数，辅助缩窄 el 和 attrs 的类型，方便在 if else 块使用
   * ```ts
   * const info = { el, attrs };
   * if (isLink(tag, info)) {
   *   // now info.el type: HTMLLinkElement, info.attrs type: ILinkAttrs
   * } else {
   *   // now info.el type: HTMLScriptElement, info.attrs type: IScriptAttrs
   * }
   * ```
   */
  isLink: IIsLink;
}

export interface IChangeAttrs {
  (el: HTMLLinkElement | HTMLScriptElement, fnCtx: IChangeAttrsFnCtx): void;
}

export interface IPreFetchOptionsBase {
  /**
   * 是否严格匹配版本，未配置的话默认走 平台配置默认值 true
   */
  strictMatchVer?: boolean;
  platform?: Platform;
  /**
   * 指定拉取的版本号
   * 版本号可到 hel pack 服务或 unpkg 服务查看
   */
  versionId?: string;
  /**
   * 该配置仅针对 hel-pack 平台有效（hel-pack对其做了实现）
   *
   */
  projectId?: string;
  /**
   * default: true
   */
  appendCss?: boolean;
  /**
   * default: ['static', 'build']
   * 该配置项在 appendCss 为 true 时有效，表示按要附加哪几种类型的 css 链接到 html 文档上
   * 'static' 表示链接的静态css文件
   * 'build' 表示每次构建新生成的css文件
   */
  cssAppendTypes?: Array<CssAppendType>;
  /**
   * 默认 []
   * 返回的要排除的 css 链接列表，这些 css 将不会附加到 html 文档上
   */
  getExcludeCssList?: (allCssList: string[], options: { version: ISubAppVersion | null }) => string[];
  /** 额外附加的样式列表 */
  extraCssList?: string[];
  /**
   * default: false
   * 是否使用平台配置的额外脚本文件或样式文件
   */
  useAdditionalScript?: boolean;
  /**
   * default: false
   * 是否开启本地缓存
   * 为 true ，每次都优先尝试读取本地缓存的应用数据，再异步的拉取的一份新的应用数据缓存起来（ 可通过设置enableSyncMeta 为 false 关闭 ）
   * 优点是可提速模块加载速度，节约元数据获取的时间，缺点是则是发版本后，用户需要多刷新一次才能看到最新版本
   * 为 false ，则总是同步的拉最新的应用数据
   */
  enableDiskCache?: boolean;
  /** default: true
   * 当设置硬盘缓存 enableDiskCache 为 true 且发现了已缓存元数据时，此参数才有效，
   * 表示是否发起延迟请求去异步地同步一下最新的元数据，
   * 如设置了 enableDiskCache 为 true 且 enableSyncMeta 为 false 时，如已存在缓存元数据 sdk 则会一直使用该缓存
   * 为了让 sdk 重新最新元数据，可调用 appMetaSrv.clearDiskCachedApp(appName) 来人工清除缓存数据
   */
  enableSyncMeta?: boolean;
  /**
   * default: localStorage
   * 选择本地缓存的类型是 localStorage 还是 indexedDB
   */
  storageType?: 'localStorage' | 'indexedDB';
  apiMode?: ApiMode;
  semverApi?: SemverApi;
  /**
   * preFetchLib指定的请求域名前缀，会覆盖掉init里指定的（如有指定）
   */
  apiPrefix?: string;
  // TODO 抽象 metaHooks
  onAppVersionFetched?: (versionData: ISubAppVersion) => void;
  getSubAppAndItsVersionFn?: IGetSubAppAndItsVersionFn;
  onFetchMetaFailed?: IOnFetchMetaFailed;
  /** preFetchLib 获取到的lib为空时的钩子函数，如返回了具体的模块对象，可作为补偿 */
  onLibNull?: (appName, params: { versionId?: VersionId }) => Record<string, any> | void;
  custom?: ICustom;
  /**
   * default: false
   * 是否跳过404嗅探，该配置项只针对 unpkg 平台生效，当用户设置为 true 时，就不会发起一个带随机参数的url去试探出最新版本的请求
   * 请求形如：https://unpkg.com/hel-lodash/xxxxx-not-found
   */
  skip404Sniff?: boolean;
  /**
   * 直接操作回调参数 el 添加属性即可，例如
   * ```ts
   *  el.setAttribute('crossorigin', 'anonymous');
   *  // or
   *  el.crossOrigin = 'anonymous'; // 不推荐此方法，推荐使用 setAttribute 修改属性
   * ```
   * 如需查看更多信息，可查看第二位参数 fnCtx ( 可查类型 IChangeAttrsFnCtx )
   */
  changeAttrs?: IChangeAttrs;
  /**
   * sdk端控制是否下发灰度版本，不定义次函数走后台内置的灰度规则
   * true：强制返回灰度版本，false：强制返回线上版本
   * 定义了此函数，返回true或false都会覆盖掉后台内置的灰度规则，返回 null 依然还是会走后台内置的灰度规则
   */
  shouldUseGray?: () => boolean | null;
}

export interface IInnerPreFetchOptions extends IPreFetchOptionsBase {
  isLib?: boolean;
  isFirstCall?: boolean;
  controlLoadAssets?: boolean;
}

export interface IPreFetchLibOptions extends IPreFetchOptionsBase {
  /** 占位，方便将来扩展，避免 @typescript-eslint/no-empty-interface 规则报错 */
  __seat__?: any;
}

export type IBatchPreFetchLibOptions = Omit<IPreFetchLibOptions, 'platform' | 'apiMode' | 'isFullVersion'>;

export interface IPreFetchAppOptions extends IPreFetchOptionsBase {
  __seat__?: any;
}

export type BatchAppNames =
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string];

export interface ICreateInstanceOptions extends IPlatformConfig {
  /**
   * 是否触发语义化api调用元数据获取接口，具体含义点击 SemverApi 查看
   */
  semverApi?: SemverApi;
}
