/**
 * @description: hel-mono-helper 对应的 dev-info 类型文件, hel-mono.json 的类型文件
 */

type PkgName = string;
type DeployEnv = string;
type HelModName = string;

export interface IHelMonoModBase {
  /**
   * 模块的 tsconfig.json 里使用的别名
   */
  alias?: string;
  /**
   * default: IHelMonoJsonBase['deployPath']
   * 当需要单独对某个模块设置 deployPath 时，可配置此项
   */
  deployPath?: string;
  /**
   * default: IHelMonoJsonBase['handleDeployPath']
   * 是否要对 deployPath 做处理，拼接上模块名、版本号参数
   */
  handleDeployPath?: boolean;
  /**
   * default: IHelMonoJsonBase['isServerModOneBundle']
   * true: 将 server 模块构建为一个文件，基于 tsup 构建
   * false：将 server 模块构建为多个文件，基于 tsc 构建，保持原目录结构
   */
  isServerModOneBundle?: boolean;
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

export interface IMonoAppConf extends IHelMonoModBase {
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

/**
 * 大仓应用（模块）的配置，key：应用（模块）在大仓里的包名，value：对应的配置对象
 */
export type MonoAppConfs = Record<string, IMonoAppConf>;


export interface IExConf {
  /**
   * default: false
   * 是否使用将大仓所有模块的一级依赖提升为外部资源的功能（内部会自动排除 baseExternals、customExternals 里的声明），
   * true：会注入大仓所有模块的一级依赖对应的外部资源的链接，需要同时配置 devRepoExLink 和 prodRepoExLink 参数
   */
  enableRepoEx?: boolean;
  /**
   * 本地开发时大仓使用的 external 资源链接
   */
  devRepoExLink?: string | string[];
  /**
   * 线上运行时大仓使用的 external 资源链接，用户可在下发首页是自动替换掉
   */
  prodRepoExLink?: string | string[];
}

export interface IHelMonoJsonBase extends IExConf {
  /**
   * default: 'start:hel'
   * 执行 pnpm run start xxx 或 pnpm start xxx 命令时，需要命中的具体 start 脚本
   */
  defaultStart?: string;
  /**
   * default: 'build:hel'
   * 执行 pnpm start .build xxx 命令时，需要命中的具体 build 脚本
   */
  defaultBuild?: string;
  /**
   * default: 'test'
   * 执行 pnpm start .test xxx 命令时，需要命中的具体 test 脚本
   */
  defaultTest?: string;
  /**
   * default: 3000
   * 执行 pnpm start .init-mono 时，以此值作为初始值逐渐加1，得到各个应用本地运行的端口值
   */
  defaultAppPortStart?: number;
  /**
   * default: 3100
   * 执行 pnpm start .init-mono 时，以此值作为初始值逐渐加1，得到各个子模块本地运行的端口值
   */
  defaultSubModPortStart?: number;
  /**
   * default: undefined
   * 执行 pnpm start 时，默认执行的目录，未指定时，尝试查找第一个
   */
  defaultAppDir: string;
  /**
   * default: 'https://unpkg.com'
   * 部署路径，可设置为其他带子路径的域名，例如 https://cdn.jsdelivr.net/npm'、'https://mycdn.com/hel' 等，
   * 最终生成的产物路径形如：'https://mycdn.com/hel/some-lib@some-ver/hel_dist'，
   * 注：此值的优先级低于执行构建命令时传入的 HEL_APP_HOME_PAGE 、HEL_APP_CDN_PATH 环境变量
   * ```
   * HEL_APP_HOME_PAGE 优先级高于 HEL_APP_CDN_PATH，2者区别在于：
   * 内部对 HEL_APP_HOME_PAGE 不做任何处理，直接当做 publicUrl 交给构建脚本
   * 内对会把 HEL_APP_CDN_PATH 和包名、版本号做拼接操作后再当作 publicUrl 交给构建脚本
   * ```
   */
  deployPath?: string;
  /**
   * default: true
   * 是否要对 deployPath 做处理，拼接上模块名、版本号参数
   */
  handleDeployPath?: boolean;
  /**
   * default: false
   * 允许大仓里模块的src目录下没有 index 导出文件，正常情况所有模块都需要有 index 来做统一导出，如存在特殊情况，
   * 为避免 getMonoDevData 获取 appSrcIndex 报错 Can not find index file ...， 可配置此参数，
   * 此时 appSrcIndex 会为空字符串 ''
   */
  allowEmptySrcIndex?: boolean;
  /**
   * 大仓各个模块的外部资源链接配置，通常存在多个宿主时，对各个宿主做不同的链接定制
   */
  exConfs: Record<string, IExConf>;
  /**
   * default: true
   * true: 将 server 模块构建为一个文件，基于 tsup 构建
   * false：将 server 模块构建为多个文件，基于 tsc 构建，保持原目录结构
   */
  isServerModOneBundle?: boolean;
  /**
   * default: true
   * 是否在控制台展示 hel-mono 相关log
   */
  displayConsoleLog?: boolean;
  /** default: ['apps'], 放置应用的目录名列表 */
  appsDirs?: string[];
  /** default: ['packages'], 放置子模块的目录名列表 */
  subModDirs?: string[];
  /**
   * 大仓全局使用的基础外部资源，用户可以按需重写此配置，改写后 dev/public/index.html 里的 id="BASE_EX" 的资源链接也需要替换
   * default: {
   *  react: 'React', 'react-dom': 'ReactDOM', 'react-is': 'ReactIs', 'react-reconciler':'ReactReconciler',
   *  'hel-micro': 'HelMicro', 'hel-lib-proxy': 'HelLibProxy'
   * }，
   */
  baseExternals?: Record<string, string>;
  /**
   * 大仓全局使用的用户自定义外部资源，配置后，需要在 dev/public/index.html 添加相应链接，
   * 同时需要标记 data-helex 记录此资源对应的全局模块名称
   */
  customExternals?: Record<string, string>;
  /**
   * default: []
   * start:hel 或 build:hel 时，大仓里的这些包排除到微模块构建体系之外，
   */
  exclude?: '*' | string[];
  /**
   * default: []，
   * start:hel 或 build:hel 时，通过 npm 安装到 node_modules 里的这些包排除到微模块构建体系之外（此模块是hel模块时设置此参数才有作用），
   * 即它们会以原始的npm模块形式运行或被打包到宿主中。
   * - '*' 表示排除所有
   * - []表示不排除，如有具体的排除项可配置其包名到数组里
   */
  nmExclude?: '*' | string[];
  /**
   * default: []，
   * start:hel 或 build:hel 时，通过 npm 安装到 node_modules 里的这些包包含到微模块构建体系之中，
   * nmExclude 和 nmInclude 同时生效时，nmExclude 的优先级高于 nmInclude。
   * - '*' 表示包含所有
   * - []表示不包含，如有具体的包含项可配置其包名到数组里
   */
  nmInclude?: '*' | string[];
  /**
   * default: '0.0.0.0'
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
  /**
   * 其他扩展参数，基于 hel-mono-helper 封装新的 sdk 时需用到的自定义参数
   */
  extra?: Record<string, any>;
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
  /**
   * 线上运行时元数据请求前缀
   */
  metaApiPrefix?: string;
  /**
   * 线上运行时指定的模块版本号，如指定表示锁定版本号
   */
  ver?: string;
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
   * default: 'localhost'
   * 所有hel模块本地联调时的域名
   */
  devHostname: string;
}

/**
 * package.json 里 hel 节点配置描述
 */
export interface IPkgHelConf {
  /**
   * 提供给自定义流水线参考的编译命令
   */
  ciCmd?: string;
  /**
   * 提供给自定义流水线参考的模块组名
   */
  groupName?: string;
  /**
   * 提供给自定义流水线参考的各个环境模块名
   */
  names?: Record<DeployEnv, HelModName>;
}

export interface IHelMonoMod extends IHelMonoModBase {
  /**
   * default: IHelMonoJsonBase.devHostname
   * 当前hel模块本地联调时的域名
   */
  devHostname?: string;
  port: number;
}


/**
 * 全部模块线上运行时的参数配置
 */
export interface IHelModRuntimeBaseConf {
  /**
   * 元数据请求前缀，未指定时尝试读 hel-json 顶层 helModRuntimeBaseConf 预设值，再读 sdk 自身的预设值
   * 仅需定制时才需要配置此项，否则使用默认值就可以了
   * ```txt
   * 注意：推荐优先考虑使用 runtimeConfs ，只会对某个模块有效，此参数会对所有模块有效
   * ```
   */
  metaApiPrefix?: string;
}

/**
 * 针对某个模块线上运行时的参数配置
 */
export interface IHelModRuntimeConf extends IHelModRuntimeBaseConf {
  /**
   * 模块版本，如需锁定可配置此项
   */
  ver?: string;
}

/**
 * 模块线上运行时的一些参数配置集合，支持对当前大仓的或非当前本仓的 hel 模块做配置
 */
export interface IHelMonoJsonRuntimeConf {
  /**
   * 对非本大仓的所有是 hel 的 node 模块有效（即来自 node_modules 的模块）
   */
  nmBaseRuntimeConf: IHelModRuntimeBaseConf;
  /**
   * 对本大仓的所有是 hel 的 node 模块有效
   */
  baseRuntimeConf: IHelModRuntimeBaseConf;
  /**
   * 对具体的 hel-node 模块有效（不区分是否是本大仓的 hel-node 模块）
   */
  runtimeConfs: Record<PkgName, IHelModRuntimeConf>;
}

/**
 * 用户可配置的  hel-mono.json 数据，通常是在 pnpm start .init-mono 生成的文件里做修改
 */
export interface IHelMonoJson extends IHelMonoJsonBase, IHelMonoJsonRuntimeConf {
  mods: Record<PkgName, IHelMonoMod>;
}
