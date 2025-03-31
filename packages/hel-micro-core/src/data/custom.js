import { safeGetMap } from '../base/util';
import { DEFAULT_ONLINE_VER } from '../consts';
import { getSharedCache } from '../wrap/cache';
import { getAppPlatformByAppName } from './conf';

function getDataMap(appName, options) {
  // 没有传平台值，就猜测 appName 对应的平台值
  const { customKey, platform = getAppPlatformByAppName(appName) } = options;
  const { appName2verCustomData } = getSharedCache(platform);
  const customMap = safeGetMap(appName2verCustomData, appName);
  const dataMap = safeGetMap(customMap, customKey);
  return dataMap;
}

export function getCustomData(appName, options) {
  const dataMap = getDataMap(appName, options);
  const result = dataMap[options.versionId || DEFAULT_ONLINE_VER];
  return result !== undefined ? result : null;
}

export function setCustomData(appName, options) {
  const { customValue, versionId } = options;
  const dataMap = getDataMap(appName, options);
  dataMap[versionId || DEFAULT_ONLINE_VER] = customValue;
  if (!dataMap[DEFAULT_ONLINE_VER]) {
    dataMap[DEFAULT_ONLINE_VER] = customValue;
  }
}
