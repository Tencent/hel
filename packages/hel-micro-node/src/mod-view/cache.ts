import { CTX_ENV, HOOK_TYPE, PLATFORM, SERVER_INFO } from '../base/consts';
import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import type { IFetchModMetaOptions, IModInfo } from '../base/types';
import { getMappedModFetchOptions, isModMapped } from '../context/facade';
import { triggerHook } from '../context/hooks';
import { getSdkCtx } from '../context/index';
import { setMetaCache } from '../context/meta-cache';
import { importNodeModByPath } from '../mod-node';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { fetchModInfo } from '../server-mod/mod-meta';
import { getBackupModInfo } from '../server-mod/mod-meta-backup';
import { isRunInJest } from '../test-util/jest-env';
import { SET_BY, UPDATE_INTERVAL } from './consts';
import { PresetData, presetDataMgr } from './preset-data';
import { subHelpackModChange } from './watch';

const { containerName, workerId } = SERVER_INFO;

function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'HelModCache' });
}

/** 使用 server 镜像里的数据（来自 server 构建产物里的 hel-meta.json 文件）来生成预置数据，以此作为兜底数据 */
export function loadBackupHelMod(platform?: string) {
  const sdkCtx = getSdkCtx(platform);
  const modInfoList: IModInfo[] = [];
  try {
    sdkCtx.modNames.forEach((name) => {
      const modInfo = getBackupModInfo(sdkCtx.platform, name);
      updateModPresetDataSync(sdkCtx.platform, SET_BY.init, modInfo);
      modInfoList.push(modInfo);
    });
    return modInfoList.filter((v) => !!v);
  } catch (err: any) {
    // 允许测试环境运行或本地运行无备份 meta，当没有时会自动拉取最新的 meta 数据，这样可支持用测试环境来运行正式环境构建的镜像
    // 注：正式环境无备份 meta 会报错，这样才能保证线上环境镜像回滚时有稳定的版本最低要求关系存在
    if (CTX_ENV.isProd) {
      throw err;
    }
    mayUpdateModPresetData(sdkCtx.platform, SET_BY.init).catch((err) => {
      sdkCtx.reporter.reportError(err.stack, 'err-loadBackupHelMod');
    });
  }
  return modInfoList;
}

let isIntervalUpdateCalled = false;

/** 开启定时器更新模块缓存，兜底 redis 订阅出问题 */
export function enableIntervalUpdate(platform: string) {
  // jest 单测时为避免如下警告，也会不启动 定时器
  // Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Timeout
  if (isIntervalUpdateCalled || isRunInJest()) {
    return;
  }

  isIntervalUpdateCalled = true;
  const sdkCtx = getSdkCtx(platform);
  setInterval(() => {
    mayUpdateModPresetData(platform, SET_BY.timer).catch((err) => {
      sdkCtx.reporter.reportError(err.stack, 'err-intervalUpdate');
    });
  }, UPDATE_INTERVAL);
}

function getCanFetchNewVersionData(platform: string, modName: string) {
  const fetchOptions = getMappedModFetchOptions(modName, platform);
  const { ver: userSpecifiedVer } = fetchOptions || {};
  if (!userSpecifiedVer) {
    return true;
  }

  // 指定了版本号，还未拉取数据
  const cachedModInfo = presetDataMgr.getCachedModInfo(modName);
  if (!cachedModInfo) {
    return true;
  }

  // 如指定了版本号，和已拉取数据的版本号相等，则不用再拉取新版本数据
  const cachedVer = cachedModInfo.meta.version?.sub_app_version;
  if (userSpecifiedVer === cachedVer) {
    return false;
  }

  return true;
}

/**
 * 接收到了hel模块元数据变化的消息
 */
async function handleHelModChanged(platform: string, modName: string) {
  const sdkCtx = getSdkCtx(platform);
  try {
    const canFetchNew = getCanFetchNewVersionData(platform, modName);
    // 如用户在 mapNodeMods 时写死了版本号，则此处不再响应变化
    if (!canFetchNew) {
      return;
    }

    const fetchOptions = getMappedModFetchOptions(modName, platform);
    const modInfo = await fetchModInfo(modName, fetchOptions);
    if (!modInfo) {
      return;
    }
    // 如设置了 careAllModsChange=true ，内部会缓存此模块元数据，以便提速给用户使用的 fetchModMeta 接口响应
    if (sdkCtx.careAllModsChange) {
      setMetaCache(modInfo.fullMeta);
    }
    mayUpdateModPresetData(platform, SET_BY.watch, modName, modInfo);
  } catch (err: any) {
    sdkCtx.reporter.reportError(err.stack, 'err-handle-hel-mod-changed');
    const errMsg = err.message;
    log({ subType: 'handleHelModChanged', desc: 'err occurred', data: { modName, errMsg, platform } });
  }
}

/** 开启消息订阅，接收到模块变化信号时刷新内存里的数据 */
export function listenHelModChange(platform: string) {
  subHelpackModChange(platform, (params) => {
    log({ subType: 'listenHelModChange', desc: 'trigger updateModInfo', data: { params, platform } });
    handleHelModChanged(platform, params.modName);
  });
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
 * 不传递具体名称则更新注册的所有模块
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
    sdkCtx.reporter.reportError(err.stack, 'err-update-mod-info');
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
        throw new Error('Set fallback.force true but forget supply path');
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

function markAppDesc(setBy: string, modInfo: IModInfo) {
  const modInfoVar = modInfo;
  /** 借用暂无意义的 desc 记录一些信息，setBy 目前有 init timer watch */
  modInfoVar.meta.app.desc = `set by [${setBy}], from container [${containerName}] worker [${workerId}]`;
}

/**
 * 同步缓存模块相关预置数据，由 loadBackupHelMod 调用，此场景本地磁盘有备份文件，故可用同步模式来缓存
 */
function updateModPresetDataSync(platform: string, setBy: string, modInfo: IModInfo | null) {
  if (!modInfo) {
    return;
  }
  markAppDesc(setBy, modInfo);
  presetDataMgr.updateForClient(platform, modInfo);
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
    triggerHook(HOOK_TYPE.onInitialHelMetaFetched, { helModName: info.name, version: info.meta.version.version_tag }, platform);
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
