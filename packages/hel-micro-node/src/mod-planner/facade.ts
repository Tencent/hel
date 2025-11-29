import { HOOK_TYPE, PLATFORM } from '../base/consts';
import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import type { IFetchModMetaOptions, IModInfo } from '../base/types';
import { getMappedModFetchOptions, isModMapped } from '../context/facade';
import { getGlobalConfig } from '../context/global-config';
import { triggerHook } from '../context/hooks';
import { getSdkCtx } from '../context/index';
import { importNodeModByPath } from '../mod-node';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { fetchModInfo } from '../server-mod/mod-meta';
import { markAppDesc } from './facade-helper';
import { PresetData, presetDataMgr } from './preset-data';

function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'HelModPlanner' });
}

/**
 * 更新平台对应的所有已注册模块对应的预设数据
 */
export async function updateRegisteredModsPresetData(platform: string, setBy: string) {
  // 表示刷已映射的全部模块
  const modInfoList = await fetchRegisteredModInfoList(platform);
  await Promise.all(modInfoList.map((modInfo) => updateModPresetData(platform, setBy, modInfo)));
  return modInfoList;
}

/**
 * 更新模块信息对应的预置数据，注：模块必须在映射表里才会去更新
 * 不传递具体名称则表示更新注册的所有模块
 */
export async function mayUpdateModPresetData(platform: string, setBy: string, modName?: string, modInfo?: IModInfo) {
  const subType = 'mayUpdateModPresetData';
  const sdkCtx = getSdkCtx(platform);
  try {
    if (!modName) {
      // 表示刷已映射的全部模块
      await updateRegisteredModsPresetData(platform, setBy);
      return;
    }

    // 未在用户的模块声明表里时忽略掉
    if (!isModMapped(platform, modName)) {
      log({ subType, desc: `ignore not configured mod ${modName}` });
      return;
    }

    // 复用外部透传的 modInfo，此处写 null 是为了将 targetModInfo 转为正确的类型 IModInfo | null
    let targetModInfo = modInfo || null;
    if (!modInfo) {
      targetModInfo = await fetchModInfo(modName, { platform });
    }
    if (!targetModInfo) {
      log({ subType, desc: `no modInfo for ${modName}` });
    }
    await updateModPresetData(sdkCtx.platform, setBy, targetModInfo);
  } catch (err: any) {
    const { reporter } = getGlobalConfig();
    reporter.reportError({ message: err.stack, desc: 'err-update-mod-info', data: platform });
    const errMsg = err.message;
    log({ subType, desc: 'err occurred', data: { setBy, modName, errMsg, platform } });
  }
}

/**
 * 拉取所有已注册模块对应的模块信息列表（通过 mapNodeMods、preloadMiddleware、initMiddleware 完成的注册）
 */
export async function fetchRegisteredModInfoList(platform: string, options?: IFetchModMetaOptions) {
  const sdkCtx = getSdkCtx(platform);
  const tasks = sdkCtx.modNames.map(async (name) => {
    const fetchOptions = options || getMappedModFetchOptions(name, platform);
    const { fallback, nodeModName } = mapNodeModsManager.getFallbackData(name, platform);
    const { force, path } = fallback;
    if (force) {
      if (!path) {
        throw new Error('Set fallback.force as true but forget to supply path');
      }
      importNodeModByPath(nodeModName, path);
      return null;
    }

    try {
      const modInfo = await fetchModInfo(name, fetchOptions);
      return modInfo;
    } catch (err: any) {
      if (!path) {
        throw err;
      }
      importNodeModByPath(nodeModName, path);
    }
  });
  const list = await Promise.all(tasks);
  const modInfoList = list.filter(Boolean) as IModInfo[];

  return modInfoList;
}

/**
 * 更新模块预置数据，包含服务于渲染的预置数据，和服务于后台模块热更新的模块实例对象
 */
async function updateModPresetData(platform: string, setBy: string, modInfo: IModInfo | null) {
  if (!modInfo) {
    return;
  }
  const sdkCtx = getSdkCtx(platform);
  markAppDesc(setBy, modInfo);
  // 以 preload 模式启动，需优先更新可能存在的 server 模块
  if (sdkCtx.isPreloadMode) {
    log({ subType: 'updateModPresetData', desc: `updateForServerFirst for ${modInfo.name}` });
    await presetDataMgr.updateForServerFirst(platform, modInfo);
    return;
  }

  presetDataMgr.updateForClient(platform, modInfo);
}

/**
 * 获取 preload 模式下的模块信息列表，此模式下会优先尝试更新可能存在的 server 模块缓存
 */
export async function getModeInfoListForPreloadMode(platform: string, mustBeServerMod?: boolean) {
  const modInfoList = await fetchRegisteredModInfoList(platform);
  modInfoList.forEach((info) => {
    triggerHook(HOOK_TYPE.onInitialHelMetaFetched, { platform, helModName: info.name, version: info.meta.version.version_tag }, platform);
  });
  await Promise.all(modInfoList.map((modInfo) => presetDataMgr.updateForServerFirst(platform, modInfo, { mustBeServerMod })));
  return modInfoList;
}

/**
 * 获取本地缓存的模块信息
 */
export function getModInfo(modName: string) {
  return presetDataMgr.getCachedModInfo(modName);
}

/**
 * 依据分支或灰度标记获取预埋数据
 */
export async function getPresetDataByHelOptions(options: IFetchModMetaOptions) {
  const { platform = PLATFORM } = options;
  // 实例化 PresetData 时设置 allowOldVer=true，表示灰度用户读取的预置数据可以跳过版本比较规则
  // 方便开发可以测试任意版本的前端代码
  const presetData = new PresetData(true);
  const modInfoList = await fetchRegisteredModInfoList(platform, options);
  modInfoList.forEach((modInfo) => presetData.updateForClient(platform, modInfo));
  return presetData;
}

/**
 * 获取默认的预置数据
 */
export function getPresetData() {
  return presetDataMgr;
}
