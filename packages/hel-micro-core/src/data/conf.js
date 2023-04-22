/** @typedef {import('../../index').IPlatformConfigFull} IPlatformConfigFull */
/** @typedef {import('../../index').SharedCache} SharedCache */
import { log } from '../base/microDebug';
import { safeAssign } from '../base/util';
import { getCacheRoot, getPlatform, getSharedCache } from '../wrap/cache';

/**
 * 提取无其他杂项的配置对象
 * @param {SharedCache} mayCache
 * @returns {IPlatformConfigFull}
 */
export function getPureConfig(mayCache, needOrigin) {
  const {
    apiMode,
    apiPrefix,
    apiSuffix,
    apiPathOfApp,
    apiPathOfAppVersion,
    getSubAppAndItsVersionFn,
    onFetchMetaFailed,
    strictMatchVer,
    getUserName,
    userLsKey,
    shouldUseGray,
    getApiPrefix,
    trustAppNames,
    platform,
    origin,
    hook,
  } = mayCache;
  let toReturn = {
    apiMode,
    apiPrefix,
    apiSuffix,
    apiPathOfApp,
    apiPathOfAppVersion,
    getSubAppAndItsVersionFn,
    onFetchMetaFailed,
    strictMatchVer,
    getUserName,
    userLsKey,
    shouldUseGray,
    getApiPrefix,
    trustAppNames,
    hook,
    platform,
  };
  if (needOrigin) {
    toReturn.origin = origin;
  }
  return toReturn;
}

export function getPlatformConfig(iPlatform) {
  const cache = getSharedCache(iPlatform);
  return getPureConfig(cache, true);
}

/**
 *
 * @param {IPlatformConfig} config
 * @param {string} [iPlatform ]
 * @returns
 */
export function initPlatformConfig(/** @type {import('../index').IPlatformConfig} */ config, iPlatform) {
  const cache = getSharedCache(iPlatform);
  const pureConfig = getPureConfig(config);
  if (cache.isConfigOverwrite) {
    // 对应平台的 initPlatformConfig 只接受一次调用
    return;
  }
  cache.isConfigOverwrite = true;
  safeAssign(cache, pureConfig);
}

export function originInit(platform, options) {
  const cache = getSharedCache(platform);
  const commonTip = '[[ core:originInit ]] invalid call, it can only been called';
  if (cache.isConfigOverwrite) {
    log(`${commonTip} before init`);
    return;
  }
  if (cache.isOriginInitCalled) {
    log(`${commonTip} one time`);
    // 对应平台的 initPlatformConfig 只接受一次调用
    return;
  }
  const pureConfig = getPureConfig(options);
  cache.isOriginInitCalled = true;
  safeAssign(cache.origin, pureConfig);
}

/**
 * 优先获取用户为某个应用单独设定的平台值，目前设定的时机有 preFetch、preFetchLib 时指定的平台值
 * 这里是为了辅助 exposeLib 接口未指定平台值时能够动态推导出目标模块的平台值
 * @returns
 */
export function getAppPlatform(appGroupName) {
  return getCacheRoot().appGroupName2platform[appGroupName] || getPlatform();
}

/**
 * hel-micro innerPreFetch 会调用此接口提前记录一下应用名对应的版本号
 */
export function setAppPlatform(appGroupName, platform) {
  getCacheRoot().appGroupName2platform[appGroupName] = platform;
  return getAppPlatform(appGroupName);
}
