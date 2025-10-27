import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// table: tAdmin
export interface tUploadCosAttribute {
  id?: number;
  app_name?: string;
  app_version?: string;
  file_web_path?: string;
  upload_result?: string;
  upload_spend_time?: string;
}

type ttUploadCosAttributeCreationAttributes = Optional<tUploadCosAttribute, 'id'>;

export class UploadCos extends Model<tUploadCosAttribute, ttUploadCosAttributeCreationAttributes> implements tUploadCosAttribute {
  public id?: number;
  public app_name?: string;
  public app_version?: string;
  public file_web_path?: string;
  public upload_result?: string;
  public upload_spend_time?: string;
}

export default function Factory(sequelize: Sequelize) {
  UploadCos.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: 'id',
        autoIncrement: true,
      },
      app_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'app_name',
      },
      app_version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'app_version',
      },
      file_web_path: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'file_web_path',
      },
      upload_result: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'upload_result',
      },
      upload_spend_time: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '',
        field: 'upload_spend_time',
      },
    },
    {
      sequelize,
      modelName: 'UploadCos',
      tableName: 't_upload_cos_log',
      createdAt: 'ctime',
      updatedAt: false,
    },
  );
  return UploadCos;
}
