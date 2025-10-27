import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: t_allowed_app
export interface tAllowedAppAttributes {
  id?: number;
  data?: string;
  create_by?: string;
  update_by?: string;
}

type tAllowedAppCreationAttributes = Optional<tAllowedAppAttributes, 'id'>;

export class AllowedApp extends Model<tAllowedAppAttributes, tAllowedAppCreationAttributes> implements tAllowedAppAttributes {
  public id?: number;
  public data?: string;
  public create_by?: string;
  public update_by?: string;
}

export default function Factory(sequelize: Sequelize) {
  AllowedApp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      data: {
        type: DataTypes.STRING(2048000),
        allowNull: false,
        defaultValue: '',
        comment: '{"apps":[]}',
        field: 'data',
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
      modelName: 'AllowedApp',
      tableName: 't_allowed_app',
      updatedAt: 'update_at',
      createdAt: 'create_at',
    },
  );
  return AllowedApp;
}
