import { getHelMicroShared, makeCacheNode } from './microShared';

export function getHelEventBus() {
  return getHelMicroShared().eventBus;
}

export function getUserEventBus() {
  return getHelMicroShared().userEventBus;
}

export function getCacheRoot() {
  return getHelMicroShared().cacheRoot;
}

export function getSharedCache(platform) {
  const p = platform || 'hel';
  const cacheRoot = getCacheRoot();
  let cacheNode = cacheRoot.caches[p];
  if (!cacheNode) {
    const platType = typeof platform;
    if (platType !== 'string') {
      console.error('invalid plaform:', platform);
      throw new Error(`fatal error: platform only can be a string, now it is ${platType}`);
    }

    const platCache = makeCacheNode(platform);
    cacheRoot.caches[p] = platCache;
    cacheNode = platCache;
  }
  return cacheNode;
}
