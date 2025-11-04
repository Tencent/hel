import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: t_user_infos
export interface tUserInfoAttribute {
  id?: number;
  en?: string;
  full?: string;
}

type tUserInfoCreationAttributes = Optional<tUserInfoAttribute, 'id'>;

export class UserInfo extends Model<tUserInfoAttribute, tUserInfoCreationAttributes> implements tUserInfoAttribute {
  public id?: number;
  public en?: string;
  public full?: string;


}

export default function Factory(sequelize: Sequelize) {
  UserInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: '自增ID',
        autoIncrement: true,
      },
      en: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: 'hi-bro',
        comment: '英文名',
      },
      full: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: 'hi-bro',
        comment: '全名',
      },
    },
    {
      sequelize,
      modelName: 'UserInfo',
      tableName: 't_user_infos',
      timestamps: false,
    },
  );
  return UserInfo;
}