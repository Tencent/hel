import { DEFAULT_ONLINE_VER, DEFAULT_PLAT } from './consts';
import { getSharedCache } from './cache';
import { safeGetMap } from './util';
import { log } from './microDebug';
import dataUtil from './dataUtil';

export function getVerLoadStatus(appName, options) {
  return dataUtil.getVerLoadStatus(appName, 'appName2verLoadStatus', options);
}

export function setVerLoadStatus(appName, loadStatus, options) {
  dataUtil.setVerLoadStatus(appName, loadStatus, 'appName2verLoadStatus', options);
}

export function getVerLib(appName, inputOptions) {
  const options = inputOptions || {};
  const { versionId, platform } = options;
  const sharedCache = getSharedCache(platform);
  const { appName2verEmitLib, appName2Lib, strictMatchVer, appName2isLibAssigned } = sharedCache;
  const targetStrictMatchVer = options.strictMatchVer ?? strictMatchVer;
  const verEmitLibMap = safeGetMap(appName2verEmitLib, appName);
  dataUtil.ensureOnlineModule(verEmitLibMap, appName, DEFAULT_PLAT);

  // 不传递具体版本号就执行默认在线版本
  const versionIdVar = versionId || DEFAULT_ONLINE_VER;
  const verLib = verEmitLibMap[versionIdVar];

  // 未分配的模块，直接返回 null 即可，因为 appName2Lib 里会被 exposeLib 提前注入一个 {} 对象占位
  const staticLib = appName2isLibAssigned[appName] ? appName2Lib[appName] : null;
  // 指定了版本严格匹配的话，兜底模块置为空
  const fallbackLib = targetStrictMatchVer ? null : staticLib;
  const result = verLib || fallbackLib || null;
  log('[[ core:getVerLib ]] appName,options,result:', appName, options, result);
  return result;
}
