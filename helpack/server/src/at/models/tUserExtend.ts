import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: tUserExtend
export interface tUserExtendAttribute {
  id?: number;
  rtx_name?: string;
  extend_info?: string;
  star_info?: string;
  visit_info?: string;
  mark_info?: string;
  ctime?: string;
  mtime?: string;
}

type tUserExtendCreationAttributes = Optional<tUserExtendAttribute, 'id'>;

export class UserExtend extends Model<tUserExtendAttribute, tUserExtendCreationAttributes> implements tUserExtendAttribute {
  public id?: number;
  public rtx_name?: string;
  public extend_info?: string;
  public star_info?: string;
  public visit_info?: string;
  public mark_info?: string;
  public ctime?: string;
  public mtime?: string;
}

export default function Factory(sequelize: Sequelize) {
  UserExtend.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      rtx_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'rtx_name',
      },
      extend_info: {
        type: DataTypes.STRING(5096),
        allowNull: false,
        defaultValue: '',
        comment: '{"createAppLimit":10}',
        field: 'extend_info',
      },
      star_info: {
        type: DataTypes.STRING(5096),
        allowNull: false,
        defaultValue: '',
        comment: '{"appNames":[]}',
        field: 'star_info',
      },
      visit_info: {
        type: DataTypes.STRING(5096),
        allowNull: false,
        defaultValue: '',
        comment: '{"appNames":[]}',
        field: 'visit_info',
      },
      mark_info: {
        // 用户对多个app标记的内容存储于此处
        // 用户标注内容不准超过60个字符，最多允许用户标记 60 个版本
        type: DataTypes.STRING(6120),
        allowNull: false,
        defaultValue: '',
        comment: '{"markedList":[]}', // {"name":"","ver":"","desc":""}
        field: 'mark_info',
      },
    },
    {
      sequelize,
      modelName: 'UserExtend',
      tableName: 't_user_extend',
      createdAt: 'ctime',
      updatedAt: 'mtime',
    },
  );
  return UserExtend;
}
