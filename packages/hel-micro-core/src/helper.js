import { getHelMicroShared, makeCacheNode } from './microShared';

/**
 * 获取默认的平台值
 * @returns
 */
export function getPlatform() {
  return getHelMicroShared().cacheRoot.platform;
  // 后续可能彻底不再支持重置平台默认值时，此处可固定返回 DEFAULT_PLAT
  // return DEFAULT_PLAT;
}


/**
 * @param {string} platform
 */
export function getPlatformSharedCache(platform) {
  const p = platform || getPlatform();
  const cacheRoot = getCacheRoot();
  const cacheNode = cacheRoot.caches[p];
  if (!cacheNode) {
    cacheRoot.caches[p] = makeCacheNode(platform);
  }
  return cacheNode;
}


export function getCacheRoot() {
  return getHelMicroShared().cacheRoot;
}


export function isVerMatchOnline(/** @type {import('hel-types').ISubApp}*/appMeta, inputVer) {
  // 如果不传版本号，就表示匹配线上版本
  if (!inputVer) {
    return true;
  }
  return appMeta?.online_version === inputVer || appMeta?.build_version === inputVer;
}
