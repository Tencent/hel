import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: tAdmin
export interface tSubAppInfoAttribute {
  id?: number;
  name?: string;
  app_group_name?: string;
  name_in_sec?: string;
  logo?: string;
  splash_screen?: string;
  is_test?: number;
  enable_build_to_online?: number;
  enable_pipeline?: number;
  token?: string;
  cnname?: string;
  desc?: string;
  class_name?: string;
  class_key?: string;
  create_by?: string;
  online_version?: string;
  pre_version?: string;
  test_version?: string;
  build_version?: string;
  npm_version?: string;
  enable_display?: number;
  api_host?: string;
  render_mode?: string;
  extract_mode?: string;
  proj_ver?: string;
  ui_framework?: string;
  host_map?: string;
  git_repo_url?: string;
  is_rich?: number;
  is_top?: number;
  is_back_render?: number;
  additional_scripts?: string;
  additional_body_scripts?: string;
  is_local_render?: number;
  render_app_host?: string;
  enable_gray?: number;
  is_in_gray?: number;
  owners?: string;
  gray_users?: string;
  is_xc?: number;
  platform?: string;
}

type ttSubAppInfoAttributeCreationAttributes = Optional<tSubAppInfoAttribute, 'id'>;

export class SubAppInfo extends Model<tSubAppInfoAttribute, ttSubAppInfoAttributeCreationAttributes> implements tSubAppInfoAttribute {
  public id?: number;
  public name?: string;
  public app_group_name?: string;
  public name_in_sec?: string;
  public logo?: string;
  public splash_screen?: string;
  public is_test?: number;
  public enable_build_to_online?: number;
  public enable_pipeline?: number;
  public token?: string;
  public cnname?: string;
  public desc?: string;
  public class_name?: string;
  public class_key?: string;
  public create_by?: string;
  public online_version: string;
  public pre_version?: string;
  public test_version?: string;
  public build_version?: string;
  public npm_version?: string;
  public enable_display?: number;
  public api_host?: string;
  public render_mode?: string;
  public extract_mode?: string;
  public proj_ver?: string;
  public ui_framework?: string;
  public host_map?: string;
  public git_repo_url?: string;
  public is_rich?: number;
  public is_top?: number;
  public is_back_render?: number;
  public additional_scripts?: string;
  public additional_body_scripts?: string;
  public is_local_render?: number;
  public render_app_host?: string;
  public enable_gray?: number;
  public is_in_gray?: number;
  public owners?: string;
  public gray_users?: string;
  public is_xc?: number;
  public platform?: string;
}

export default function Factory(sequelize: Sequelize) {
  SubAppInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'name',
      },
      app_group_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'app_group_name',
      },
      name_in_sec: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'name_in_sec',
      },
      logo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'logo',
      },
      splash_screen: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'splash_screen',
      },
      is_test: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'is_test',
      },
      enable_build_to_online: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'enable_build_to_online',
      },
      enable_pipeline: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'enable_pipeline',
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'token',
      },
      cnname: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'cnname',
      },
      desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'desc',
      },
      class_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'class_name',
      },
      class_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'class_key',
      },
      create_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'create_by',
      },
      online_version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'online_version',
      },
      pre_version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'pre_version',
      },
      test_version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'test_version',
      },
      build_version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'build_version',
      },
      npm_version: {
        type: DataTypes.STRING(32),
        allowNull: true,
        defaultValue: '',
        comment: '',
        field: 'npm_version',
      },
      enable_display: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '',
        field: 'enable_display',
      },
      api_host: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'api_host',
      },
      render_mode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'render_mode',
      },
      extract_mode: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: 'all',
        comment: '',
        field: 'extract_mode',
      },
      proj_ver: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        defaultValue: '{"map":{},utime:0}',
        comment: '',
        field: 'proj_ver',
      },
      ui_framework: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'ui_framework',
      },
      host_map: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'host_map',
      },
      git_repo_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'git_repo_url',
      },
      is_rich: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'is_rich',
      },
      is_top: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'is_top',
      },
      is_back_render: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'is_back_render',
      },
      additional_scripts: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'additional_scripts',
      },
      additional_body_scripts: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'additional_body_scripts',
      },
      is_local_render: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'is_local_render',
      },
      render_app_host: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'render_app_host',
      },
      enable_gray: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'enable_gray',
      },
      is_in_gray: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '',
        field: 'is_in_gray',
      },
      owners: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'owners',
      },
      gray_users: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'gray_users',
      },
      is_xc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '',
        field: 'is_xc',
      },
      platform: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'hel',
        comment: '',
        field: 'platform',
      },
    },
    {
      sequelize,
      modelName: 'SubAppInfo',
      tableName: 't_sub_app_infos',
      updatedAt: 'update_at',
      createdAt: 'create_at',
    },
  );
  return SubAppInfo;
}
