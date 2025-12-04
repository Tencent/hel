import { ConcurrencyGuard } from '@tmicro/f-guard';
import { LRUCache } from '@tmicro/lru-cache';
import { PLATFORM } from '../base/consts';
import type { IFetchModMetaOptions, IMeta } from '../base/types';
import { fetchModMeta } from '../server-mod/mod-meta';
import { getSdkCtx } from './index';

const guard = new ConcurrencyGuard();
/**
 * 存储 helpack 模块缓存，仅当 careAllModsChange 为 true 时，此对象才会逐渐写入数据
 * 且最多写入 3000个（1个元数据最大5kb，存满 3000 时此处共计最多消耗内存 15M），
 * 超额写入则按 lru 策略淘汰旧数据
 */
const modMetaCache = new LRUCache<string, IMeta>({ max: 3000 });

export function setMetaCache(modMeta: IMeta) {
  modMetaCache.set(modMeta.app.name, modMeta);
}

export function getMetaCache(name: string) {
  const cachedMeta = modMetaCache.get(name);
  return cachedMeta;
}

/**
 * 获取 helpack 模块元数据，满足条件时内部会优先获取本地缓存数据
 */
export async function getModMeta(name: string, options?: IFetchModMetaOptions) {
  const { platform = PLATFORM, ver, branch, gray, projId } = options || {};
  // guard 并发获取优化需要的 key
  let guardKey = `${platform}/${name}@${ver}`;
  // 有定制参数时，不走缓存优化
  if (branch || projId || gray) {
    guardKey = `${guardKey}--${branch}${projId}${gray}`;
    const meta = await guard.call(guardKey, fetchModMeta, name, options);
    return meta;
  }

  // 设置了 careAllModsChange = true，本地缓存的 meta 一定是最新的，可返回给顶层 api 使用
  const ctx = getSdkCtx(platform);
  if (ctx.careAllModsChange) {
    const cachedMeta = getMetaCache(name);
    if (cachedMeta) {
      return cachedMeta;
    }
  }

  const meta = await guard.call(guardKey, fetchModMeta, name, { platform, ver });
  return meta;
}
