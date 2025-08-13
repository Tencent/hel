/**
 * @description: hel-mono-helper 对应的 dev-info 类型文件
 */

/**
 * 通过 entry/replace/replaceDevInfo.js 脚本注入的 hel 模块配置
 */
export interface IInjectedHelModConf {
  appGroupName: string;
  appNames: Record<string, string>;
  platform?: string;
}

export interface IMonoInjectedAppBaseConf {
  port: number;
  devHostname?: string;
  hel: IInjectedHelModConf;
}

/**
 * hel应用（模块）配置
 */
export interface IHelModConf {
  /**
   * hel应用（模块）对应的hel组名，如果组名和包名一致可不用配置此项，
   * 内部会从上下文拿到包名作为此值，
   */
  appGroupName?: string;
  /**
   * 测试、线上、或其他环境对应的hel应用名（模块名），默认 prod 的 appName 和 appGroupName 需保持一致，无需配置
   */
  appNames?: Record<string, string>;
  /**
   * hel应用（模块）所属平台
   * default: 'unpkg'
   */
  platform?: string;
}

export interface IMonoAppBaseConf {
  /**
   * 应用启动端口，建议配置，未配置的话内部会自动推导
   */
  port?: number;
  /**
   * default: IMonoDevInfo.devHostname
   * 当前hel模块本地联调时的域名
   */
  devHostname?: string;
  /**
   * hel应用（模块）相关配置，适用于 helpack 平台需要
   */
  hel?: IHelModConf;
}

export interface IMonoAppConf extends IMonoAppBaseConf {
  /**
   * 应用相对路径别名
   */
  alias?: string;
}

export type MonoAppConfs = Record<string, IMonoAppConf>;

/**
 * hel-mono 大仓开发信息
 */
export interface IMonoDevInfo {
  /**
   * externals 映射配置
   */
  appExternals: Record<string, string>;
  /**
   * 各应用（或子模块）的大仓开发配置
   */
  appConfs: MonoAppConfs;
  /** default: ['apps'], 放置应用的目录名列表 */
  appsDirs?: string;
  /** default: ['packages'], 放置子模块的目录名列表 */
  subModDirs?: string;
  /**
   * default: 'http://localhost'
   * 所有hel模块本地联调时的域名
   */
  devHostname?: string;
  /**
   * default: hel-micro
   * 模板文件里使用的 hel-micro sdk，如用户基于hel-micro向上封装了自己的sdk，这里可配置封装sdk的名称，
   * 让生成的模板文件里 sdk 路径指向用户 sdk
   */
  helMicroName?: string;
  /**
   * default: hel-lib-proxy
   * 模板文件里使用的 hel-lib-proxy sdk 名称，如有自定义包可定义此值，让生成的模板文件里 sdk 路径指向用户 sdk
   */
  helLibProxyName?: string;
}

export type MonoInjectedAppConfs = Record<string, IMonoInjectedAppBaseConf>;

/**
 * 通过脚本裁剪 dev-info 配置后，注入到应用代码里的开发信息
 */
export interface IMonoInjectedDevInfo {
  /**
   * 各应用（或子模块）的大仓开发配置
   */
  appConfs: MonoInjectedAppConfs;
  /**
   * default: 'http://localhost'
   * 所有hel模块本地联调时的域名
   */
  devHostname: string;
}
