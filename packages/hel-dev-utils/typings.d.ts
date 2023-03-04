/** SrcMap形如：
{
  "iconSrc": "/web-app/sub-apps/news-shelf/favicon.ico",
  "mainCssSrc": "",
  "chunkCssSrcList": [],
}
*/
export interface SrcMap {
  webDirPath: string;
  /** 用于辅助iframe载入子应用入口html地址 */
  iframeSrc: string;
  iconSrc: string;
  mainCssSrc: string;
  privCssSrcList: string[];
  /** 应用包含的所有 css 列表 */
  chunkCssSrcList: string[];
  /** 应用包含的所有 js 列表 */
  chunkJsSrcList: string[];
  headAssetList: string[];
  bodyAssetList: string[];
}

interface ObjBase {
  create_by: string;
  // create_at: '2020-04-01T02:51:35.000Z',
  create_at: string;
  update_at: string;
}

export interface SubAppInfo extends ObjBase {
  id: number;
  /** app对应的英文名 */
  name: string;
  /** app对应的组名 */
  app_group_name: string;
  /** app对应在敏感权限系统里的名字 */
  name_in_sec: string;
  /** 如果是测试app的话，只下发给测试人员，此种模式的app永远只会将build_version下发给前端，其他xxx_version对于它来说都是冗余的 */
  is_test: 1 | 0;
  /** 是否允许灰度 */
  enable_gray: 1 | 0;
  /** 是否正在灰度中，每次流水线构建时如果 enable_gray 是1，则此值会设置为1 */
  is_in_gray: 1 | 0;
  /** 灰度用户名单 */
  gray_users: string[];
  /** 每一个子应用对应的唯一token */
  token: string;
  /** app对应的中文名 */
  cnname: string;
  splash_screen: string;
  logo: string;
  desc: string;
  owners: string[];
  _ctime: string;
  _mtime: string;
  /** 产品审核通过，将预发布版本变为线上版本 */
  online_version: string;
  /** 测试人员提交审核，触发更新预发布版本 */
  pre_version: string;
  /** 开发在app后台提交构建版本为测试，触发更新测试版本 */
  test_version: string;
  /** 每次蓝盾流水线构建完毕，都会更新构建版本，当做灰度版本使用 */
  build_version: string;
  /** 是否允许流水线发布新版本 */
  enable_pipeline: 1 | 0;
  /** 是否允许下发给客户端做展示 */
  enable_display: 1 | 0;
  /** 请求host */
  api_host: string;
  /** 渲染模式 react react-shadow iframe */
  render_mode: string;
  class_name: string;
  versions: string;
  ui_framework: string;
  host_map: {
    online: string;
    pre: string;
    build: string;
  };
}
export interface SubAppVersion extends ObjBase {
  id: number;
  sub_app_id: string;
  /** 冗余存储的子应用名称，对应app_info表的name字段 */
  sub_app_name: string;
  /** 每次构建新生成的版本号 */
  sub_app_version: string;
  /**
   * 资源描述表map，parse后见domain-inner SrcMap
   */
  src_map: string;
  desc: string;
}

export interface SubAppVersionEntity extends SubAppVersion {
  src_map: SrcMap;
}

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

export interface ISubAppBuildDesc {
  platform: string;
  homePage: string;
  npmCdnType: string;
  groupName: string;
  name: string;
  externals: Record<string, any>;
  /** return merged externals */
  getExternals: (userExternals?: Record<string, any>) => Record<string, any>;
  jsonpFnName: string;
  getPublicPathOrUrl: (fallbackPathOrUrl = '/', ensureEndSlash = true) => string;
  distDir: string;
}

/** 用户自定义的各种提取选项 */
export interface IUserExtractOptions {
  buildDirFullPath: string;
  packageJson: Record<string, any>;
  subApp: ISubAppBuildDesc;
  /**
   *  构建版本号，当指定了 appHomePage 且不想采用默认的版本号生成规则时，才需要透传 buildVer 值
   *  默认生成规则：
   *  内网包：裁出 appHomePage ${cdnHost}/${appZone}/${appName}_${dateStr} 里的 ${appName}_${dateStr} 作为版本号
   *  外网包：pkg.version
   */
  buildVer?: string;
  /** default: 'build'，插件的资源清单元数据提取方式，build：只提取构建产物，bu_st：构建产物和静态产生都提取 */
  extractMode?: 'build' | 'bu_st';
  /** default: hel_dist */
  distDir?: string;
  /** default: true */
  writeMetaJsonToDist?: boolean;
}

export interface IInnerSubAppOptions {
  frameworkType: 'react' | 'vue2' | 'vue3' | 'lib';
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
   * default: hel-micro 包为 unpkg, @tencent/hel-micro 包为 hel
   */
  platform?: 'unpkg' | 'hel';
  /** default: unpkg ，当 platform 为 unpkg 时，此参数才有效
   * 需要发布到npm cdn托管元数据时（支持语义化版本资源请求链接）可设定此值，
   * 目前支持 unpkg、jsdelivr，后期支持其他 cdn 类型
   */
  npmCdnType?: 'unpkg' | 'jsdelivr';
}
