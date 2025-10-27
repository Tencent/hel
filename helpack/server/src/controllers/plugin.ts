import * as rainbowConf from 'at/configs/rainbowConf';
import { models } from 'at/models';
import type { ICuteExpressCtx, TController } from 'at/types';
import { ISubAppUpdate } from 'at/types/domain';
import { checkTimestamp } from 'at/utils/time-check';
import { checkAppName } from 'controllers/share/app';
import { lockLogic } from 'controllers/share/lock';
import { checkQueryNonce } from 'controllers/share/reqGuard';
import { checkVersionIndex, getVersionTag } from 'controllers/share/version';
import { signStrCommon } from 'services/app';
import { getClassInfo } from 'services/classInfo';
import { getTcosParams } from 'services/share/tcosParams';

const { getSignSecStr } = rainbowConf;

function checkAddAppVersionNonce(ctx: ICuteExpressCtx) {
  // 老版本检测逻辑，为了旧版本 sdk 能够正常工作，此处不能删除
  if (!ctx.query.name) {
    const { timestamp, nonce } = ctx.query;
    checkTimestamp(timestamp);
    const signStr = ctx.services.app.signAppVersionForPlugin(ctx.body, timestamp);
    if (nonce !== signStr) {
      throw new Error('nonce invalid');
    }
    return;
  }

  // 命中新版检查逻辑
  checkQueryNonce(ctx.query);
}

function checkUpdateAppNonce(ctx: ICuteExpressCtx) {
  // 老版本检测逻辑，为了旧版本 sdk 能够正常工作，此处不能删除
  if (!ctx.query.name) {
    const { timestamp, nonce } = ctx.query;
    checkTimestamp(timestamp);

    const signStr = ctx.services.app.signUpdateAppForPlugin(ctx.body, timestamp);
    if (nonce !== signStr) {
      throw new Error('nonce invalid');
    }
    return;
  }

  // 命中新版检查逻辑
  checkQueryNonce(ctx.query);
}

export const getCommonSignSec: TController = async (ctx) => {
  checkQueryNonce(ctx.query, true);
  return { sec: getSignSecStr() };
};

export const getIsVersionExist: TController = async (ctx) => {
  checkQueryNonce(ctx.query);
  const subApp = await ctx.services.appVersion.getAppVersion(ctx.query.name);
  return !!subApp;
};

export const getAppByName: TController = async (ctx) => {
  checkQueryNonce(ctx.query, true);
  const { name: appName } = ctx.query;
  const subApp = await ctx.services.app.getAppByName(appName, { shouldHideToken: false });
  return subApp;
};

export const getAppByNameAndClass: TController = async (ctx) => {
  checkQueryNonce(ctx.query);
  const { name: appName, timestamp } = ctx.query;
  const { classKey, classToken } = ctx.body;
  const subApp = await ctx.services.app.getAppByName(appName, { shouldHideToken: false });
  if (!subApp) {
    throw new Error(`app ${appName} not found`);
  }
  if (subApp.class_key !== classKey) {
    throw new Error(`app ${appName} not belong to ${classKey}`);
  }

  const info = await getClassInfo(classKey);
  if (!info) {
    throw new Error(`class info ${classKey} not found`);
  }
  const signedToken = signStrCommon(info.class_token, timestamp);
  if (signedToken !== classToken) {
    throw new Error(`class info token mismatch`);
  }

  return subApp;
};

export const getCos: TController = async (ctx) => {
  checkQueryNonce(ctx.query);
  await lockLogic('getCos', ctx.query.appName);
  const cosParams = getTcosParams();
  return { cosParams };
};

export const updateApp: TController = async (ctx) => {
  checkUpdateAppNonce(ctx);
  const toUpdate = ctx.body as ISubAppUpdate;
  const existingApp = await ctx.services.app.getAppByName(toUpdate.name);
  if (!existingApp) {
    throw new Error(`更新${toUpdate.name}无效`);
  }

  const res = await ctx.services.app.updateApp(toUpdate, ctx.pipes.getRtxName() || 'landun_pipeline');
  return res;
};

export const addAppVersion: TController = async (ctx) => {
  checkAddAppVersionNonce(ctx);
  const toAdd = ctx.body;
  const { sub_app_name: appName, sub_app_version: versionIndex = '', version_tag: versionTag = '' } = toAdd;
  checkAppName(appName);
  checkVersionIndex(appName, versionIndex);
  if (!versionTag) {
    // 兼容老版本插件
    toAdd.version_tag = getVersionTag(versionIndex);
  } else if (!versionIndex.endsWith(versionTag)) {
    throw new Error(`versionIndex ${versionIndex} does not ends with versionTag ${versionTag}!`);
  }

  const res = await ctx.services.appVersion.addAppVersion(toAdd);
  return res;
};

export const addCosUploadLog: TController = async (ctx) => {
  const res = await models.uploadCos.create(ctx.body);
  return res;
};
