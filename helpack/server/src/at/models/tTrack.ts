import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: t_track
export interface tTrackAttribute {
  id?: number;
  schema_id?: string;
  update_json?: string;
  from?: string;
  operator?: string;
  ctime?: string;
  mtime?: string;
}

type tTrackCreationAttributes = Optional<tTrackAttribute, 'id'>;

export class Track extends Model<tTrackAttribute, tTrackCreationAttributes> implements tTrackAttribute {
  public id?: number;
  public schema_id?: string;
  public update_json?: string;
  public from?: string;
  public operator?: string;
  public ctime?: string;
  public mtime?: string;
}

export default function Factory(sequelize: Sequelize) {
  Track.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      schema_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'schema_id',
      },
      update_json: {
        type: DataTypes.STRING(5096),
        allowNull: false,
        defaultValue: '',
        comment: '{}',
        field: 'update_json',
      },
      from: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'from',
      },
      operator: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'operator',
      },
    },
    {
      sequelize,
      modelName: 'Track',
      tableName: 't_track',
      createdAt: 'ctime',
      updatedAt: 'mtime',
    },
  );
  return Track;
}
