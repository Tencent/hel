import { getAdminUsers } from 'at/configs/rainbowConf';
import { ICuteExpressCtx, TController } from 'at/types';
import { getServerEnv, isLocal } from 'at/utils/deploy';
import * as appShare from 'controllers/share/app';
import { allowedAppSrv } from 'services/allowedApp';

function wrapServerEnv(data: xc.Dict) {
  const serverEnv = getServerEnv();
  return { ...serverEnv, data };
}

async function check(ctx: ICuteExpressCtx, checkOwner?: boolean) {
  if (isLocal()) {
    return;
  }
  const { timestamp, nonce, name } = ctx.query;
  appShare.checkCommon(name, nonce, timestamp);
  const appInfo = await ctx.services.app.getAppByName(name);
  if (!appInfo) {
    throw new Error(`app (${name}) not exist`);
  }

  const rtxName = ctx.pipes.getRtxName();
  const adminUsers = getAdminUsers();
  if (checkOwner && !appInfo.owners.includes(rtxName) && !adminUsers.includes(rtxName) && appInfo.create_by !== rtxName) {
    throw new Error(`no permission to modify app (${name})`);
  }
}

/**
 * 将应用从允许外网访问白名单里移除
 */
export const delAllowed: TController = async (ctx) => {
  await check(ctx, true);
  const rtxName = ctx.pipes.getRtxName();
  await allowedAppSrv.delAllowed(ctx.query.name, rtxName);
  return true;
};

/**
 * 将应用加入到允许外网访问的白名单
 */
export const addAllowed: TController = async (ctx) => {
  await check(ctx, true);
  const rtxName = ctx.pipes.getRtxName();
  await allowedAppSrv.addAllowed(ctx.query.name, rtxName);
  return true;
};

/**
 * 是否在白名单中
 */
export const isAllowed: TController = async (ctx) => {
  await check(ctx);
  const result = await allowedAppSrv.isAppAllowed(ctx.query.name);
  return result;
};

/**
 * 刷新各实例缓存数据
 */
export const refresh: TController = async (ctx) => {
  const { timestamp, nonce, user } = ctx.query;
  appShare.checkCommon(user, nonce, timestamp);
  if (!getAdminUsers().includes(user)) {
    throw new Error('not admin');
  }
  const list = await allowedAppSrv.refreshList();
  return list;
};

/**
 * 查看缓存数据
 */
export const getList: TController = (ctx) => {
  const { timestamp, nonce, user } = ctx.query;
  appShare.checkCommon(user, nonce, timestamp);
  const list = allowedAppSrv.getAllowedList();
  return list;
};

/**
 * 查看带服务环境信息的缓存数据
 * 内部调用，不用检查
 */
export const getListWithEnv: TController = async () => {
  const list = allowedAppSrv.getAllowedList();
  return wrapServerEnv(list);
};
