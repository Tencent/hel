import { ICuteExpressCtx, TController, TControllerRet } from 'at/types';
import { appCtrl } from 'at/types/ctrl';
import { SubAppInfo, SubAppVersion } from 'at/types/domain';
import { isLocal } from 'at/utils/deploy';
import { asType } from 'at/utils/type';
import { toVersionIndex } from 'controllers/share/version';
import appJson from './app.json';
import appVersion from './appVersion.json';

/**
 * 获取子应用列表(get, post都支持)
 */
export const querySubApps: TController = async (ctx) => {
  return { apps: appJson.data, total: appJson.data.length };
};

/**
 * 获取子应用
 */
export const getSubApp: appCtrl.getSubApp = async (ctx) => {
  const appName = ctx.query.name;
  const appInfo = appJson.data.find((v) => v.name === appName) as unknown as SubAppInfo;
  return appInfo;
};

export const getSubAppToken: TController<any> = async (ctx) => {
  const appName = ctx.query.name;
  // TODO return subApp of appName
  const subApp = {} as unknown as SubAppInfo;
  const rtx = ctx.pipes.getRtxName();
  if (!subApp) {
    throw new Error('应用不存在');
  }
  if (subApp.create_by === rtx || (subApp.owners || []).includes(rtx)) {
    return subApp.token;
  } else {
    throw new Error('无权限查看token');
  }
};

/**
 * 合并 getSubApp getSubAppVersion
 * @param ctx
 * @returns
 */
export const getSubAppAndItsVersion = async (ctx: ICuteExpressCtx) => {
  const app = await getSubApp(ctx);
  if (!app) throw new Error('app not found');
  let targetVer = ctx.query.version || app.online_version;
  const gray_users = app.gray_users || [];
  // 当前应用正在灰度中 & 当前处于灰度名单中
  if (app.is_in_gray && gray_users.includes(ctx.pipes.getRtxName())) {
    targetVer = app.build_version;
  }

  ctx.query.ver = targetVer;
  const version = await getSubAppVersion(ctx);
  return { app, version };
};

/**
 * getSubAppAndItsVersion 的 jsonp 响应格式
 */
export const getSubAppAndItsVersionJsonp = async (ctx: ICuteExpressCtx) => {
  const ret = await getSubAppAndItsVersion(ctx);
  return ctx.jsonp(ret);
};

export const getSubAppAndItsFullVersion = async (ctx: ICuteExpressCtx) => {
  ctx.query.content = '1';
  const ret = await getSubAppAndItsVersion(ctx);
  return ret;
};

/**
 * getSubAppAndItsFullVersion 的 jsonp 响应格式
 */
export const getSubAppAndItsFullVersionJsonp = async (ctx: ICuteExpressCtx) => {
  const ret = await getSubAppAndItsFullVersion(ctx);
  return ctx.jsonp(ret);
};

/**
 * 创建子应用
 */
export const createSubApp = async (ctx: ICuteExpressCtx) => {
  const rtxName = ctx.pipes.getRtxName();
  const subApp = ctx.body;
  subApp.create_by = rtxName;
  subApp.is_test = subApp.is_test ? 1 : 0;
  const res = await ctx.services.app.createSubApp(subApp);
  return res as any;
};

/**
 * 创建子应用版本
 */
export const createSubAppVersion = async (ctx: ICuteExpressCtx) => {
  // 不用实现，老逻辑已不需要走
  return {} as any;
};

/**
 * 更新子应用
 */
export const updateSubApp = async (ctx: ICuteExpressCtx) => {
  return true;
};

/**
 * 获取子应用的版本详情信息
 */
export const getSubAppVersion: TControllerRet<any, any, any, Promise<SubAppVersion | null>> = async (ctx) => {
  const { ver: mayVersionTag, name } = ctx.query;
  const versionIndex = toVersionIndex(name, mayVersionTag);
  const subAppVersion = appVersion.data.find((v) => v.sub_app_version === versionIndex);
  return asType<SubAppVersion>(subAppVersion) || null;
};

export const getSubAppVersionNormal: appCtrl.getSubAppVersion = async (ctx) => {
  try {
    const ret = await getSubAppVersion(ctx);
    if (!ret) {
      return ctx.code('404');
    }
    return ret;
  } catch (err) {
    return ctx.code('404');
  }
};

export const getSubAppVersionJsonp: appCtrl.getSubAppVersion = async (ctx) => {
  const ret = await getSubAppVersion(ctx);
  return ctx.jsonp(ret);
};

export const combine3api: TController = async (ctx) => {
  try {
    const [starAppNames, visitAppNames] = await Promise.all([getUserStarAppNames(ctx), getUserVisitAppNames(ctx)]);
    return { starAppNames, visitAppNames, markedInfo: { markedList: [] } };
  } catch (err) {
    if (!isLocal()) {
      throw err;
    }
    return {
      starAppNames: [],
      visitAppNames: [],
      markedInfo: { markedList: [] },
    };
  }
};

export const getUserStarAppNames: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  return [];
};

export const updateUserStarApp: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  const name = ctx.pipes.getQueryAppName();
  const { star } = ctx.query;
  const markStar = star === '1';

  const app = await ctx.services.app.getAppByName(name);
  if (!app) {
    throw new Error(`app name [${name}] is invalid`);
  }

  const updated = await ctx.services.app.updateUserStarApp(rtxName, name, markStar);
  return updated;
};

export const getUserVisitAppNames: appCtrl.getUserVisitAppNames = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  return [];
};

export const updateUserVisitApp: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  const name = ctx.pipes.getQueryAppName();
  const app = await ctx.services.app.getAppByName(name);
  if (!app) {
    throw new Error(`app name [${name}] is invalid`);
  }

  const updated = await ctx.services.app.updateUserVisitApp(rtxName, name);
  return updated;
};

/**
 * 删除用户的其中一条访问记录
 */
export const delUserVisitApp: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  const name = ctx.pipes.getQueryAppName();
  const app = await ctx.services.app.getAppByName(name);
  if (!app) {
    throw new Error(`app name [${name}] is invalid`);
  }

  const updated = await ctx.services.app.delUserVisitApp(rtxName, name);
  return updated;
};

/**
 * 获取应用全局标记信息
 */
export const getAppGlobalMarkedData: TController = async (ctx) => {
  const { name } = ctx.query;
  const sugAppGlobal = await ctx.dao.subAppGlobal.getOne({ name });
  const defaultMarked = { markedList: [] };

  // 暂未支持可选链编译，所以这样写
  if (sugAppGlobal) {
    return sugAppGlobal.mark_info || defaultMarked;
  }
  return defaultMarked;
};

export const getAppGlobalData: TController = async (ctx) => {
  return { mark_info: { markedList: [] } };
};

export const updateAppGlobalMarkInfo: TController = async (ctx) => {
  return true;
};

export const delAppGlobalMarkInfo: TController = async (ctx) => {
  return true;
};

export const updateAppUserMarkInfo: TController = async (ctx) => {
  return true;
};

export const delAppUserMarkInfo: TController = async (ctx) => {
  return true;
};

/**
 * 待实现的方法
 */
export const updateApp: TController = async (ctx) => {
  // TODO update
  return {} as unknown as SubAppInfo;
};
