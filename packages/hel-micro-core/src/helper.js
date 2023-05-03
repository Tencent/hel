import { DEFAULT_PLAT } from './consts';
import { getHelMicroShared, makeCacheNode } from './microShared';

/**
 * 获取默认的平台值
 * @returns
 */
export function getPlatform() {
  return DEFAULT_PLAT;
}

/**
 * @param {string} platform
 */
export function getPlatformSharedCache(platform) {
  const p = platform || getPlatform();
  const cacheRoot = getCacheRoot();
  let cacheNode = cacheRoot.caches[p];
  if (!cacheNode) {
    const platCache = makeCacheNode(platform);
    cacheRoot.caches[p] = platCache;
    cacheNode = platCache;
  }
  return cacheNode;
}

export function getCacheRoot() {
  return getHelMicroShared().cacheRoot;
}
