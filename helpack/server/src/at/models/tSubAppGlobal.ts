import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: tSubAppGlobal
export interface tSubAppGlobalAttribute {
  id?: number;
  name?: string;
  mark_info?: string;
  ctime?: string;
  mtime?: string;
}

type tSubAppGlobalCreationAttributes = Optional<tSubAppGlobalAttribute, 'id'>;

export class SubAppGlobal extends Model<tSubAppGlobalAttribute, tSubAppGlobalCreationAttributes> implements tSubAppGlobalAttribute {
  public id?: number;
  public name?: string;
  public mark_info?: string;
  public ctime?: string;
  public mtime?: string;
}

export default function Factory(sequelize: Sequelize) {
  SubAppGlobal.init(
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
      mark_info: {
        // 用户标注内容不准超过60个字符，最多允许该应用的100版本被公共标记
        type: DataTypes.STRING(10192),
        allowNull: false,
        defaultValue: '',
        comment: '{"markedList":[]}', // {"ver":"","desc":"","userName":""}
        field: 'mark_info',
      },
    },
    {
      sequelize,
      modelName: 'SubAppGlobal',
      tableName: 't_sub_app_global',
      createdAt: 'ctime',
      updatedAt: 'mtime',
    },
  );
  return SubAppGlobal;
}
