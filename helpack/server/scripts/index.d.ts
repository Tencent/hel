import { ISubAppVersion, ISubApp } from 'hel-types';

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
  }
}

export interface IOptions {
  /** 操作 sdk 接口的用户企微英文名，会用于赋值创建应用、版本的 create_by 字段 */
  operator: string;
  classKey: string;
  classToken: string;
  /**
   * 接口调用的域名
   */
  host?: string;
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
  owners?: string[],
  /** 是否置顶应用 */
  is_top?: 1 | 0,
  /** default: 1, 是否正式应用 */
  is_test?: ISubApp['is_test'],
  /** 应用的分类 key */
  class_key?: string,
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
 * 新增版本
 */
export function addVersion(toUpdate: IVersionCreate, options: IOptions): IHelpackRes;

/**
 * 新增版本
 */
export function getSubApp(name: string, options?: { host?: string }): IHelpackRes<ISubApp>;
