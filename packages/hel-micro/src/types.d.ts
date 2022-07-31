import type { ISubAppVersion, Platform, ApiMode } from 'hel-types';

export interface IGetOptionsLoose {
  platform?: string;
  versionId?: string;
}

export type CssAppendType = 'static' | 'build';

export type AnyRecord = Record<string, any>;

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
   * 版本号可到 管理台 查看
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
  /**
   * default: false
   * 是否使用平台配置的额外脚本文件或样式文件
   */
  useAdditionalScript?: boolean;
  /**
   * default: false
   * 是否开启 localStorage 缓存
   * 为 true ，每次都优先尝试读取 localStorage 里缓存的应用数据，再异步的拉取的一份新的应用数据缓存起来
   * 优点是可提速模块加载速度，结束元数据获取的时间，缺点是则是发版本后，用户需要多刷新一次才能看到最新版本
   * 为 false ，则总是同步的拉最新的应用数据
   */
  enableDiskCache?: boolean;
  apiMode?: ApiMode;
  onAppVersionFetched?: (versionData: ISubAppVersion) => void,
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
