// @ts-nocheck
import * as cache from 'lru-cache';

export function newCache<K extends {} = {}, V extends {} = {}>(options: any): cache.LRUCache<K, V> {
  const CacheClass = cache.LRUCache;
  if (CacheClass) {
    return new CacheClass(options);
  }
  const ctor = cache.default || cache;
  // eslint-disable-next-line new-cap
  return new ctor(options);
}
