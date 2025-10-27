import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: t_stat_dist
export interface tStatDistAttributes {
  id?: number;
  type?: string;
  sub_type?: string;
  time_label?: string;
  env_label?: string;
  dist_env_label?: string;
  data?: string;
}

type tStatCreationAttributes = Optional<tStatDistAttributes, 'id'>;

export class StatDist extends Model<tStatDistAttributes, tStatCreationAttributes> implements tStatDistAttributes {
  id?: number;
  type?: string;
  sub_type?: string;
  time_label?: string;
  env_label?: string;
  dist_env_label?: string;
  data?: string;
}

export default function Factory(sequelize: Sequelize) {
  StatDist.init(
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
      type: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'type',
      },
      sub_type: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'sub_type',
      },
      time_label: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'time_label',
      },
      env_label: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'env_label',
      },
      dist_env_label: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'dist_env_label',
      },
    },
    {
      sequelize,
      modelName: 'StatDist',
      tableName: 't_stat_dist',
      updatedAt: 'update_at',
      createdAt: 'create_at',
    },
  );
  return StatDist;
}
