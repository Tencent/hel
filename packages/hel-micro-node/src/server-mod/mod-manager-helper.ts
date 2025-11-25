import { PLATFORM } from '../base/consts';
import { HEL_MDO_PROXY, IS_HEL_MOD_PROXY } from '../base/mod-consts';
import type { IFetchModMetaOptions, IImportModOptions, IMeta, IModManagerItem } from '../base/types';
import { IInnerImportModByMetaOptions } from '../base/types-srv-mod';
import { makeMeta } from './fake-meta';
import { mapNodeModsManager } from './map-node-mods';
import { getModByPath } from './mod-ins';
import { fetchModMeta } from './mod-meta';
import { extractNameData } from './mod-name';
import { extractFnAndDictProps } from './util';

export function getEnsuredIMBMOptions(meta: IMeta, options: IInnerImportModByMetaOptions) {
  const platform = options.platform || meta.app.platform || PLATFORM;
  return { ...options, platform };
}

export function getModProxyHelpData(helModNameOrPath: string, platform: string) {
  const nodeModName = mapNodeModsManager.getNodeModName(helModNameOrPath, platform);
  const data = mapNodeModsManager.getNodeModData(nodeModName);
  const { rawPath, fallback, isShapeReady } = data;
  let { fnProps, dictProps } = data;
  let rawMod = {};
  // 内部 preload 触发 importModByMeta 逻辑时，会在还未映射就调用 requireMod 函数，此时 rawPath 为空
  if (!isShapeReady) {
    rawMod = getModByPath(rawPath, { allowNull: true }) || {};
    const result = extractFnAndDictProps(rawMod);
    fnProps = result.fnProps;
    dictProps = result.fnProps;
  }

  return { fnProps, dictProps, rawMod, fallback, rawPath };
}

/**
 * 获取当前运行中的 hel 模块的入口文件路径
 */
export function getHelModFilePath(helModOrPath: string, modItem: IModManagerItem) {
  const { modPath, exportedMods, modName, platform } = modItem;
  const isMainMod = helModOrPath === modName;

  let helModFilePath = '';
  if (isMainMod) {
    helModFilePath = modPath;
  } else {
    // 查子路径对应模块
    const { relPath } = extractNameData(helModOrPath, platform);
    const modInfo = exportedMods.get(relPath);
    helModFilePath = modInfo ? modInfo.path : '';
  }

  return helModFilePath;
}

export function isHelModProxy(mayModProxy: any) {
  if (!mayModProxy) {
    return false;
  }
  return mayModProxy[HEL_MDO_PROXY] === IS_HEL_MOD_PROXY;
}

/**
 * 尝试复用 mapNodeMods 设置的 apiUrl
 */
export function mayInjectApiUrl(helModName: string, options?: IFetchModMetaOptions) {
  const helpackApiUrl = mapNodeModsManager.getMappedApiUrl(helModName);
  const newOptions = helpackApiUrl ? Object.assign({ helpackApiUrl }, options || {}) : options;
  return newOptions;
}

export async function getMetaByImportOptions(helModNameOrPath: string, options?: IImportModOptions) {
  const optionsVar = options || {};
  const { platform = PLATFORM, skipMeta, customVer } = optionsVar;
  const { helModName } = extractNameData(helModNameOrPath, platform);

  let meta: IMeta;
  if (skipMeta) {
    meta = makeMeta(platform, helModName, customVer);
  } else {
    meta = await fetchModMeta(helModName, mayInjectApiUrl(helModName, options));
  }

  return meta;
}
