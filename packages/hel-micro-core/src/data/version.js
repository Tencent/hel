import { safeGetMap, setSubMapValue } from '../base/util';
import { DEFAULT_ONLINE_VER } from '../consts';
import { getSharedCache } from '../wrap/cache';
import inner from './util';

export function getVersion(appName, options) {
  const { platform, versionId } = options || {};
  const { appName2verAppVersion, appName2appVersion } = getSharedCache(platform);

  // TODO: 暂未考虑接入 strictMatchVer
  const firstVerData = appName2appVersion[appName] || null;
  if (!versionId) {
    return firstVerData;
  }
  // firstVerData 在这里作为兜底返回，正常情况下 appName2verAppVersion 肯定是能取到数据的
  return appName2verAppVersion[appName]?.[versionId] || firstVerData;
}

export function setVersion(appName, /** @type {import('hel-types').ISubAppVersion}*/ versionData, options) {
  const { platform } = options || {};
  const { appName2verAppVersion, appGroupName2firstVer, appName2appVersion } = getSharedCache(platform);
  const versionId = versionData.sub_app_version;
  if (!versionId) {
    return;
  }
  const appMeta = inner.getAppMeta(appName, platform);

  const verAppVersion = safeGetMap(appName2verAppVersion, appName);
  // 记录第一个载入的版本号对应 versionData
  if (!verAppVersion[DEFAULT_ONLINE_VER]) {
    setSubMapValue(appName2verAppVersion, appName, DEFAULT_ONLINE_VER, versionData);
    appName2appVersion[appName] = versionData;
  }
  setSubMapValue(appName2verAppVersion, appName, versionId, versionData);

  appGroupName2firstVer[appMeta.app_group_name] = versionId;
}
