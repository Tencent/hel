
/**
 * 实例化 MicroApp 时，如传递了 platform ， 则调用对应平台的 api，
 * 如未传递 platform ，则读取 initPlatform 设定的平台对应的 api，
 * 如未调用过 initPlatform 设定平台值，则默认调用 hel 平台的 api，
 */

/** 平台值，如果用户不显示指定的话，优先取 helMicro.init 设定的平台值，未设定的话取默认值 'hel' */
export type Platform = string;

/**
* api 请求方式，默认 jsonp
* jsonp 跨域请求方便
*/
export type ApiMode = 'get' | 'jsonp';

/** 构建产生的 link 标签 */
export type TagLink = 'link';
/** 构建产生的 script 标签 */
export type TagScript = 'script';
/** 非构建产生的 link 标签 */
export type TagStaticLink = 'staticLink';
/** 非构建产生的 script 标签 */
export type TagStaticScript = 'staticScript';
export type ItemTag = TagLink | TagScript | TagStaticLink | TagStaticScript;

export interface ILinkAttrs {
  href: string;
  rel: string;
  as?: string;
}

export interface IScriptAttrs {
  src: string;
}

export interface ILinkItem {
  tag: TagLink;
  attrs: ILinkAttrs;
}

export interface IStaticLinkItem {
  tag: TagStaticLink;
  attrs: ILinkAttrs;
}

export interface IScriptItem {
  tag: TagScript;
  attrs: IScriptAttrs;
}

export interface IStaticScriptItem {
  tag: TagStaticScript;
  attrs: IScriptAttrs;
}

export type IAssetItem = ILinkItem | IScriptItem | IStaticLinkItem | IStaticScriptItem;
export type IAssetItemAttrs = ILinkAttrs | IScriptAttrs;

export interface ISrcMap {
  /** index.html 入口文件地址 */
  htmlIndexSrc: string,
  /** 产物的web目录名字，所有产物都会已这个目录作为根目录 */
  webDirPath: string,
  headAssetList: IAssetItem[],
  bodyAssetList: IAssetItem[],
  /**
   * 所有的样式url列表
   */
  chunkCssSrcList: string[],
  /**
   *  标记了 hreflang 为 PRIV_CSS 的文件列表
   */
  privCssSrcList: string[],
}

export interface IProjVer {
  /** o: online_version, t: build_version */
  map: Record<string, { o: string, b: string }>,
  /** 后台还会用于预防更新冲突 */
  utime: number,
}

export interface IAppRenderInfo {
  name: string,
  version: string,
  additionalScripts?: string[],
  additionalBodyScripts?: string[],
  srcMap: ISrcMap,
}


export interface ISubApp {
  id: number,
  /** app名称，同时也是浏览器的访问入口凭证 */
  name: string,
  app_group_name: string,
  name_in_sec: string,
  additional_scripts: string[],
  additional_body_scripts?: string[],
  online_version: string,
  build_version: string,
  /** 应用的分类类型 */
  class_name: string,
  /** 应用中文名 */
  cnname: string,
  /** 是否是测试应用 */
  is_test: 0 | 1,
  /** 是否置顶（即推荐） */
  is_top: 1 | 0,
  /** 负责人 */
  owners: string[],
  /** 灰度用户名单 */
  gray_users: string[],
  /** 应用的仓库地址 */
  git_repo_url: string,
  create_at: string, // "2019-11-05T08:37:17.000Z"
  update_at: string, // "2019-11-05T08:37:17.000Z"
  create_by: string
  desc: string,
  /** 是否允许蓝盾【海拉元数据模块提取】插件执行 */
  enable_pipeline: 1 | 0,
  /** 是否允许下发给 HelPack 前台做展示 */
  enable_display: 1 | 0,
  /** 插件的资源清单元数据提取方式，build：只提取构建产物，bu_st：构建产物和静态产生都提取 */
  extract_mode: 'build' | 'bu_st',
  /** 托管在 HelPack 渲染时，访问应用的开屏过度图 */
  splash_screen: string,
  /** 应用在 HelPack 里展现的 logo url */
  logo: string,
  /** 项目id和版本映射关系，目前该配置仅作用于 hel-pack 模块管理台 */
  proj_ver: IProjVer,

  // ----------------- 以下属性暂时都用不到了 --------------
  api_host: string,
  /** 是否是富媒体类型应用 */
  is_rich: 1 | 0,
  /** 是否后端渲染 */
  is_back_render: 1 | 0,
  iframe_src_map: string | null,
  /** 【暂无用】原计划为 'react-shadow' | 'react' | 'iframe' */
  render_mode: string,
  host_map: string,
  ui_framework: string,
}

export interface ISubAppVersion {
  sub_app_id: string,
  /** 冗余存储的子应用名称，对应app_info表的name字段 */
  sub_app_name: string,
  /** 每次构建新生成的版本号 */
  sub_app_version: string,
  /** 开发或者测试版本调用api所属域名，不填写的会去读取app.host_map.build  */
  api_host: string,
  /**
   * 资源描述表map
   */
  src_map: ISrcMap,
  /** html entry 字符串 */
  html_content: string,
  /** 触发构建时的 git 提交信息 */
  desc: string,
  /** 带时区的时间戳字符串，形如；2022-03-01T06:39:46.000Z */
  create_at: string,
  /** 触发构建的 rtx 名称 */
  create_by: string,
  /** 蓝盾空间名 */
  project_name: string,
  /** 蓝盾流水线id */
  pipeline_id: string,
  /** 蓝盾构建id */
  build_id: string,
  git_branch: string,
  /** 触发构建时的 git hash 值，如有多个会用 ',' 隔开 */
  git_hashes: string,
  /** 当次构建对应的仓库地址 */
  git_repo_url: string,
  /** 海拉插件版本号，记录当前应用是基于那一版插件构建的 */
  plugin_ver: string,
}

export interface IEmitAppInfo {
  platform: string;
  appName: string;
  appGroupName: string;
  versionId: string;
  /** 通过 libReady 发射的数据 */
  isLib: boolean;
  Comp: any;
  appProperties?: Record<string, any>;
  lifecycle?: {
    mount?: () => void;
    unmount?: () => void;
  }
}

export interface IEmitStyleInfo {
  platform: string;
  appName: string;
  versionId: string;
}
