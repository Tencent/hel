/* eslint-disable camelcase */
import { SrcMap } from './domain-inner';

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
