/**
 * @description: hel-mono-helper 对应的 dev-info 类型文件
 */

type PkgName = string;
type DeployEnv = string;
type HelModName = string;

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

/**
 * 大仓应用（模块）的配置，key：应用（模块）在大仓里的包名，value：对应的配置对象
 */
export type MonoAppConfs = Record<string, IMonoAppConf>;


export interface IHelMonoJsonBase {
  /**
   * default: 'start:hel'
   * 执行 pnpm run start 命令时，需要命中的具体 start 脚本
   */
  defaultStart?: string;
  /**
   * default: 'build:hel'
   * 执行 pnpm run build 命令时，需要命中的具体 build 脚本
   */
  defaultBuild?: string;
  /** default: ['apps'], 放置应用的目录名列表 */
  appsDirs?: string[];
  /** default: ['packages'], 放置子模块的目录名列表 */
  subModDirs?: string[];
  /**
   * default: {
   *  react: 'React', 'react-dom': 'ReactDOM', 'react-is': 'ReactIs', 'react-reconciler':'ReactReconciler',
   *  'hel-micro': 'HelMicro', 'hel-lib-proxy': 'HelLibProxy'
   * }，
   * 全局 externals
   */
  appExternals?: Record<string, string>;
  /**
   * start:hel 或 build:hel 时，这些包排除到微模块构建体系之外，
   * 可以指定大仓里的模块，也可以指定 node_modules 里的模块（此模块是hel模块时设置此参数才有作用）
   */
  exclude?: string[];
  /**
 * default: 'http://localhost'
 * 所有hel模块本地联调时的域名
 */
  devHostname?: string;
  /**
   * default: 'hel-micro'
   * 模板文件里使用的 hel-micro sdk，如用户基于 hel-micro 向上封装了自己的sdk，这里可配置封装sdk的名称，
   * 让生成的模板文件里 sdk 路径指向用户 sdk
   */
  helMicroName?: string;
  /**
   * default: 'hel-lib-proxy'
   * 模板文件里使用的 hel-lib-proxy sdk 名称，如有自定义包可定义此值，让生成的模板文件里 sdk 路径指向用户 sdk
   */
  helLibProxyName?: string;
}

/**
 * 通过 entry/replace/replaceDevInfo.js 脚本注入的 hel 模块配置
 */
export interface IMonoInjectedMod {
  port: number;
  devHostname?: string;
  groupName: string;
  names: Record<DeployEnv, HelModName>;
  platform?: string;
  /**
   * 是来自 node_modules 的 hel 模块
   */
  isNm?: boolean;
}


export type IMonoInjectedModDict = Record<string, IMonoInjectedMod>;

/**
 * 通过脚本裁剪 dev-info 配置后，注入到应用代码里的开发信息
 */
export interface IMonoInjectedDevInfo {
  /**
   * 各应用（或子模块）的大仓开发配置
   */
  mods: IMonoInjectedModDict;
  /**
   * default: 'http://localhost'
   * 所有hel模块本地联调时的域名
   */
  devHostname: string;
}

/**
 * package.json 里 hel 节点配置描述
 */
export interface IPkgHelConf {
  ciCmd?: string;
  groupName?: string;
  names?: Record<DeployEnv, HelModName>;
  port?: number;
  alias?: string;
}

export interface IHelMonoMod {
  port: number;
  /**
   * 模块的 tsconfig.json 里使用的别名
   */
  alias?: string;
}

/**
 * 用户可配置的  hel-mono.json 数据，通常是在 pnpm start .init-mono 生成的文件里做修改
 */
export interface IHelMonoJson extends IHelMonoJsonBase {
  mods: Record<PkgName, IHelMonoMod>;
}
