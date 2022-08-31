import type { ISubAppVersion, Platform, ApiMode } from 'hel-types';
import type { IOnFetchMetaFailed, IGetSubAppAndItsVersionFn } from 'hel-micro-core';

export interface IGetOptionsLoose {
  platform?: string;
  versionId?: string;
}

export type CssAppendType = 'static' | 'build';

export type AnyRecord = Record<string, any>;

export type VersionId = string;

export interface IGroupedStyleList {
  static: string[];
  build: string[];
}

export interface IPlatAndVer {
  platform: string;
  versionId: string;
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
   * default: true
   */
  appendCss?: boolean;
  /**
   * default: ['static', 'build']
   * 该配置项在 appendCss 为 true 时有效，表示按要附加哪几种类型的 css 链接到 html 文档上
   * 'static' 表示链接的静态css文件
   * 'build' 表示每次构建新生成的css文件
   */
  cssAppendTypes?: Array<CssAppendType>,
  /**
   * 默认 []
   * 返回的要排除的 css 链接列表，这些 css 将不会附加到 html 文档上
   */
  getExcludeCssList?: (allCssList: string[], options: { version: ISubAppVersion | null }) => string[],
  /** 额外附加的样式列表 */
  extraCssList?: string[],
  /**
   * default: false
   * 是否使用平台配置的额外脚本文件或样式文件
   */
  useAdditionalScript?: boolean;
  /**
   * default: false
   * 是否开启 localStorage 缓存
   * 为 true ，每次都优先尝试读取 localStorage 里缓存的应用数据，再异步的拉取的一份新的应用数据缓存起来
   * 优点是可提速模块加载速度，节约元数据获取的时间，缺点是则是发版本后，用户需要多刷新一次才能看到最新版本
   * 为 false ，则总是同步的拉最新的应用数据
   */
  enableDiskCache?: boolean;
  apiMode?: ApiMode;
  // TODO 抽象 metaHooks
  onAppVersionFetched?: (versionData: ISubAppVersion) => void;
  getSubAppAndItsVersionFn?: IGetSubAppAndItsVersionFn;
  onFetchMetaFailed?: IOnFetchMetaFailed;
  custom?: {
    host: string,
    /** default: true */
    enable?: boolean,
    /** 调用方设定的组名，用于匹配远程模块组名，用于当模块名和组名不一致时，且框架无法推导调用方需要的组名时，用户需自己设定 */
    appGroupName?: string,
    /** 额外附加的样式列表，方便基于web-dev-server调试组件时，样式不丢失，仅在 enable=true 时此配置才有效 */
    extraCssList?: string[],
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
    cssStrategy?: 'merge' | 'only_cust' | 'only_out',
  },
}

export interface IInnerPreFetchOptions extends IPreFetchOptionsBase {
  isLib?: boolean;
  isFirstCall?: boolean,
  controlLoadAssets?: boolean,
}

export interface IPreFetchLibOptions extends IPreFetchOptionsBase {
  /** 占位，方便将来扩展，避免 @typescript-eslint/no-empty-interface 规则报错 */
  __seat__?: any;
}

export interface IPreFetchAppOptions extends IPreFetchOptionsBase {
  __seat__?: any;
}
