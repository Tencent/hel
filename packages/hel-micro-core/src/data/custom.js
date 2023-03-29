import { safeGetMap } from '../base/util';

function getDataMap() {
  const { customKey, platform } = options;
  const { appName2verCustomData } = getSharedCache(platform);
  const customMap = safeGetMap(appName2verCustomData, appName);
  const dataMap = safeGetMap(customMap, customKey);
  return dataMap;
}

export function getCustomData(appName, options) {
  const dataMap = getDataMap(appName, options);
  return dataMap[options.versionId || DEFAULT_ONLINE_VER];
}

export function setCustomData(appName, options) {
  const { customValue, versionId } = options;
  const dataMap = getDataMap(appName, options);
  dataMap[versionId || DEFAULT_ONLINE_VER] = customValue;
}