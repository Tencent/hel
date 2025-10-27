import { ISubApp } from 'hel-types';

interface IAssetItem {
  tag: string;
  attrs: {
    href: string;
    rel: string;
    src: string;
  }
}
export interface SrcMap {
  /** https://tnfe.gtimg.com/hel/xxapp_20230526172318 */
  webDirPath: string,
  headAssetList: IAssetItem[],
  bodyAssetList: IAssetItem[],
  chunkJsSrcList: string[];
  chunkCssSrcList: string[];
}

interface ObjBase {
  id: string, // 为了兼容老版本存储，声明为 string
  create_by: string,
  // create_at: '2020-04-01T02:51:35.000Z',
  create_at: string,
  update_at: string,
}

interface ObjBaseV2 {
  id: string, // 为了兼容老版本存储，声明为 string
  create_by: string,
  ctime: string,
  mtime: string,
}

export interface IProjVer {
  /** o: online_version, t: test_version */
  map: Record<string, { o: string, b: string }>,
  /** 后台还会用于预防更新冲突 */
  utime: number,
}

export interface SubAppInfoRaw extends ObjBase {
  /** app对应的英文名 */
  name: string,
  /** app对应的组名 */
  app_group_name: string,
  /** app对应在敏感权限系统里的名字 */
  name_in_sec: string,
  /** 如果是测试app的话，只下发给测试人员，此种模式的app永远只会将build_version下发给前端，其他xxx_version对于它来说都是冗余的 */
  is_test: 1 | 0,
  /** 是否允许灰度 */
  enable_gray: 1 | 0,
  /** 是否正在灰度中，每次流水线构建时如果 enable_gray 是1，则此值会设置为1 */
  is_in_gray: 1 | 0,
  /** (string []) 灰度用户名单 */
  gray_users: string,
  /** 每一个子应用对应的唯一token */
  token: string,
  /** app对应的中文名 */
  cnname: string,
  splash_screen: string,
  logo: string,
  desc: string,
  /**
   * (string []) 管理员
   */
  owners: string,
  /** 项目id和版本映射关系，目前该配置仅作用于 hel-pack 模块管理台 */
  proj_ver: string,
  _ctime: string,
  _mtime: string,
  /** 产品审核通过，将预发布版本变为线上版本 */
  online_version: string,
  /** 总是指向最新发布的版本号 */
  pre_version: string,
  /** 暂时无用的版本号 */
  test_version: string,
  /** 每次蓝盾流水线构建完毕，都会更新构建版本，当做灰度版本使用 */
  build_version: string,
  /** 最新的package version值，需插件支持才会记录 */
  npm_version: string,
  /** 是否允许流水线发布新版本 */
  enable_pipeline: 1 | 0,
  /** 是否允许下发给客户端做展示 */
  enable_display: 1 | 0,
  /** 请求host */
  api_host: string,
  /** 渲染模式 react react-shadow iframe */
  render_mode: string,
  class_name: string,
  class_key: string,
  git_repo_url: string,
  ui_framework: string,
  host_map: any,
}

export interface SubAppVersionRaw extends ObjBase {
  sub_app_id: string,
  /** 冗余存储的子应用名称，对应app_info表的name字段 */
  sub_app_name: string,
  /** 每次构建新生成的版本号 */
  sub_app_version: string,
  /** 开发或者测试版本调用api所属域名，不填写的会去读取app.host_map.build  */
  api_host: string,
  /**
   * 资源描述表map，parse后见domain-inner SrcMap
   */
  src_map: string,
  html_content: string,
  desc: string,
  git_repo_url: string,
  /** 构建时刻对应的package version值，需插件支持才会记录 */
  npm_version: string,
}

type OmitFields = 'gray_users' | 'owners' | 'additional_scripts' | 'additional_body_scripts' | 'proj_ver';
export type SubAppInfo = Omit<SubAppInfoRaw, OmitFields> & {
  gray_users: string[];
  owners: string[];
  additional_scripts: string[];
  additional_body_scripts: string[];
  proj_ver: IProjVer;
};
export type SubAppInfoParsed = ISubApp;
export type ISubAppUpdate = Partial<ISubApp> & { name: string };

export type SubAppVersion = Omit<SubAppVersionRaw, 'src_map'> & { src_map: SrcMap, git_messages: string[] };
export type SubAppVersionParsed = SubAppVersion;

export type TestUserRaw = Omit<TestUser, 'visible_app'> & { visible_app: string }

export interface TestUser extends ObjBase {
  rtx_name: string,
  visible_app: {
    apps: string[],
    check: boolean,
    key: 'name' | 'name_in_sec',
  }
}

export interface UserStarApp extends ObjBase {
  rtx_name: string,
  star_info: {
    appNames: string[],
  }
}

export type UserStarAppRaw = Omit<UserStarApp, 'star_info'> & { star_info: string }

export interface UserVisitAppRaw extends ObjBase {
  rtx_name: string,
  visit_info: string,
}

export interface UserVisitApp extends ObjBase {
  rtx_name: string,
  visit_info: {
    appNames: string[],
  }
}

export interface UserExtend extends ObjBase {
  rtx_name: string,
  extend_info: {
    createAppLimit: number,
  }
}

export type UserExtendRaw = Omit<UserExtend, 'extend_info'> & { extend_info: string }

export interface IClassInfo extends ObjBaseV2 {
  class_key: string;
  class_label: string;
  class_token: string;
  create_by: string;
  create_app_limit: number;
  enable_openapi: 1 | 0;
  ctime: string;
  mtime: string;
}

export interface IUploadCos extends ObjBaseV2 {
  app_name: string;
  app_version: string;
  file_web_path: { pathList: string[] };
  upload_result: {
    finished: boolean,
    totalCount: number,
    uploadedFiles: string[],
    pendingFiles: string[],
    errMsg: string,
  };
  upload_spend_time: number;
  ctime: string;
}


export interface IAllowedAppRaw extends ObjBase {
  update_by: string;
  data: string;
}

export interface IAllowedApp extends Omit<IAllowedAppRaw, 'data'> {
  data: { apps: string[] };
}

export interface IStatRaw extends Omit<ObjBase, 'create_by'> {
  type: string;
  sub_type: string;
  time_label: string;
  /** 123环境值 */
  env_label: string;
  data: string;
}

export interface IStat extends Omit<IStatRaw, 'data'> {
  data: xc.Dict;
}

export interface IStatDistRaw extends Omit<ObjBase, 'create_by'> {
  type: string;
  sub_type: string;
  time_label: string;
  /** 123环境值 */
  env_label: string;
  /** 123环境值-机器名称-workerId */
  dist_env_label: string;
  data: string;
}

export interface IStatDist extends Omit<IStatDistRaw, 'data'> {
  data: xc.Dict;
}

export interface IHMNStat extends Omit<ObjBase, 'create_by'> {
  env_name: string;
  mod_name: string;
  mod_version: string;
  pod_name: string;
  container_name: string;
  container_ip: string;
  img_version: string;
  city: string;
  load_at: string;
  load_mode: string;
  extra: any;
}

export interface IHMNStatLog extends IHMNStat {
  end_reason: string;
  end_at: string;
}
