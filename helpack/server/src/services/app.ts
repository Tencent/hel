/* eslint-disable camelcase,no-underscore-dangle */
import biz, { PLUGIN_SEC_STR } from 'at/configs/biz';
import * as rainbowConf from 'at/configs/rainbowConf';
import dao from 'at/dao';
import * as trackDao from 'at/dao/track';
import type { ISubAppUpdate, SubAppInfoParsed, SubAppVersion } from 'at/types/domain';
import * as arrUtil from 'at/utils/array';
import * as sign from 'at/utils/sign';
import * as dataCacheSrv from 'services/dataCache';
import * as loggerSrv from 'services/logger';
import * as redisSrv from 'services/redis';
import * as appShare from './share/app';
import * as versionShare from './share/version';

const { getSignSecStr } = rainbowConf;

export function hideToken(app: SubAppInfoParsed) {
  if (app) {
    const copyApp = { ...app };
    copyApp.token = '******';
    return copyApp;
  }
  return app;
}

export function getUserToken(user: string) {
  const userTokens = rainbowConf.getOpenApiUserTokens();
  const token = userTokens[user];
  if (!token) {
    throw new Error(`no token generated for user [${user}] while calling openapi.createSubApp,
    please contact fantasticsoul to generate one`);
  }
}

/**
 *
 * @param rtxName
 * @param queryOptions
 * @param filterEnableDisplay - 是否过滤 enable_display 字段
 * enable_display: 是否允许下发给客户端做展示, true允许，false不允许
 */
export async function querySubApps(queryOptions: nsReq.IQuerySubApps, filterEnableDisplay = true) {
  const { where, ...options } = queryOptions;
  const whereCopy = { ...where };
  if (filterEnableDisplay) {
    whereCopy.enable_display = 1;
  }

  let apps = await dao.subApp.get(whereCopy, options);
  apps = apps.map(hideToken);
  return apps;
}

export async function getUserExtendData(rtxName, autoCreate = true) {
  const queryOptions = { rtx_name: rtxName };
  const dataList = await dao.userExtend.get(queryOptions);

  let [oneData] = dataList;
  if (!oneData && autoCreate) {
    await dao.userExtend.add({ rtx_name: rtxName });
    const dataList = await dao.userExtend.get(queryOptions);
    oneData = dataList[0];
  }

  return oneData;
}

export async function updateUserStarApp(rtxName, appName, star) {
  const data = await getUserExtendData(rtxName);
  const { star_info } = data;
  const { appNames } = star_info;
  let newAppNames = [];

  if (star) {
    newAppNames = arrUtil.pushIfNotExist(appNames, appName, true);
  } else {
    newAppNames = arrUtil.removeIfExist(appNames, appName);
  }
  star_info.appNames = newAppNames;

  if (newAppNames.length >= 21) {
    throw new Error('已达收藏上限');
  }

  await dao.userExtend.update(data);
  return data;
}

/**
 * 返回用户最新的访问数据
 * @param rtxName
 * @param appName
 */
export async function updateUserVisitApp(rtxName, appName) {
  const userExtendData = await getUserExtendData(rtxName);
  const { visit_info } = userExtendData;
  const { appNames } = visit_info;
  let newAppNames = arrUtil.pushAndDelBeforePush(appNames, appName, true);
  if (newAppNames.length >= 21) {
    newAppNames = arrUtil.remainItem(newAppNames, 20);
  }
  visit_info.appNames = newAppNames;
  await dao.userExtend.update(userExtendData);
  return newAppNames;
}

export async function updateAppUserMarkInfo(rtxName: string, options: any) {
  const { name, ver, desc } = options;
  if (desc.length > 120) {
    throw new Error(`private mark app [${name}] desc exceed 120 chars, now it is ${desc.length}`);
  }

  const userExtendData = await getUserExtendData(rtxName);
  const {
    mark_info: { markedList },
  } = userExtendData;
  const targetItem = markedList.find((item) => item.name === name && item.ver === ver);
  if (targetItem) {
    targetItem.desc = desc;
    targetItem.time = Date.now();
  } else {
    markedList.push({ name, ver, desc, time: Date.now() });
  }

  // 个人最多可以为 80 个不同应用不同版本号标记个人描述
  // 暂定 80 个，mark_info 存储类型已调整为 text，后期可看使用情况调整这里的限制
  if (markedList.length > 80) {
    throw new Error(`private mark app [${name}] version exceed 80 limits`);
  }

  await dao.userExtend.update(userExtendData);
  return userExtendData;
}

export async function delAppUserMarkInfo(rtxName: string, options: any) {
  const { name, ver } = options;
  const userExtendData = await getUserExtendData(rtxName);
  const {
    mark_info: { markedList },
  } = userExtendData;
  const idx = markedList.findIndex((item) => item.name === name && item.ver === ver);
  if (idx >= 0) {
    markedList.splice(idx, 1);
    await dao.userExtend.update(userExtendData);
  } else {
    throw new Error(`app [${name}] ver [${ver}] of userMarkedList not exist`);
  }

  return true;
}

/**
 * 获取应用全局标记信息，不存在则自动创建
 * @param appName
 * @param autoCreateObj
 * @returns
 */
export async function getAppGlobalData(appName: string, autoCreateObj?: any) {
  const subAppGlobal = await dao.subAppGlobal.getOne({ name: appName });
  if (!subAppGlobal) {
    const autoCreateObjVar = autoCreateObj ?? {
      name: appName,
      mark_info: { markedList: [] },
    };
    await dao.subAppGlobal.add(autoCreateObjVar);
    const created = await dao.subAppGlobal.getOne({ name: appName });
    return created;
  }
  return subAppGlobal;
}

export async function updateAppGlobalMarkInfo(appName: string, options: any) {
  const { ver, desc, userName } = options;
  if (desc.length > 120) {
    throw new Error(`global mark app [${appName}] desc exceed 120 chars, now it is ${desc.length}`);
  }

  const subAppGlobal = await dao.subAppGlobal.getOne({ name: appName });
  if (!subAppGlobal) {
    const toAdd: Partial<nsModel.SubAppGlobalParsed> = {
      name: appName,
      mark_info: { markedList: [{ ver, desc, userName, time: Date.now() }] },
    };
    await dao.subAppGlobal.add(toAdd);
    return true;
  }
  const markedList = subAppGlobal.mark_info.markedList;
  const targetItem = markedList.find((item) => item.ver === ver);
  if (targetItem) {
    targetItem.desc = desc;
    targetItem.time = Date.now();
  } else if (markedList.length >= 50) {
    // 同一个应用最多可支持全局标记 50 个版本
    throw new Error(`global mark app [${appName}] version exceed 50 limits`);
  } else {
    markedList.push({ ver, desc, userName, time: Date.now() });
  }

  await dao.subAppGlobal.update(subAppGlobal);
  return true;
}

export async function delAppGlobalMarkInfo(appName: string, ver: string) {
  const subAppGlobal = await dao.subAppGlobal.getOne({ name: appName });
  if (!subAppGlobal) {
    throw new Error(`app [${appName}] global mark info not exist`);
  }
  const markedList = subAppGlobal.mark_info.markedList;
  const idx = markedList.findIndex((item) => item.ver === ver);
  if (idx >= 0) {
    markedList.splice(idx, 1);
    await dao.subAppGlobal.update(subAppGlobal);
  } else {
    throw new Error(`app [${appName}] ver [${ver}] of globalMarkedList not exist`);
  }

  return true;
}

export async function delUserVisitApp(rtxName, appName) {
  const userExtendData = await getUserExtendData(rtxName);
  const { visit_info } = userExtendData;
  const { appNames } = visit_info;
  const newAppNames = arrUtil.removeIfExist(appNames, appName);
  visit_info.appNames = newAppNames;
  await dao.userExtend.update(userExtendData);
  return userExtendData;
}

/**
 * 彻底删除应用（本地内存、redis内存、数据），谨慎使用该接口
 * @param appName
 * @returns
 */
export async function delApp(appName: string) {
  await appShare.delRemoteApp(appName);
  redisSrv.safePub(biz.CHANNEL_APP_INFO_DELED, appName).catch((err: any) => {
    loggerSrv.error({ source: 'delApp/safePub', msg: err.message });
  });
  const res = await dao.subApp.del(appName);
  return res;
}

/**
 * @param versionIndex - 版本号id索引，对应 sub_app_version 表的 sub_app_version 字段（唯一索引字段）
 */
export async function querySubAppVersionByVerId(
  versionIndex: string,
  options?: { skipLocalCache?: boolean; skipRemoteCache?: boolean; pubVer?: boolean },
) {
  let version;
  const { skipLocalCache = false, skipRemoteCache = false, pubVer = true } = options || {};

  if (!skipLocalCache) {
    version = dataCacheSrv.getVersion(versionIndex);
    if (version) {
      return version;
    }
  }

  const pubToCache = (version: SubAppVersion) => {
    if (!pubVer) return;
    // 在当前实例内存里先存一份，再通知其他机器，这样可以在高并发时让再次命中此实例的请求可以尽快的获取到内存里的数据
    //（因为同步到其他机器需要一些时间）
    dataCacheSrv.setVersion(version);
    redisSrv.safePub(biz.CHANNEL_APP_VERSION_CHANGED, versionIndex).catch((err: any) => {
      loggerSrv.error({ source: 'querySubAppVersionByVerId/safePub', msg: err.message });
    });
  };

  if (!skipRemoteCache) {
    version = await versionShare.getRemoteVersion(versionIndex);
    if (version) {
      pubToCache(version);
      return version;
    }
  }

  const list = await dao.subAppVersion.get({ sub_app_version: versionIndex });
  version = list[0];

  if (version) {
    pubToCache(version);
    await versionShare.setRemoteVersion(version);
  }
  return version;
}

interface IGetAppByNameOptions {
  shouldHideToken?: boolean;
  skipLocalCache?: boolean;
  skipRemoteCache?: boolean;
  pub?: boolean;
}

/**
 * app名称是唯一的，一个名称理论上最多对应一个app
 */
export async function getAppByName(appName: string, options?: IGetAppByNameOptions) {
  const { shouldHideToken = true, skipLocalCache = false, skipRemoteCache = false, pub = true } = options || {};

  const getApp = async (name: string) => {
    let app: SubAppInfoParsed | null = null;
    if (!name) {
      return app;
    }

    if (!skipLocalCache) {
      app = dataCacheSrv.getAppInfo(name);
      if (app) {
        return app;
      }
    }

    const pubToLocalCache = (app: SubAppInfoParsed) => {
      if (!pub) return;
      // 在当前实例内存里先存一份，再通知其他机器，这样可以在高并发时让再次命中此实例的请求可以尽快的获取到内存里的数据
      //（因为同步到其他机器需要一些时间）
      dataCacheSrv.setAppInfo(app);
      redisSrv.safePub(biz.CHANNEL_APP_INFO_CHANGED, appName).catch((err: any) => {
        loggerSrv.error({ source: 'getAppByName/safePub', msg: err.message });
      });
    };

    if (!skipRemoteCache) {
      app = await appShare.getRemoteApp(appName);
      if (app) {
        pubToLocalCache(app);
        return app;
      }
    }

    const apps = await dao.subApp.get({ name: appName });
    app = apps[0] || null;
    if (app) {
      pubToLocalCache(app);
      await appShare.setRemoteApp(app);
    }

    return app;
  };

  let app = await getApp(appName);
  if (app) {
    if (!app.proj_ver) app.proj_ver = { map: {}, utime: 0 };
    if (!app.proj_ver.map) app.proj_ver.map = {};
    if (shouldHideToken) app = hideToken(app);
  }

  return app;
}

export async function countAppByKey(classKey: string) {
  const appCount = await dao.subApp.count({ where: { class_key: classKey } });
  return appCount;
}

export async function updateApp(updateObj: ISubAppUpdate, rtxName?: string) {
  const toUpdate = { ...updateObj };
  const { name } = toUpdate;
  await dao.subApp.update(toUpdate);
  const app = await dao.subApp.getOne({ name });
  await appShare.setRemoteApp(app);

  // 通知其他示例更新本地内存
  redisSrv.pub(biz.CHANNEL_APP_INFO_CHANGED, name).catch((err: any) => {
    loggerSrv.error({ source: 'updateApp/pub', msg: err.message });
  });
  trackDao
    .add({ operator: rtxName || '', update_json: JSON.stringify(toUpdate), schema_id: 'sub_app_infos', from: 'hel' })
    .catch((err) => console.error(err)); // 这个错误可以静默掉
  return app;
}

export async function createSubApp(toCreate: Partial<nsModel.SubAppInfoParsed>) {
  const [app] = await dao.subApp.get({ name: toCreate.name });
  if (toCreate.name === '__hub') {
    throw new Error(`__hub为内置的应用名，不可以用此应用名创建应用`);
  }
  if (app) {
    throw new Error(`应用名[${toCreate.name}]已存在`);
  }

  const apps = await dao.subApp.get({ app_group_name: toCreate.app_group_name });
  if (!toCreate.is_test) {
    if (apps.some((v) => !v.is_test)) {
      throw new Error(`组名[${toCreate.app_group_name}]重复，该组名下已存在其他应用`);
    }
    if (toCreate.name !== toCreate.app_group_name) {
      throw new Error(`创建正式应用时，组名[${toCreate.app_group_name}]和应用名${toCreate.name}必须相等`);
    }
  } else {
    // 是测试应用的话，需要检测该组名有没有正式创建正式应用
    if (!apps.some((v) => !v.is_test)) {
      // 遍历apps，找不到一个正式应用
      throw new Error(`该组名[${toCreate.app_group_name}]未创建过正式应用，请先创建一个正式应用`);
    }
  }

  const userRtxName = toCreate.create_by;
  const extendData = await getUserExtendData(userRtxName);
  const { createAppLimit } = extendData.extend_info;
  const userCreatedApps = await dao.subApp.get({ create_by: userRtxName }, { size: createAppLimit + 1 });
  const createAppCount = userCreatedApps.length;
  if (createAppCount >= createAppLimit) {
    throw new Error(
      `用户[${userRtxName}]创建app数量 ${createAppCount} 已超过限制数 ${createAppLimit}，可联系 ${biz.HEL_OWNER} 修改限制数量`,
    );
  }

  const res = await dao.subApp.add(toCreate);
  const fullApp = await dao.subApp.getOne({ name: toCreate.name });
  appShare.setRemoteApp(fullApp);
  return res;
}

export async function getAppHost(appName: string) {
  const target = await getAppByName(appName);
  if (!target) throw new Error(`${appName} not registered`);
  return target.api_host;
}

/**
 * @param {string[]} availableAppNames - 用户在敏感权限里可见的app列表
 */
export async function filterEnableDisplayApps() {
  // 查出允许下发到客户端的app信息列表
  const apps = await dao.subApp.get({ enable_display: 1 }, { page: 0, size: 100 });
  return apps;
}

export function signGetGroupData(appID: string, group: string, timestamp: number | string) {
  const secStr = getSignSecStr();
  const content = `${appID}_${timestamp}_${secStr}_${group}`;
  return sign.signByMd5(content);
}

/**
 * 只签 id timestamp 和秘串即可
 * @param toUpdate timestamp
 */
export function signCreateApp(toCreate: any, timestamp: number | string) {
  const secStr = getSignSecStr();
  const content = `${toCreate.name}_${timestamp}_${secStr}`;
  return sign.signByMd5(content);
}

/**
 * @param toUpdate timestamp
 */
export function signCreateAppForOpenApi(toCreate: any, timestamp: number | string) {
  const { name, create_by: createBy } = toCreate;
  const token = getUserToken(createBy);
  const content = `${createBy}_${name}_${timestamp}_${token}`;
  return sign.signByMd5(content);
}

/**
 * @param toUpdate timestamp
 */
export function signCreateAppForSdk(toCreate: any, timestamp: number | string, classToken) {
  const { name, class_key: classKey } = toCreate;
  const content = `${name}_${timestamp}_${classKey}_${classToken}`;
  return sign.signByMd5(content);
}

/**
 * 只签 id timestamp 和秘串即可
 * @param toUpdate timestamp
 */
export function signDelApp(appName: string, timestamp: number | string) {
  const content = `${appName}_${timestamp}_${rainbowConf.getDelAppToken()}`;
  return sign.signByMd5(content);
}

export function signUpdateSubAppGroupName(appName: string, appGroupName, timestamp: number | string) {
  const content = `${appName}_${appGroupName}_${timestamp}_${rainbowConf.getUpdateAppGroupNameToken()}`;
  return sign.signByMd5(content);
}

/**
 * 只签 id timestamp 和秘串即可
 * @param toUpdate timestamp
 */
export function signApp(toUpdate: any, timestamp: number | string) {
  const secStr = getSignSecStr();
  const content = `${toUpdate.id}_${timestamp}_${secStr}`;
  return sign.signByMd5(content);
}

export function signAppForSdk(name: string, classToken: string, timestamp: number | string) {
  const content = `${name}_${classToken}_${timestamp}`;
  return sign.signByMd5(content);
}

export function signAppForOpenApi(toUpdate: any, rtxName: string, timestamp: number | string) {
  const token = getUserToken(rtxName);
  const content = `${rtxName}_${toUpdate.id}_${timestamp}_${token}`;
  return sign.signByMd5(content);
}

/**
 * 为插件获取应用请求计算签名
 * @param toUpdate timestamp
 */
export function signGetAppForPlugin(appName: string, timestamp: number | string) {
  const secStr = PLUGIN_SEC_STR;
  const content = `${appName}_${timestamp}_${secStr}`;
  return sign.signByMd5(content);
}

/**
 * 为插件更新应用请求计算签名
 * @param toUpdate timestamp
 */
export function signUpdateAppForPlugin(toUpdate: any, timestamp: number | string) {
  const secStr = PLUGIN_SEC_STR;
  const content = `${toUpdate.id}_${toUpdate.token}_${timestamp}_${secStr}`;
  return sign.signByMd5(content);
}

/**
 * 为插件版本请求计算签名
 * @param toUpdate timestamp
 */
export function signAppVersionForPlugin(toUpdate: any, timestamp: number | string) {
  const secStr = PLUGIN_SEC_STR;
  const content = `${toUpdate.sub_app_id}_${toUpdate.sub_app_version}_${timestamp}_${secStr}`;
  return sign.signByMd5(content);
}

/**
 * 为插件checkApp请求计算签名
 * @param toUpdate timestamp
 */
export function signCheckAppForPlugin(classKey: string, timestamp: number | string) {
  const content = `${classKey}_${timestamp}_${PLUGIN_SEC_STR}`;
  return sign.signByMd5(content);
}

/**
 * 通用的函一个字符串变量的请求计算签名
 */
export function signStrCommon(str: string, timestamp: number | string, isStaticSec?: boolean) {
  // 默认读动态的 sec，对于旧场景需要透传 isStaticSec=true 才读 PLUGIN_SEC_STR 固定值
  const secStr = !isStaticSec ? getSignSecStr() : PLUGIN_SEC_STR;
  const content = `${str}_${timestamp}_${secStr}`;
  return sign.signByMd5(content);
}

/**
 * 为sdk新增版本时计算签名
 * @param toUpdate timestamp
 */
export function signAppVersionForSdk(toUpdate: any, timestamp: number | string, classToken: string) {
  const content = `${toUpdate.sub_app_name}_${toUpdate.sub_app_version}_${timestamp}_${classToken}`;
  return sign.signByMd5(content);
}

/**
 * 为 querySubApps 请求计算签名
 * @param toUpdate timestamp
 */
export function signQuerySubApps(body: any, timestamp: number | string) {
  const secStr = getSignSecStr();
  const content = `${body.page}_${secStr}_${body.size}_${timestamp}`;
  return sign.signByMd5(content);
}

/**
 * 为 getSubAppVersionListByName 请求计算签名
 * @param toUpdate timestamp
 */
export function signReqListByName(body: any, timestamp: number | string) {
  const secStr = getSignSecStr();
  const { name, page, size } = body;
  const content = `${name}_${secStr}_${size}_${page}_${timestamp}`;
  return sign.signByMd5(content);
}

/**
 * 计算通用的请求签名
 * @param toUpdate timestamp
 */
export function signCommon(timestamp: number | string) {
  const secStr = getSignSecStr();
  const content = `${secStr}_${timestamp}`;
  return sign.signByMd5(content);
}
