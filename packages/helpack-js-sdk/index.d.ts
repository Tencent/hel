import type { ISubApp, ISubAppVersion } from 'hel-types';

export interface IHelpackRes<T extends any = any> {
  /** http 状态码 */
  status: number;
  statusText: string;
  /** 后台响应结构 */
  reply: {
    /** 后台回传的数据 */
    data: T;
    /** 后台回传的业务状态码，'0' 表示正常，其他表示异常 */
    code: string;
    /** code 不为 '0' 时后台回传的错误信息 */
    msg: string;
  };
}

export interface IOptions {
  /** 操作 sdk 接口的用户企微英文名，会用于赋值创建应用、版本的 create_by 字段 */
  operator: string;
  /**
   * 在helpack管理的新建应用里，选择分类，可以新增分类
   */
  classKey: string;
  /**
   * 可咨询 fancyzhong 拿到
   */
  classToken: string;
  /**
   * default: 'http://locolhost:7777'
   */
  host?: string;
  /**
   * default: false
   * 是否打印日志，也可设置为具体的打印函数实现
   */
  debug?: boolean | ((...args: any[]) => void);
}

export interface IOnProcessData {
  /** 已上传文件 */
  uploadedFiles: string[];
  /** 待上传文件 */
  pendingFiles: string[];
  /** 总文件数 */
  totalCount: number;
  /** 是否已结束 */
  finished: boolean;
}

/**
 * 新增一个应用的构建版本数据并转存储用户的资源到helpack内置cdn
 * 如资源前缀是用户自己的cdn前缀（ 用户已提前将这些资源存储的自己的cdn，此时只是利用hel做额外的备份 ），
 * 则 src_map 里的 webDirPath 会在后台替换为 hel 自己的 webDirPath后再存储，例如
 * https://wedata.cdn.tencent.com/hel/wedata-manage_20230505185940 前缀会被替换为 https://tnfe.gtimg.com/hel/wedata-manage_20230505185940
 * （ 注意 cdn 前缀必须符合 {host}/hel/{app_name}_{timestamp} 的命名规范，否则后台会报错 ）
 * 然后后台会去下载对应的资源再存储到 helpack 内置 cdn
 *
 * 如资源前缀是hel自己的cdn前缀（ 形如：https://tnfe.gtimg.com/hel/wuji-hel-demo_20221220164816/static/js/runtime-main.041a73f6.js ），
 * 则后台直接会报错，提示用户去使用蓝盾插件完成内置cdn的上传动作
 */
export interface IBackupAssetsOptions extends IOptions {
  /** 超时时间设定（秒），默认 60s，设置 <10秒时，会强置为 10s */
  timeout?: number;
  onProcess?: (data: IOnProcessData) => void;
  /** 新增版本时，需要更新的应用部分数据 */
  appUpdateObj?: Partial<ISubApp>;
}

/**
 * 更新应用
 */
export interface ISubAppUpdate {
  /** 应用名 */
  name: string;
  /** 在helpack管理台展示的logo url */
  logo?: string;
  /** 是否允许流水线发布 */
  enable_pipeline?: 1 | 0;
  /** 线上版本 */
  online_version?: string;
  /** 灰度版本 */
  build_version?: string;
  /** 灰度用户名单 */
  gray_users?: string[];
  /** 负责人名单 */
  owners?: string[];
  /** 是否置顶应用 */
  is_top?: 1 | 0;
  /** default: 1, 是否正式应用 */
  is_test?: ISubApp['is_test'];
  /** 应用的分类 key */
  class_key?: string;
  /** 应用描述 */
  desc?: string;
}

/**
 * 更新应用
 */
export interface ISubAppCreate extends ISubAppUpdate {
  /** 应用组名，一个组名可以对多个应用名，通常用于表示同一个项目的多个分支的代码 */
  app_group_name: string;
}

/**
 * 新增一个应用的构建版本数据
 */
export type IVersionCreate = Omit<ISubAppVersion, 'create_by' | 'create_at' | 'update_at' | 'sub_app_id' | 'api_host'>;

/**
 * 创建一个新的应用
 */
export function createSubApp(toCreate: ISubAppCreate, options: IOptions): IHelpackRes;

/**
 * 更新应用
 */
export function updateSubApp(toUpdate: ISubAppUpdate, options: IOptions): IHelpackRes;

/**
 * 新增版本，版本数据可由 hel-dev-utils 包生成
 */
export function addVersion(toCreate: IVersionCreate, options: IOptions): IHelpackRes;

/**
 * 新增版本，并转存用户自己的cdn资源到helpack内置的cdn服务，版本数据可由 hel-dev-utils 包生成
 */
export function addVersionAndBackupAssets(toCreate: IVersionCreate, options: IBackupAssetsOptions): IHelpackRes<IOnProcessData>;

/**
 * 获取应用
 */
export function getSubApp(name: string, options?: { host?: string }): IHelpackRes<ISubApp>;

/**
 * 获取指定版本，options.name 表示应用名
 * ```ts
 * // demo
 * await getVersion('someVerId', { name: 'someApp', classToken: 'xx', operator: 'yy' });
 * ```
 */
export function getVersion(
  verId: string,
  options: { name: string; classToken: string; operator: string; host?: string },
): IHelpackRes<ISubAppVersion>;

/**
 * 获取指定版本，page 默认为 0 表示第一页，size 默认为 100（超过100会报错）
 * ```ts
 * // demo
 * await getVersionList('someApp', { classToken: 'xx', operator: 'yy' });
 * ```
 */
export function getVersionList(
  name: string,
  options: { classToken: string; operator: string; host?: string; page?: number; size?: number },
): IHelpackRes<ISubAppVersion[]>;
