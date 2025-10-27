import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: t_hmn_stat hel-micro-node 服务端模块运行情况统计
export interface tHMNStatAttributes {
  id?: number;
  env_name?: string;
  mod_name?: string;
  mod_version?: string;
  pod_name?: string;
  container_name?: string;
  container_ip?: string;
  img_version?: string;
  city?: string;
  extra?: string;
  load_at?: string;
  load_mode?: string;
}

type tHMNStatCreationAttributes = Optional<tHMNStatAttributes, 'id'>;

export class HMNStat extends Model<tHMNStatAttributes, tHMNStatCreationAttributes> implements tHMNStatAttributes {
  id?: number;
  env_name?: string;
  mod_name?: string;
  mod_version?: string;
  pod_name?: string;
  container_name?: string;
  container_ip?: string;
  img_version?: string;
  city?: string;
  extra?: string;
  load_at?: string;
  load_mode?: string;
}

export function getAttributes() {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: 'id',
      autoIncrement: true,
    },
    env_name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'env_name',
    },
    mod_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'mod_name',
    },
    mod_version: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'mod_version',
    },
    container_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'container_name',
    },
    container_ip: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'container_ip',
    },
    pod_name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'pod_name',
    },
    img_version: {
      type: DataTypes.STRING(256),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'img_version',
    },
    city: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'city',
    },
    extra: {
      type: DataTypes.STRING(10192),
      allowNull: false,
      defaultValue: '{}',
      comment: '{}',
      field: 'extra',
    },
    load_mode: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'load_mode',
    },
    load_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '',
      field: 'load_at',
    },
  };
}

export default function Factory(sequelize: Sequelize) {
  const attrs = getAttributes();
  HMNStat.init(attrs, {
    sequelize,
    modelName: 'HMNStat',
    tableName: 't_hmn_stat',
    updatedAt: 'update_at',
    createdAt: 'create_at',
  });
  return HMNStat;
}
