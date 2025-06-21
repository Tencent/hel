import { ExtractMode } from 'hel-types';

export type PkgJson = Record<string, any>;

/** 形如
  {
    fileAbsolutePath: '/tmp/CmsSubAppBxxxxx.chunk.css',
    cosDirName: 'om_20200408113805',
    cosFileRelativePath: '/static/css/35.4288e4f0.chunk.css'
  }
*/
export interface FileDesc {
  /** 文件在构建机容器里所处的绝对路径 */
  fileAbsolutePath: string;
  /** 文件在网络上所处的路径 */
  fileWebPath: string;
  /** 文件在网络上所处的路径（不带host） */
  fileWebPathWithoutHost: string;
}

export interface IAssetOptions {
  el: HTMLScriptElement;
  homePage: string;
  extractMode: SrcMap;
  enableRelativePath: boolean;
  enableAssetInnerText: boolean;
  innerText: string;
}

export interface IAssetInfo {
  url: string;
  el: HTMLScriptElement;
  isBuildUrl: boolean;
  isNonBuildAndRelative: boolean;
  allowAddToAssetList: boolean;
  canAppend: boolean;
  innerText: string;
}

export interface ISubAppBuildDesc {
  platform: string;
  homePage: string;
  npmCdnType: string;
  groupName: string;
  semverApi: boolean;
  name: string;
  externals: Record<string, any>;
  /** return merged externals */
  getExternals: (userExternals?: Record<string, any>) => Record<string, any>;
  jsonpFnName: string;
  /**
   * fallbackPathOrUrl default: '/'
   * ensureEndSlash default: true
   */
  getPublicPathOrUrl: (fallbackPathOrUrl: string, ensureEndSlash: boolean) => string;
  distDir: string;
}

/** 用户自定义的各种提取选项 */
export interface IUserExtractOptions {
  /**
   * 构建产物放置目录的全路径
   */
  buildDirFullPath: string;
  /**
   * defaut: ()=>false,
   * 返回 true 表示文件属于 server 端产物，文件路径会记录到 srvModSrcList 数组里
   * 返回 false 则按照之前的逻辑记录到 chunkCssSrcList 或 chunkJsSrcList
   */
  matchSrvModFile?: (fileDesc: FileDesc) => boolean;
  /**
   * defaut: ()=>false,
   * 返回 true 表示文件是 server 端产物的入口文件，文件路径会记录到 srvModSrcIndex ，
   * 注：只有 matchSrvModFile 判断为 true 为文件才会进入此函数，
   * 多次执行的话 srvModSrcIndex 值会被覆盖，
   */
  matchSrvModFileIndex?: (fileDesc: FileDesc) => boolean;
  /**
   * default: ()=>true，
   * 返回 true 表示包含此文件，未被随后用户自定义的 matchExcludedFile 排除掉时，该文件的路径会记录 version.src_map 下
   * 注：内部先执行 matchIncludedFile，再执行 matchExcludedFile
   */
  matchIncludedFile?: (fileDesc: FileDesc) => boolean;
  /**
   * default: ()=>false，
   * 返回 true 表示排除此文件，该文件的路径不会记录 version.src_map 下的任何节点里，
   * 内部会先执行 matchIncludedFile，再执行 matchExcludedFile，
   * 如某文件 a.js 在 matchIncludedFile 里就返回 false 表示不包含了，
   * 则 a.js 不会有机会进入到 matchExcludedFile 里再次做判断
   */
  matchExcludedFile?: (fileDesc: FileDesc) => boolean;
  packageJson: Record<string, any>;
  /**
   * @deprecated
   * 应用信息，保留此属性是为了让老用户升级后不报错，内部优先取 appInfo 再取 subApp
   */
  subApp: ISubAppBuildDesc;
  /**
   * 应用信息
   */
  appInfo: ISubAppBuildDesc;
  /**
   *  构建版本号，当指定了 appHomePage 且不想采用默认的版本号生成规则时，才需要透传 buildVer 值
   *  默认生成规则：
   *  内网包：裁出 appHomePage ${cdnHost}/${appZone}/${appName}_${dateStr} 里的 ${appName}_${dateStr} 作为版本号
   *  外网包：pkg.version
   */
  buildVer?: string;
  /**
   * default: 'all'，资源清单元数据提取方式，会影响元数据的记录结果
   */
  extractMode?: ExtractMode;
  /** default: hel_dist */
  distDir?: string;
  /** default: true */
  writeMetaJsonToDist?: boolean;
  /**
   * default: true，（ 自>=5.1.0 版本之后，调整为 true， 避免vite mjs 产物出现一些不可预期的错误 ）
   * 针对存在有 innerText 的节点时，是否提取到元数据 srcMap 里，true：提取 innerText 到 srcMap，false：存为外链后放 srcMap
   * 此参数在针对 vite 产物场景有用，vite 产物里有一些内联的 type='module' 的 script，它们需要被按顺序触发执行，外链后执行顺讯因为网络关系不一定能保证
   * 设置为 true 后，则 assetItem.innerText 会直接记录内联脚本内容，不再有额外的网络请求去拉取外链资源，执行顺序也就能保证了
   */
  enableAssetInnerText?: boolean;
  /** default: true, 是否替换的 dev.js 结尾的文件为 .js */
  enableReplaceDevJs?: boolean;
  /** default: false, 是否允许在 homePage 之外的相对路径的资源存在 */
  enableRelativePath?: boolean;
  /**
   * default: false,是否自动为 html 文件里出现的以单 / 开头的资源拼接上 homePage 前缀
   * 目前的使用场景式1：
   * vite.config 不知如何配置 publicUrl，可设置此参数为 true
   * 开启后，index.html里的 /aaa-123.js 会变为 {homePage}/aaa-123.js
   */
  enablePrefixHomePage?: boolean;
  /** default: undefined, 如无特殊情况，不需要指定，内部会自动去构建目录下查询 .html 结尾的文件 */
  indexHtmlName?: string;
  /** 记录到 version 里的描述信息 */
  /**
   * default: 'this version meta is created by hel-dev-utils@xxxx'
   * 记录到 version 里的描述信息
   */
  desc?: string;
}

export interface IInnerSubAppOptions {
  /** 历史原因，保留 vue3 vue3，目前他们的external配置一样 */
  frameworkType: 'react' | 'vue2' | 'vue3' | 'vue' | 'lib';
}

export interface IInnerFillAssetListOptions {
  homePage: string;
  buildDirFullPath: string;
  srcMap: SrcMap;
  isHead: boolean;
  enableReplaceDevJs: IUserExtractOptions['enableReplaceDevJs'];
  enableRelativePath: IUserExtractOptions['enableRelativePath'];
  enablePrefixHomePage: IUserExtractOptions['enablePrefixHomePage'];
  enableAssetInnerText: IUserExtractOptions['enableAssetInnerText'];
  matchSrvModFile: IUserExtractOptions['matchSrvModFile'];
  matchSrvModFileIndex: IUserExtractOptions['matchSrvModFileIndex'];
  matchIncludedFile: IUserExtractOptions['matchIncludedFile'];
  matchExcludedFile: IUserExtractOptions['matchExcludedFile'];
}

export interface ICreateSubAppOptions {
  externals?: Record<string, any>;
  homePage?: string;
  /**
   * default: true，
   * 当 platform 为 unpkg ，且用户自定义了 homePage 值时， 此参数才有作用
   * 表示最终生成的homepage值是否拼接上模块名、版本号、hel内置目录等参数
   * 例如用户设定 homePage: https://xxx.yyy.com/sub_path
   * changeHomePage 为 true ，最终生成的 homePage 形如：https://xxx.yyy.com/sub_path/pack-name@1.0.0/hel_dist/
   * changeHomePage 为 false ，最终生成的 homePage 形如：https://xxx.yyy.com/sub_path/
   */
  handleHomePage?: boolean;
  /**
   * default: 外部包为 unpkg, 内部包为 hel
   */
  platform?: string;
  /** default: unpkg ，当 platform 为 unpkg 时，此参数才有效
   * 需要发布到npm cdn托管元数据时（支持语义化版本资源请求链接）可设定此值，
   * 目前支持 unpkg、jsdelivr，后期支持其他 cdn 类型
   */
  npmCdnType?: 'unpkg' | 'jsdelivr';
  /**
   * default: true
   * 是否是语义化api格式的cdn链接
   */
  semverApi?: boolean;
  /**
   * default: 'hel_dist'
   */
  distDir?: string;
}

export interface ICheckOptions {
  /**
   * 不传递 fileFullPath 的话，会按照下面的路径去猜测 subApp 文件的位置：
   *
   * 执行的代码位于：<projectDir>/node_modules/hel-dev-utils/lib/index.js
   * 推测路径：path.join(__dirname, '../../../src/configs/subApp')
   *
   * 因通常 check 都是在 <projectDir>/scripts/check.js 里执行，如要传递可写为
   * ```js
   *  const fileFullPath = path.join(__dirname, '../src/configs/subApp');
   * ```
   *
   */
  fileFullPath?: string;
  /**
   * default: true
   * 是否检查 process.env.HEL_APP_GROUP_NAME 和 代码里的定义的 LIB_NAME 是否一致
   */
  checkEnv?: boolean;
}
