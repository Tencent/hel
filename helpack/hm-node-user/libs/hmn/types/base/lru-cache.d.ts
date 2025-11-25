import * as cache from 'lru-cache';
export declare function newCache<K extends {} = {}, V extends {} = {}>(options: any): cache.LRUCache<K, V>;
