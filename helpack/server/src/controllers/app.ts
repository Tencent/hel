import { ConcurrencyGuard } from '@tmicro/f-guard';
import { AS } from 'at/configs/biz';
import * as subAppDao from 'at/dao/subApp';
import * as versionDao from 'at/dao/subAppVersion';
import { ICuteExpressCtx, TController, TControllerRet } from 'at/types';
import { ISubAppUpdate, SubAppVersion } from 'at/types/domain';
import { pushIfNotExist } from 'at/utils/array';
import { isLocal } from 'at/utils/deploy';
import { getByteLength } from 'at/utils/str';
import { checkTimestamp } from 'at/utils/time-check';
import * as appPage from 'controllers/appPage';
import * as appShare from 'controllers/share/app';
import * as batchShare from 'controllers/share/batch';
import { checkClassData, checkUserName } from 'controllers/share/check';
import { lockLogic } from 'controllers/share/lock';
import { assignNameAndVerToQuery, toVersionIndex } from 'controllers/share/version';
import { ISubApp } from 'hel-types';
import LRU from 'lru-cache';
import * as appSrv from 'services/app';
import { userMarkInfoSchema } from 'validators/app';

const guard = new ConcurrencyGuard();
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
const BRANCH_REQ_COUNT_CACHE = new LRU<string, number>({ max: 10000, ttl: ONE_YEAR_MS });
const BRANCH_REQUESTING = new LRU<string, number>({ max: 200000, ttl: 3000 });

const inner = {
  async checkGroupNameExist(appGroupName: string) {
    const appList = await subAppDao.get({ app_group_name: appGroupName });
    if (appList.length === 0) {
      throw new Error(`appGroupName [${appGroupName}] no apps`);
    }
  },
  checkAppValues(subApp: ISubApp) {
    appShare.checkAppName(subApp.name, 'name');
    appShare.checkAppName(subApp.app_group_name, 'app_group_name');
    if (getByteLength(subApp.desc || '') > 128) {
      throw new Error(`desc byte length must less than 128`);
    }
  },
  clearAppSensitive(subApp: ISubApp) {
    const clearedApp = { ...subApp, render_app_host: '', git_repo_url: '', create_by: '', owners: [], gray_users: [] };
    return clearedApp;
  },
  getForcedGrayVerId(options: xc.Dict) {
    const { hasProjVerMap, projGrayVer, appGrayVer, projOnlineVer, appOnlineVer } = options;
    if (hasProjVerMap) {
      // 优先返回项目灰度版本，再返回应用灰度版本， 都没有的话最后返回项目线上版本
      // 即： p1 项目灰度版本 --> p2 应用灰度版本 --> p3 项目线上版本
      return projGrayVer || appGrayVer || projOnlineVer;
    }
    return appGrayVer || appOnlineVer;
  },
  getUserGrayVerId(options: xc.Dict) {
    const { needReadGray, projGrayVer, appGrayVer, projOnlineVer } = options;
    if (needReadGray) {
      // 同 getForcedGrayVerId 里的 p1 p2 p3 灰度返回策略
      return projGrayVer || appGrayVer || projOnlineVer;
    }
    return projOnlineVer;
  },
  getSuitableVerId(app: ISubApp, userName: string, projId: string, gray: string) {
    const grayUsers = app.gray_users || []; // 灰度用户名单
    const projVerMap = app.proj_ver.map; // 项目id与版本映射
    let hasProjVerMap = false;
    let projGrayVer = '';
    let projOnlineVer = '';
    let appOnlineVer = app.online_version;
    let appGrayVer = app.is_in_gray ? app.build_version : '';

    // sdk 指定了项目 id
    if (projId && projVerMap[projId] && projVerMap[projId].o) {
      const { o, b } = projVerMap[projId];
      hasProjVerMap = true;
      projOnlineVer = o;
      projGrayVer = b || '';
    }

    if (gray === '0') {
      // sdk 强制使用线上版本
      return projOnlineVer || appOnlineVer;
    }

    if (gray === '1') {
      // sdk 强制使用灰度版本，无灰度则读线上
      return inner.getForcedGrayVerId({ hasProjVerMap, projGrayVer, appGrayVer, projOnlineVer, appOnlineVer });
    }

    // 应用处于灰度中，且当前访问用户命中了灰度名单，则需要读灰度版本
    const needReadGray = app.is_in_gray && grayUsers.includes(userName);
    if (hasProjVerMap) {
      // 存在有项目版本映射关系
      return inner.getUserGrayVerId({ needReadGray, projGrayVer, appGrayVer, projOnlineVer });
    }

    if (needReadGray) {
      return appGrayVer || appOnlineVer;
    }

    return appOnlineVer;
  },

  /** 防止 branch 试探，造成过大的数据库请求压力 */
  isBranchOverReq(name: string, branch: string) {
    const time = new Date().toLocaleString();
    const mainKey = `${name} ${time}`;
    const branchCount = BRANCH_REQ_COUNT_CACHE.get(mainKey) || 0;
    // 限制每秒最多20钟不同的分支
    if (branchCount > 20) {
      return true;
    }

    const key = `${name}/${branch} ${time}`;
    if (!BRANCH_REQUESTING.get(key)) {
      // 设置此 branch 在当前秒内为请求中
      BRANCH_REQUESTING.set(key, 1);
      BRANCH_REQ_COUNT_CACHE.set(mainKey, branchCount + 1);
    }

    return false;
  },

  async checkAndPureVersion(ctx: ICuteExpressCtx, subAppVersion: SubAppVersion) {
    const { content = AS.false, clearSensitive = AS.false, timestamp, nonce } = ctx.query;
    let newData = subAppVersion;

    if (ctx.midData.forSdk) {
      const app = await appShare.checkApp(subAppVersion.sub_app_name);
      const serverNonce = await appShare.getSDKRequestNonce(app, timestamp);
      appShare.checkNonce(nonce, serverNonce);
    }

    const needClone = content === AS.false || clearSensitive === AS.true;
    if (needClone) {
      newData = { ...subAppVersion };
    }
    if (content === AS.false) {
      // 不需要返回 html_content 内容，这里擦除掉
      Object.assign(newData, { html_content: '' });
    }
    if (clearSensitive === AS.true) {
      // 清除敏感信息
      Object.assign(newData, { git_repo_url: '', git_branch: '', git_hashes: '', create_by: '', build_id: '', pipeline_id: '' });
    }

    return newData;
  },
};

/**
 * 获取子应用列表(get, post都支持)
 */
export const querySubApps: TController = async (ctx) => {
  // querySubAppsAndCount 方法的 count 值无效，且不支持模糊查询，暂时不用
  // const { apps, count } = await ctx.services.app.querySubAppsAndCount(ctx.body as any);
  // return { apps, total: count };
  const body = ctx.body;
  const { timestamp, nonce } = ctx.query;
  checkTimestamp(timestamp);
  const serverNonce = appSrv.signQuerySubApps(body, timestamp);
  appShare.checkNonce(nonce, serverNonce);

  const apps = await ctx.services.app.querySubApps(ctx.body as any);
  let total = await ctx.dao.subApp.count(ctx.body);
  // TODO: 细查 total 不正确的原因
  if (total === 0 && apps.length > 0) {
    total = apps.length;
  }
  return { apps, total };
};

/**
 * 通过名字获取子应用
 */
export const getSubApp: TControllerRet<any, any, any, Promise<nsModel.SubAppInfoParsed | null>> = async (ctx) => {
  const { name: appName, clearSensitive = '0' } = ctx.query;

  let subApp = await ctx.services.app.getAppByName(appName);
  if (subApp && clearSensitive === '1') {
    subApp = inner.clearAppSensitive(subApp);
  }

  return subApp;
};

export const getSubAppToken: TController<any> = async (ctx) => {
  const appName = ctx.query.name;
  const subApp = await ctx.services.app.getAppByName(appName, { shouldHideToken: false });
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
  const {
    name,
    version = '',
    projId = '',
    clearSensitive = AS.false,
    gray = '',
    branch = '',
    latest = AS.false,
    content = AS.false,
  } = ctx.query;
  if (branch) {
    if (branch.includes('require(')) {
      throw new Error('ic_b, who are you dude?');
    }
    if (inner.isBranchOverReq(name, branch)) {
      throw new Error('ic_b2, who are you dude?');
    }
  }

  const key = `(${version},${projId},${clearSensitive},${content},${latest},${gray})${name}/${branch}`;
  const result = await guard.call(key, async () => {
    let app = await ctx.services.app.getAppByName(name);
    if (!app) {
      throw new Error(`app not found [${name}]`);
    }

    let targetVer = '';
    let targetVerData: SubAppVersion | null = null;
    // 优先级：version > latest > projId > branch
    // 如果强制指定了版本，则获取指定版本数据
    if (version) {
      targetVer = version;
    } else if (latest === AS.true) {
      targetVer = app.pre_version;
    } else {
      // 指定了分支，未指定项目id时，获取对应分支的最新版本
      if (!projId && branch) {
        const versionData = await versionDao.getOne({ sub_app_name: name, git_branch: branch });
        if (versionData) {
          targetVer = versionData.sub_app_version;
          targetVerData = versionData;
        }
      }
      // 无版本号则尝试查看是否需要用灰度版本替代
      if (!targetVer) {
        targetVer = inner.getSuitableVerId(app, ctx.pipes.getRtxName(), projId, gray);
      }
    }

    if (!targetVerData) {
      ctx.query.ver = targetVer;
      targetVerData = await getSubAppVersion(ctx);
    } else {
      targetVerData = await inner.checkAndPureVersion(ctx, targetVerData);
    }

    if (clearSensitive === AS.true) {
      app = inner.clearAppSensitive(app);
    }
    return { app, version: targetVerData };
  });

  return result;
};

/** 批量获取的基础接口，其他批量的接口都会依赖到此次接口 */
export const batchGetSubAppAndItsVersion = async (ctx: ICuteExpressCtx) => {
  const ctxList = batchShare.makeCtxList(ctx);
  const tasks = ctxList.map((ctx) => getSubAppAndItsVersion(ctx));
  const resultList = await Promise.all(tasks);
  return resultList;
};

/**
 * getSubAppAndItsVersion 的 jsonp 响应格式
 */
export const getSubAppAndItsVersionJsonp = async (ctx: ICuteExpressCtx) => {
  try {
    const ret = await getSubAppAndItsVersion(ctx);
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const batchGetSubAppAndItsVersionJsonp = async (ctx: ICuteExpressCtx) => {
  try {
    const ret = await batchGetSubAppAndItsVersion(ctx);
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const getSubAppAndItsFullVersion = async (ctx: ICuteExpressCtx) => {
  ctx.query.content = '1';
  const ret = await getSubAppAndItsVersion(ctx);
  return ret;
};

export const getMeta = async (ctx: ICuteExpressCtx) => {
  assignNameAndVerToQuery(ctx);
  return getSubAppAndItsFullVersion(ctx);
};

/** 此接口值返回 html 结果 */
export const getHtml = async (ctx: ICuteExpressCtx) => {
  assignNameAndVerToQuery(ctx);
  return appPage.loadSubApp(ctx);
};

export const batchGetSubAppAndItsFullVersion = async (ctx: ICuteExpressCtx) => {
  ctx.query.content = '1';
  const ret = await batchGetSubAppAndItsVersion(ctx);
  return ret;
};

/**
 * getSubAppAndItsFullVersion 的 jsonp 响应格式
 */
export const getSubAppAndItsFullVersionJsonp = async (ctx: ICuteExpressCtx) => {
  try {
    const ret = await getSubAppAndItsFullVersion(ctx);
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const batchGetSubAppAndItsFullVersionJsonp = async (ctx: ICuteExpressCtx) => {
  try {
    const ret = await batchGetSubAppAndItsFullVersion(ctx);
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

/**
 * 创建子应用
 */
export const createSubApp = async (ctx: ICuteExpressCtx) => {
  const rtxName = ctx.pipes.getRtxName();
  const subApp = ctx.body;
  subApp.create_by = rtxName;
  appShare.fillSubAppForCreate(subApp);

  checkUserName(rtxName);
  const { timestamp, nonce } = ctx.query;
  // 校验时间戳应当未超时
  checkTimestamp(timestamp);
  // 检查锁并上锁，防止暴力调用 createSubApp，按名字+是否测试上锁，支持前端同时创建正式与测试
  await lockLogic('createSubApp', `${rtxName}_${subApp.is_test}`);
  // 检查名字拼写规则、描述长度等
  inner.checkAppValues(subApp);

  // 检查随机串应当正确
  let serverNonce = '';
  let shouldCheckKey = true;
  if (ctx.midData.forSdk) {
    const classInfo = await checkClassData(subApp.class_key, { checkAppLimit: true });
    shouldCheckKey = false;
    serverNonce = ctx.services.app.signCreateAppForSdk(subApp, timestamp, classInfo.class_token);
    subApp.class_name = classInfo.class_label;
  } else if (ctx.midData.forOpenApi) {
    serverNonce = ctx.services.app.signCreateAppForOpenApi(subApp, timestamp);
  } else {
    serverNonce = ctx.services.app.signCreateApp(subApp, timestamp);
  }

  if (nonce !== serverNonce) {
    throw new Error('nonce invalid');
  }

  if (subApp.class_key && shouldCheckKey) {
    const [classInfo] = await ctx.dao.classInfo.get({ class_key: subApp.class_key });
    if (!classInfo) {
      throw new Error('分类key无效');
    }
    subApp.class_name = classInfo.class_label;
  }

  const res = await ctx.services.app.createSubApp(subApp);
  return res;
};

/**
 * 更新子应用
 */
export const updateSubApp = async (ctx: ICuteExpressCtx) => {
  const rtxName = ctx.pipes.getRtxName();
  const { body: toUpdate, query, midData, services } = ctx;
  const { timestamp, nonce } = query;
  checkUserName(rtxName);
  checkTimestamp(timestamp);

  let serverNonce = '';
  const app = await appShare.checkApp(toUpdate.name);
  if (midData.forSdk) {
    serverNonce = await appShare.getSDKRequestNonce(app, timestamp);
  } else if (ctx.midData.forOpenApi) {
    serverNonce = ctx.services.app.signAppForOpenApi(toUpdate, rtxName, timestamp);
  } else {
    serverNonce = services.app.signApp(toUpdate, timestamp);
  }
  if (nonce !== serverNonce) {
    throw new Error('nonce invalid');
  }

  // 提示 proj_ver 已被另一个更新
  if (toUpdate.proj_ver) {
    if (toUpdate.proj_ver.utime !== app.proj_ver.utime) {
      throw new Error(`更新【项目与版本】无效，该数据已被另一个人更新，请刷新后重新调整后再提交`);
    } else {
      toUpdate.proj_ver.utime = Date.now();
    }
  }

  let owners = app.owners || [];
  owners = pushIfNotExist(owners, app.create_by);
  if (!owners.includes(rtxName)) {
    throw new Error(`${rtxName}无权限更新此应用，请联系${owners.join(',')}`);
  }

  if (toUpdate.class_key) {
    const [classInfo] = await ctx.dao.classInfo.get({ class_key: toUpdate.class_key });
    if (!classInfo) {
      throw new Error('分类key无效');
    }
    toUpdate.class_name = classInfo.class_label;
  }

  const res = await ctx.services.app.updateApp(toUpdate, rtxName);
  return res;
};

/**
 * 获取子应用的版本详情信息
 */
export const getSubAppVersion: TControllerRet<any, any, any, Promise<SubAppVersion | null>> = async (ctx) => {
  const { ver: mayVersionTag, name } = ctx.query;
  const versionIndex = toVersionIndex(name, mayVersionTag);

  let subAppVersion: SubAppVersion = await ctx.services.app.querySubAppVersionByVerId(versionIndex);
  if (subAppVersion) {
    subAppVersion = await inner.checkAndPureVersion(ctx, subAppVersion);
  }
  return subAppVersion || null;
};

export const getSubAppVersionNormal: TController = async (ctx) => {
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

export const getSubAppVersionJsonp: TController = async (ctx) => {
  try {
    const ret = await getSubAppVersion(ctx);
    if (!ret) {
      return ctx.jsonpCode(null, '404');
    }
    return ctx.jsonp(ret);
  } catch (err) {
    return ctx.jsonpCode(null, '404', err.message);
  }
};

export const combine3api: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  const { timestamp, nonce, name } = ctx.query;
  appShare.checkCommon(name, nonce, timestamp);

  try {
    const data = await ctx.services.app.getUserExtendData(rtxName);
    return {
      starAppNames: data.star_info.appNames,
      visitAppNames: data.visit_info.appNames,
      markedInfo: data.mark_info,
    };
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
  const name = ctx.pipes.getQueryAppName();
  await appShare.checkApp(name);
  const globalData = await ctx.services.app.getAppGlobalData(name);
  return globalData;
};

export const updateAppGlobalMarkInfo: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  const { name, ver, desc } = ctx.body;
  const { timestamp, nonce } = ctx.query;
  appShare.checkCommon(name, nonce, timestamp);
  await appShare.checkApp(name);
  const updated = await ctx.services.app.updateAppGlobalMarkInfo(name, { ver, desc, userName: rtxName });
  return updated;
};

export const delAppGlobalMarkInfo: TController = async (ctx) => {
  const { name, ver } = ctx.body;
  const { timestamp, nonce } = ctx.query;
  appShare.checkCommon(name, nonce, timestamp);
  await appShare.checkApp(name);
  const delResult = await ctx.services.app.delAppGlobalMarkInfo(name, ver);
  return delResult;
};

export const updateAppUserMarkInfo: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  userMarkInfoSchema.validate(ctx.body);
  const { name, ver, desc } = ctx.body;
  await appShare.checkApp(name);

  const updated = await ctx.services.app.updateAppUserMarkInfo(rtxName, { name, ver, desc });
  return updated;
};

export const delAppUserMarkInfo: TController = async (ctx) => {
  const rtxName = ctx.pipes.getRtxName();
  const { name, ver } = ctx.body;
  await appShare.checkApp(name);
  const delResult = await ctx.services.app.delAppUserMarkInfo(rtxName, { name, ver });
  return delResult;
};

export const delSubApp: TController = async (ctx) => {
  const { name, timestamp, nonce } = ctx.query;
  // 校验时间戳应当未超时
  checkTimestamp(timestamp);
  // 校验随机串应当有效
  const serverNonce = ctx.services.app.signDelApp(name, timestamp);
  if (nonce !== serverNonce) {
    throw new Error('nonce invalid');
  }
  // 校验应用名应当有效
  await appShare.checkApp(name);
  // 校验应用应当无构建版本号生成
  const list = await ctx.dao.subAppVersion.get({ sub_app_name: name });
  if (list.length > 0) {
    throw new Error(`app [${name}] has build versions, so it can not been deled!`);
  }

  const delResult = await ctx.services.app.delApp(name);
  return delResult;
};

export const updateSubAppGroupName: TController = async (ctx) => {
  const { name, groupname, timestamp, nonce } = ctx.query;
  const rtxName = ctx.pipes.getRtxName();
  checkTimestamp(timestamp);
  const serverNonce = ctx.services.app.signUpdateSubAppGroupName(name, groupname, timestamp);
  if (nonce !== serverNonce) {
    throw new Error('nonce invalid');
  }
  // 校验应用名应当有效
  const app = await appShare.checkApp(name);
  // 校验欲更换的组名是否已存在（存在才让更换）
  await inner.checkGroupNameExist(name);
  // 更换组名后，该应用自动变为测试应用
  const toUpdate: ISubAppUpdate = { name: app.name, app_group_name: groupname, is_test: 1 };
  const updateResult = await ctx.services.app.updateApp(toUpdate, rtxName);
  return updateResult;
};

/**
 * 重置数据库的应用到缓存里
 */
export const resetAppInfoCache: TController = async (ctx) => {
  const { name } = ctx.body;
  const { timestamp, nonce } = ctx.query;
  appShare.checkCommon(name, nonce, timestamp);

  const appInfo = await ctx.services.app.getAppByName(name, { skipLocalCache: true, skipRemoteCache: true });
  if (!appInfo) {
    throw new Error(`app (${name}) not exist`);
  }

  return appInfo;
};
