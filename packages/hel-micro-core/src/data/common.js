import { safeGetMap } from '../base/util';
import { getCacheRoot } from '../wrap/cache';

function getDataMap(customKey) {
  const { common } = getCacheRoot();
  const dataMap = safeGetMap(common, customKey);
  return dataMap;
}

export function getCommonData(customKey, dataKey) {
  const dataMap = getDataMap(customKey);
  const result = dataMap[dataKey];
  return result !== undefined ? result : null;
}

export function setCommonData(customKey, dataKey, data) {
  const dataMap = getDataMap(customKey);
  dataMap[dataKey] = data;
}
