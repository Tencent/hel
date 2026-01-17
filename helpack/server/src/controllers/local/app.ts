import biz from 'at/configs/biz';
import { ICuteExpressCtx, TController, TControllerRet } from 'at/types';
import { appCtrl } from 'at/types/ctrl';
import { SubAppInfo, SubAppVersion } from 'at/types/domain';
import { isLocal } from 'at/utils/deploy';
import { asType } from 'at/utils/type';
import { assignNameAndVerToQuery, toVersionIndex } from 'controllers/share/version';
import { notifySDKMetaChanged } from 'services/hel-micro-socket';
import appJson from './app.json';
import appVersion from './appVersion.json';

// 本地环境的内存缓存：存储更新后的应用信息
const localAppCache = new Map<string, SubAppInfo>();

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

  // 优先从内存缓存读取（可能有更新的数据）
  if (localAppCache.has(appName)) {
    return localAppCache.get(appName)!;
  }

  // 否则从静态 JSON 文件读取
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
  const name = ctx.query.name || '';
  if (!app) throw new Error(`app ${name} not found`);
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
  const rtxName = ctx.pipes.getRtxName();
  const toUpdate = ctx.body;

  // 获取当前应用信息
  const app = await getSubApp({ ...ctx, query: { ...ctx.query, name: toUpdate.name } });
  if (!app) {
    throw new Error(`app [${toUpdate.name}] not found`);
  }

  // 处理 proj_ver 更新时间
  if (toUpdate.proj_ver) {
    if (toUpdate.proj_ver.utime !== app.proj_ver.utime) {
      throw new Error(`更新【项目与版本】无效，该数据已被另一个人更新，请刷新后重新调整后再提交`);
    } else {
      toUpdate.proj_ver.utime = Date.now();
    }
  }

  // // 检查权限：验证当前用户是否为创建者或所有者之一
  // let owners = app.owners || [];
  // owners = pushIfNotExist(owners, app.create_by);
  // if (!owners.includes(rtxName)) {
  //   throw new Error(`${rtxName}无权限更新此应用，请联系${owners.join(',')}`);
  // }

  // 本地环境：模拟数据更新 + 通知 socket 客户端
  console.log('[Local Mode] updateSubApp:', {
    appName: toUpdate.name,
    operator: rtxName,
    updates: Object.keys(toUpdate),
  });

  // 合并更新后的应用信息
  const updatedApp = Object.assign(app, toUpdate);

  // 更新到内存缓存中（这样客户端重新请求时能拿到新数据）
  localAppCache.set(toUpdate.name, updatedApp as SubAppInfo);
  console.log('[Local Mode] App cache updated:', toUpdate.name);

  console.log('[Local Mode] updatedApp:', updatedApp);
  console.log('[Local Mode] vision:', toUpdate);
  // 通过 socket 通知连接的客户端应用信息已变更
  try {
    const data = { modName: toUpdate.name, channel: biz.CHANNEL_APP_INFO_CHANGED };
    notifySDKMetaChanged(toUpdate.name, data);
    console.log('[Local Mode] Socket notification sent:', data);
  } catch (err) {
    // 本地环境如果 socket 未初始化，不中断流程
    console.warn('[Local Mode] Socket notification failed:', err.message);
  }

  // 返回更新后的应用信息
  return updatedApp;
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

export const getMeta: TController = async (ctx) => {
  assignNameAndVerToQuery(ctx);
  const meta = await getSubAppAndItsVersion(ctx);
  return meta;
};
