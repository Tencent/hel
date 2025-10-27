import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: tAdmin
export interface tClassInfoAttributes {
  id?: number;
  class_key?: string;
  class_label?: string;
  class_token?: string;
  create_app_limit?: number;
  enable_openapi?: number;
  create_by?: string;
  update_by?: string;
}

type tClassInfoCreationAttributes = Optional<tClassInfoAttributes, 'id'>;

export class ClassInfo extends Model<tClassInfoAttributes, tClassInfoCreationAttributes> implements tClassInfoAttributes {
  public id?: number;
  public class_key?: string;
  public class_label?: string;
  public class_token?: string;
  public create_app_limit?: number;
  public enable_openapi?: number;
  public create_by?: string;
  public update_by?: string;
}

export default function Factory(sequelize: Sequelize) {
  ClassInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      class_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: '',
        comment: '组织分类key',
        field: 'class_key',
      },
      class_label: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '组织分类的名称',
        field: 'class_label',
      },
      class_token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '组织分类的授权token，可用于帮助openapi调用时计算签名',
        field: 'class_token',
      },
      create_app_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        comment: 'oepnapi创建应用的上限数量',
        field: 'create_app_limit',
      },
      enable_openapi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否允许openapi调用，需要向管理申请开启此设置后才能使用openapi',
        field: 'enable_openapi',
      },
      create_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'create_by',
      },
      update_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'update_by',
      },
    },
    {
      sequelize,
      modelName: 'ClassInfo',
      tableName: 't_class_info',
      updatedAt: 'ctime',
      createdAt: 'mtime',
    },
  );
  return ClassInfo;
}
