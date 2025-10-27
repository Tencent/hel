import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: tAdmin
export interface tSubAppVersionAttribute {
  id?: number;
  sub_app_id?: string;
  sub_app_name?: string;
  sub_app_version?: string;
  version_tag?: string;
  src_map?: string;
  html_content?: string;
  create_by?: string;
  desc?: string;
  api_host?: string;
  project_name?: string;
  pipeline_id?: string;
  build_id?: string;
  git_branch?: string;
  git_hashes?: string;
  git_repo_url?: string;
  plugin_ver?: string;
  ext?: string;
  npm_version?: string;
}

type ttSubAppVersionAttributeCreationAttributes = Optional<tSubAppVersionAttribute, 'id'>;

export class SubAppVersion
  extends Model<tSubAppVersionAttribute, ttSubAppVersionAttributeCreationAttributes>
  implements tSubAppVersionAttribute
{
  public id?: number;
  public sub_app_id?: string;
  public sub_app_name?: string;
  public sub_app_version?: string;
  public version_tag?: string;
  public src_map?: string;
  public html_content?: string;
  public create_by?: string;
  public desc?: string;
  public api_host?: string;
  public project_name?: string;
  public pipeline_id?: string;
  public build_id?: string;
  public git_branch?: string;
  public git_detail?: string;
  public git_repo_url?: string;
  public plugin_ver?: string;
  public ext?: string;
  public npm_version?: string;
}

export default function Factory(sequelize: Sequelize) {
  SubAppVersion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      sub_app_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'sub_app_id',
      },
      sub_app_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'sub_app_name',
      },
      sub_app_version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'sub_app_version',
      },
      version_tag: {
        type: DataTypes.STRING(120),
        allowNull: false,
        defaultValue: '',
        comment: 'version_tag 即 sub_app_version 中的版本号字符串',
        field: 'version_tag',
      },
      src_map: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'src_map',
      },
      html_content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'html_content',
      },
      create_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'create_by',
      },
      desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'desc',
      },
      api_host: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'api_host',
      },
      project_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'project_name',
      },
      pipeline_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'pipeline_id',
      },
      build_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'build_id',
      },
      git_branch: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'git_branch',
      },
      git_hashes: {
        type: DataTypes.STRING(8192),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'git_hashes',
      },
      git_repo_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'git_repo_url',
      },
      ext: {
        type: DataTypes.STRING(8192),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'ext',
      },
      plugin_ver: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'plugin_ver',
      },
      npm_version: {
        type: DataTypes.STRING(32),
        allowNull: true,
        defaultValue: '',
        comment: '',
        field: 'npm_version',
      },
    },
    {
      sequelize,
      modelName: 'SubAppVersion',
      tableName: 't_sub_app_version',
      updatedAt: 'update_at',
      createdAt: 'create_at',
    },
  );
  return SubAppVersion;
}
