import biz from 'at/configs/biz';
import type { IClassInfo, SubAppInfoParsed, SubAppVersionParsed } from 'at/types/domain';
import LRU from 'lru-cache';
import { notifySDKMetaChanged } from 'services/hel-micro-socket';
import { internal } from 'services/logger';
import * as redisSrv from 'services/redis';
import { delRemoteApp, getRemoteApp } from './share/app';
import { getRemoteVersion } from './share/version';

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
// 1 个应用 1kb
const APP_INFO_CACHE = new LRU<string, SubAppInfoParsed>({
  max: 200,
  ttl: ONE_YEAR_MS,
});
const VERSION_CACHE = new LRU<string, SubAppVersionParsed>({
  max: 5000,
  ttl: ONE_YEAR_MS,
});
const CLASS_INFO_CACHE = new LRU<string, IClassInfo>({
  max: 5000,
  ttl: ONE_YEAR_MS,
});
const OTHER_CACHE = new LRU<string, string>({
  max: 5000,
  ttl: ONE_YEAR_MS,
});

export function getAppInfo(appName: string): SubAppInfoParsed | null {
  const appInfo = APP_INFO_CACHE.get(appName) || null;
  return appInfo;
}

export function setAppInfo(appInfo: SubAppInfoParsed) {
  APP_INFO_CACHE.set(appInfo.name, appInfo);
}

export function delAppInfo(appName: string) {
  APP_INFO_CACHE.delete(appName);
}

export function getVersion(versionId: string): SubAppVersionParsed | null {
  const version = VERSION_CACHE.get(versionId) || null;
  return version;
}

export function getClassInfo(key: string): IClassInfo | null {
  const classInfo = CLASS_INFO_CACHE.get(key) || null;
  return classInfo;
}

export function setClassInfo(key: string, info: IClassInfo) {
  CLASS_INFO_CACHE.set(key, info);
}

export function setVersion(version: SubAppVersionParsed) {
  VERSION_CACHE.set(version.sub_app_version, version);
}

export function getOtherCache(key: string): string {
  return OTHER_CACHE.get(key) || '';
}

export function setOtherCache(key: string, val: string) {
  OTHER_CACHE.set(key, val);
}

export async function handleAppInfoDel(appName: string) {
  try {
    await delRemoteApp(appName);
    delAppInfo(appName);
  } catch (err) {
    internal.error(err);
  }
}

export async function handleAppInfoChange(appName: string) {
  try {
    const appInfo = await getRemoteApp(appName);
    if (appInfo) {
      setAppInfo(appInfo);
      const data = { modName: appName, channel: biz.CHANNEL_APP_INFO_CHANGED };
      notifySDKMetaChanged(appName, data);
    }
  } catch (err) {
    internal.error(err);
  }
}

export async function handleVersionChange(versionId: string) {
  try {
    const version = await getRemoteVersion(versionId);
    if (version) {
      setVersion(version);
      const { sub_app_name: modName } = version;
      const data = { modName, channel: biz.CHANNEL_APP_VERSION_CHANGED };
      notifySDKMetaChanged(version.sub_app_name, data);
    }
  } catch (err) {
    internal.error(err);
  }
}

export async function handleStaffChange(staffStrKey: string) {
  try {
    const staffStr = await redisSrv.getCache(staffStrKey);
    if (staffStr) {
      setOtherCache(staffStrKey, staffStr);
    }
    return staffStr || '';
  } catch (err) {
    internal.error(err);
  }
}
