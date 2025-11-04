import { Sequelize } from 'sequelize';
import allowedAppFactory from './tAllowedApp';
import classInfoFactory from './tClassInfo';
import HMNStatFactory from './tHMNStat';
import HMNStatLogFactory from './tHMNStatLog';
import statFactory from './tStat';
import statDistFactory from './tStatDist';
import subAppGlobalFactory from './tSubAppGlobal';
import subAppInfoFactory from './tSubAppInfo';
import subAppVersionFactory from './tSubAppVersion';
import trackFactory from './tTrack';
import uploadCosFactory from './tUploadCosLog';
import userExtendFactory from './tUserExtend';
import userInfoFactory from './tUserInfo'; 

type DBModels = nsdb.DBModels;
type DBConfigItem = nsdb.DBConfigItem;

// src/index.ts 会确保先调用 initModels，才会执行 runApp.ts，
// 所以其他文件拿到的 models 对象是已初始化好的
// eslint-disable-next-line import/no-mutable-exports
export let models: DBModels = {
  subAppInfo: {},
  subAppGlobal: {},
  subAppVersion: {},
  uploadCos: {},
  userExtend: {},
  track: {},
  classInfo: {},
  allowedApp: {},
  stat: {},
  statDist: {},
  HMNStat: {},
  HMNStatLog: {},
  UserInfo:{},
} as unknown as DBModels;

export async function initModels(dbConf: DBConfigItem) {
  const sequelize = new Sequelize(dbConf.database, dbConf.username, dbConf.password, dbConf);

  models = {
    sequelize,
    Sequelize,
    subAppInfo: subAppInfoFactory(sequelize),
    subAppGlobal: subAppGlobalFactory(sequelize),
    subAppVersion: subAppVersionFactory(sequelize),
    uploadCos: uploadCosFactory(sequelize),
    userExtend: userExtendFactory(sequelize),
    track: trackFactory(sequelize),
    classInfo: classInfoFactory(sequelize),
    allowedApp: allowedAppFactory(sequelize),
    stat: statFactory(sequelize),
    statDist: statDistFactory(sequelize),
    HMNStat: HMNStatFactory(sequelize),
    HMNStatLog: HMNStatLogFactory(sequelize),
    UserInfo: userInfoFactory(sequelize),
  };

  Object.values(models).forEach((model: any) => {
    if (model.associate) {
      model.associate();
    }
  });

  try {
    await sequelize.authenticate();
  } catch (error) {
    throw new Error('Unable to connect to the database');
  }
}
