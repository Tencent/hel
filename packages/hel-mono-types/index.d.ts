/**
 * @description: hel-mono 依赖的类型
 */

/**
 * hel应用（模块）配置
 */
export interface IHelModConf {
  /**
   * hel应用（模块）对应的hel组名
   */
  appGroupName: string;
  /**
   * 测试、线上对应的hel应用名（模块名）
   */
  appNames: {
    test: string;
    /** prod 未配置时，和 appGroupName 保持一致 */
    prod?: string;
  };
  /**
   * hel应用（模块）所属平台
   * default: 'unpkg'
   */
  platform?: string;
}

export interface IMonoAppBaseConf {
  /**
   * 应用启动端口
   */
  port: number;
  /**
   * default: IMonoDevInfo.devHostname
   * 当前hel模块本地联调时的域名
   */
  devHostname?: string;
  /**
   * hel应用（模块）相关配置
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
}

/**
 * 通过脚本裁剪 dev-info 配置后，注入到应用代码里的开发信息
 */
export interface IMonoInjectedDevInfo {
  /**
   * 各应用（或子模块）的大仓开发配置
   */
  appConfs: Record<string, IMonoAppBaseConf>;
  devHostname: string;
}
