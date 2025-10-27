import { ASSET_WEB_DIR } from 'at/configs/path';
import { TController } from 'at/types';
import { ISubAppUpdate } from 'at/types/domain';
import * as appCtrl from 'controllers/app';
import * as appVerCtrl from 'controllers/appVersion';
import { checkAppName } from 'controllers/share/app';
import { checkClassData, checkUserName } from 'controllers/share/check';
import { lockLogic } from 'controllers/share/lock';
import { checkVersionIndex } from 'controllers/share/version';
import { ISubApp, ISubAppVersion } from 'hel-types';
import { has } from 'lodash';
import { transferWebFiles } from 'services/fileTransfer';

const inner = {
  ensureVersion(app: ISubApp, version: ISubAppVersion) {
    version.sub_app_id = String(app.id);
    Reflect.deleteProperty(version, 'create_at');
    Reflect.deleteProperty(version, 'update_at');
  },
};

/**
 * 新增版本
 */
export const addVersion: TController<any, any, { version: ISubAppVersion; classKey: string }> = async (ctx) => {
  const { query, body, services: srv } = ctx;
  const { timestamp, nonce } = query;
  const { version } = body;
  if (!version) {
    throw new Error('miss version data');
  }

  const { sub_app_name: appName, create_by, sub_app_version: versionIndex = '' } = version;
  checkAppName(appName);
  checkUserName(create_by);
  checkVersionIndex(appName, versionIndex);
  await lockLogic('addVersion', appName);

  const app = await srv.app.getAppByName(appName);
  if (!app) {
    throw new Error(`app [${appName}] not exist`);
  }
  if (!app.enable_pipeline) {
    throw new Error(`app [${appName}] enable_pipeline is false currently, please open it on helpack before adding new version data!`);
  }

  const classInfo = await checkClassData(app.class_key);
  const signStr = srv.app.signAppVersionForSdk(version, timestamp, classInfo.class_token);
  if (nonce !== signStr) {
    throw new Error('nonce invalid');
  }

  inner.ensureVersion(app, version);
  const verAdded = await srv.appVersion.addAppVersion(version);

  // 添加版本后更新 app.build_version
  const toUpdateApp: ISubAppUpdate = { name: appName, build_version: versionIndex };
  if (!app.enable_gray) {
    // 未开启灰度功能的话，线上版本也更新
    toUpdateApp.online_version = versionIndex;
  }
  await srv.app.updateApp(toUpdateApp);

  return verAdded;
};

/** 查询版本的资源备份进度 */
export const queryBackupAssetsProgress: TController<any, any, { version: ISubAppVersion; classKey: string }> = async (ctx) => {
  const { query, body, services: srv, dao } = ctx;
  const { timestamp, nonce, dbId } = query;
  const { version } = body;
  const { sub_app_name: appName, create_by, sub_app_version } = version;
  checkUserName(create_by);
  await lockLogic('queryBackupAssetsProgress', sub_app_version);

  const app = await srv.app.getAppByName(appName);
  if (!app) {
    throw new Error(`app [${appName}] not exist`);
  }
  const classInfo = await checkClassData(app.class_key);

  const signStr = srv.app.signAppVersionForSdk(version, timestamp, classInfo.class_token);
  if (nonce !== signStr) {
    throw new Error('nonce invalid');
  }

  const ver = await dao.subAppVersion.getOne({ id: parseInt(dbId, 10) });
  if (!ver) {
    throw new Error(`ver ${sub_app_version} not found`);
  }

  const cosLog = await dao.uploadCos.getOne({ app_version: sub_app_version });
  if (!cosLog) {
    // 首次调用进度查询，触发资源上传
    const { chunkJsSrcList, chunkCssSrcList, webDirPath } = ver.src_map;
    const pathList = chunkJsSrcList.concat(chunkCssSrcList);
    if (!pathList.every((item) => item.startsWith(webDirPath))) {
      throw new Error(`validate error: found asset url not start with ${webDirPath}`);
    }
    if (pathList.some((item) => item.startsWith(ASSET_WEB_DIR))) {
      throw new Error(`validate error: found asset url start with ${ASSET_WEB_DIR}`);
    }

    const uploadedFiles: string[] = [];
    const pendingFiles = pathList.slice();
    const totalCount = pathList.length;

    const { objJson } = await dao.uploadCos.add({
      app_name: appName,
      app_version: sub_app_version,
      file_web_path: {
        pathList,
      },
      upload_result: {
        totalCount,
        finished: false,
        uploadedFiles,
        pendingFiles,
        errMsg: '',
      },
      upload_spend_time: 0,
    });

    const { update } = dao.uploadCos;
    const resultCommon = { uploadedFiles, pendingFiles, totalCount, errMsg: '' };
    const id = objJson.id;
    try {
      const start = Date.now();
      for (const path of pathList) {
        // 下载资源上传到 helpack 内置cdn
        await transferWebFiles(webDirPath, [path]);
        pendingFiles.splice(0, 1);
        uploadedFiles.push(path);
        await update({ id, upload_result: { ...resultCommon, finished: false } });
      }

      await update({ id, upload_result: { ...resultCommon, finished: true }, upload_spend_time: Date.now() - start });
    } catch (err) {
      const errMsg = err.message;
      await update({ id, upload_result: { ...resultCommon, finished: false, errMsg } });
      throw new Error(errMsg);
    }
  } else {
    // 返回上传进度
    return cosLog.upload_result;
  }
};

/** 通过 sdk 获得应用版本 */
export const getVersion: TController = async (ctx) => {
  ctx.midData.forSdk = true;
  const ret = await appCtrl.getSubAppVersion(ctx);
  return ret;
};

/** 通过 sdk 获得应用版本列表 */
export const getVersionList: TController = async (ctx) => {
  ctx.midData.forSdk = true;
  const ret = await appVerCtrl.getSubAppVersionListByName(ctx);
  return ret;
};

/** 通过 sdk 创建应用 */
export const createSubApp: TController<any, any, any> = async (ctx) => {
  ctx.midData.forSdk = true;
  if (ctx.body.token) {
    throw new Error('token should not be supplied, helpack will generate one automatically');
  }
  const ret = await appCtrl.createSubApp(ctx);
  return ret;
};

/** 通过 sdk 更新应用 */
export const updateSubApp: TController<any, any, any> = async (ctx) => {
  ctx.midData.forSdk = true;
  const toUpdate = ctx.body;
  const disableUpdateKeys = ['app_group_name', 'token', 'enable_pipeline'];
  disableUpdateKeys.forEach((key) => {
    if (has(toUpdate, key)) {
      throw new Error(`${key} should not be supplied when call updateSubApp for sdk`);
    }
  });
  const ret = await appCtrl.updateSubApp(ctx);
  return ret;
};

/** 通过 sdk 获得应用 */
export const getSubApp: TController<any, any, { version: ISubAppVersion; classKey: string }> = async (ctx) => {
  ctx.midData.forSdk = true;
  const ret = await appCtrl.getSubApp(ctx);
  return ret;
};
