import type { IFetchModMetaOptions, IModViewConf, IShouldAcceptVersionParams } from '../base/types';
import { noopTrue } from '../base/util';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { extractNameData } from '../server-mod/mod-name';
import { getGlobalConfig } from './global-config';
import { getSdkCtx } from './index';

/** 获取用户的模块配置 */
export function getModConf(appName: string, platform?: string): IModViewConf | null {
  const sdkCtx = getSdkCtx(platform);
  const modConf = sdkCtx.mod2conf[appName];
  return modConf || null;
}

/** 逻辑已保证 modConf 不为空时，可调用此函数获取用户的模块配置 */
export function getEnsuredModConf(appName: string, platform?: string): IModViewConf {
  const sdkCtx = getSdkCtx(platform);
  const modConf = sdkCtx.mod2conf[appName];
  return modConf;
}

export function getModDerivedConf(platform?: string) {
  const sdkCtx = getSdkCtx(platform);
  const { assetNameInfos, assetName2view } = sdkCtx;
  return { assetNameInfos, assetName2view };
}

/**
 * 获取 sdk 关心变化的 hel 包名列表，
 * 由 preloadMiddleware （对接页面渲染逻辑）和 mapNodeMod（对接纯后台模块热更新） 合并得到。
 */
export function getCaredModNames(platform: string) {
  const sdkCtx = getSdkCtx(platform);
  const namesForNode = mapNodeModsManager.getHelModNames(platform);
  const namesForRender = sdkCtx.modNames;
  const names: string[] = Array.from(new Set(namesForNode.concat(namesForRender)));
  return names;
}

/** 获取用户通过 mapNodeMods 记录的模块获取选项配置 */
export function getMappedModFetchOptions(helModName: string, platform?: string): IFetchModMetaOptions | null {
  const sdkCtx = getSdkCtx(platform);
  // fetchOptions 在 preloadHelMods 时会从 mapNodeModsManager 里同步到 mod2conf 里，故此处可获得到
  const { fetchOptions } = sdkCtx.mod2conf[helModName] || {};

  return fetchOptions || null;
}

/**
 * hel 模块是否有映射关系
 */
export function isModMapped(platform: string, helModOrPath: string) {
  const { helModName } = extractNameData(helModOrPath, platform);
  const helModNames = getCaredModNames(platform);
  return helModNames.includes(helModName);
}

/**
 * 是否接受新版本
 */
export function shouldAcceptVersion(params: IShouldAcceptVersionParams) {
  const sdkCtx = getSdkCtx(params.platform);
  const { shouldAcceptVersion: sdkSAV } = sdkCtx;
  if (sdkSAV && sdkSAV !== noopTrue) {
    return sdkSAV(params);
  }
  const { shouldAcceptVersion: globalSAV } = getGlobalConfig();
  if (globalSAV && globalSAV !== noopTrue) {
    return globalSAV(params);
  }
  return true;
}
