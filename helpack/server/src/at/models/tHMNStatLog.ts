import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { getAttributes, tHMNStatAttributes } from './tHMNStat';

// table: t_hmn_stat_log hel-micro-node 服务端模块运行情况统计日志
export interface tHMNStatLogAttributes extends tHMNStatAttributes {
  end_reason?: string;
  end_at?: string;
}

type tHMNStatLogCreationAttributes = Optional<tHMNStatLogAttributes, 'id'>;

export class HMNStatLog extends Model<tHMNStatLogAttributes, tHMNStatLogCreationAttributes> implements tHMNStatLogAttributes {
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
  end_reason?: string;
  end_at?: string;
}

export default function Factory(sequelize: Sequelize) {
  const attrs = getAttributes();
  const logAttrs = {
    ...attrs,
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '',
      field: 'end_at',
    },
    end_reason: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: '',
      comment: '',
      field: 'end_reason',
    },
  };
  HMNStatLog.init(logAttrs, {
    sequelize,
    modelName: 'HMNStatLog',
    tableName: 't_hmn_stat_log',
    updatedAt: 'update_at',
    createdAt: 'create_at',
  });
  return HMNStatLog;
}
