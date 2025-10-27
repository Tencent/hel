/*
|--------------------------------------------------------------------------
|
| 适用于 simple 模式的控制器，可访问应用白名单暂时写死，  
| TODO(done): ALLOW_APPS 后续对接七彩石 watch 模式的配置
| TODO: 对接 lru-cache，缓存应用 30 s
|
|--------------------------------------------------------------------------
*/
import { ICuteExpressCtx, TController } from 'at/types';
import * as appPage from 'controllers/appPage';
import * as batchShare from 'controllers/share/batch';
import { assignNameAndVerToQuery } from 'controllers/share/version';
import { allowedAppSrv } from 'services/allowedApp';
import * as appCtrl from './app';

function prepareForSimpleMode(ctx: ICuteExpressCtx) {
  const { query } = ctx;
  const { version = '', ver = '' } = query;
  let { name } = query;

  // 兼容旧版 versionIndex 逻辑，新版 versionIndex 不会再命中此逻辑
  if (!name) {
    // 此处取 ver || version 是为了兼容旧格式
    const verStr = ver || version;
    // 未显式传递 name，用 version 推导
    let strList = version.split('_');
    strList[strList.length - 1] = '';
    strList = strList.filter((item) => !!item);
    name = strList.join('_');
    query.name = name;
    query.version = verStr;
  }

  if (!name) {
    throw new Error('missing app name');
  }

  const allowApps: string[] = allowedAppSrv.getAllowedList();
  if (!allowApps.includes(name)) {
    throw new Error(`visiting app ${name} is not allowed currently`);
  }
  // 清除敏感信息
  ctx.query.clearSensitive = '1';
}

export const getSubAppVersionForSimple: TController = async (ctx: ICuteExpressCtx) => {
  prepareForSimpleMode(ctx);
  const verData = await appCtrl.getSubAppVersion(ctx);
  if (!verData) {
    return ctx.code('404');
  }
  return verData;
};

export const getSubAppAndItsVersionForSimple = async (ctx: ICuteExpressCtx) => {
  prepareForSimpleMode(ctx);
  return appCtrl.getSubAppAndItsVersion(ctx);
};

/** 批量获取的基础接口，其他批量的接口都会依赖到此次接口 */
export const batchGetSubAppAndItsVersionForSimple = async (ctx: ICuteExpressCtx) => {
  const ctxList = batchShare.makeCtxList(ctx);
  const tasks = ctxList.map((ctx) => getSubAppAndItsVersionForSimple(ctx));
  const resultList = await Promise.all(tasks);
  return resultList;
};

export const getMeta = async (ctx: ICuteExpressCtx) => {
  assignNameAndVerToQuery(ctx);
  prepareForSimpleMode(ctx);
  return appCtrl.getSubAppAndItsFullVersion(ctx);
};

export const getHtml = async (ctx: ICuteExpressCtx) => {
  assignNameAndVerToQuery(ctx);
  prepareForSimpleMode(ctx);
  return appPage.loadSubApp(ctx);
};

export const getSubAppAndItsFullVersionForSimple = async (ctx: ICuteExpressCtx) => {
  prepareForSimpleMode(ctx);
  return appCtrl.getSubAppAndItsFullVersion(ctx);
};

export const batchGetSubAppAndItsFullVersionForSimple = async (ctx: ICuteExpressCtx) => {
  ctx.query.content = '1';
  const resultList = await batchGetSubAppAndItsVersionForSimple(ctx);
  return resultList;
};

export const getSubAppVersionJsonpForSimple: TController = async (ctx: ICuteExpressCtx) => {
  try {
    prepareForSimpleMode(ctx);
    const ret = await appCtrl.getSubAppVersion(ctx);
    if (!ret) {
      return ctx.jsonpCode(null, '404');
    }
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const getSubAppAndItsVersionJsonpForSimple = async (ctx: ICuteExpressCtx) => {
  try {
    prepareForSimpleMode(ctx);
    const ret = await appCtrl.getSubAppAndItsVersion(ctx);
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const batchGetSubAppAndItsVersionJsonpForSimple = async (ctx: ICuteExpressCtx) => {
  try {
    const resultList = await batchGetSubAppAndItsVersionForSimple(ctx);
    return ctx.jsonp(resultList);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const batchGetSubAppAndItsFullVersionJsonpForSimple = async (ctx: ICuteExpressCtx) => {
  try {
    ctx.query.content = '1';
    const resultList = await batchGetSubAppAndItsVersionForSimple(ctx);
    return ctx.jsonp(resultList);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const getSubAppAndItsFullVersionJsonpForSimple = async (ctx: ICuteExpressCtx) => {
  try {
    prepareForSimpleMode(ctx);
    const ret = await appCtrl.getSubAppAndItsFullVersion(ctx);
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};
