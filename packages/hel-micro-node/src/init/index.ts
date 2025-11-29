import { ConcurrencyGuard } from '@tmicro/f-guard';
import { HEL_DIR_KEYS, PLATFORM } from '../base/consts';
import type {
  IInitMiddlewareOptions,
  IModConf,
  IModInfo,
  INodeModMapper,
  IPlatformConfig,
  IPreloadMiddlewareOptions,
  ISDKGlobalConfig,
} from '../base/types';
import { hasAnyProps, safeGet } from '../base/util';
import { getSdkCtx, mergeConfig, mergeOptions } from '../context';
import { mergeGlobalConfig } from '../context/global-config';
import { setMetaCache } from '../context/meta-cache';
import { getModeInfoListForPreloadMode, listenHelModChange, loadBackupHelMod, mayStartupIntervalModUpdate } from '../mod-planner/facade';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { HelModViewMiddleware } from './inject';

/** 在中间件生成流程里，此变量用于控制 initCommon 只能调用一次 */
let isInitCommonCalled = false;

let middleware: HelModViewMiddleware;

const callLabels = {
  initMiddleware: 'initMiddleware',
  preloadMiddleware: 'preloadMiddleware',
  preloadHelMods: 'preloadHelMods',
};

const guard = new ConcurrencyGuard();

/** 公共的初始化逻辑 */
function initCommon(options: IPreloadMiddlewareOptions, label: string) {
  const forMiddleware = [callLabels.initMiddleware, callLabels.preloadMiddleware].includes(label);
  // 对于中间件生成流程，控制此方法只能被调用一次
  if (forMiddleware && isInitCommonCalled) {
    throw new Error(`initCommon can only been called one time, the second call comes from ${label}!`);
  }
  // 记录是否生产环境值，或将来要扩展记录的其他环境变量
  const { platform = PLATFORM } = options;
  isInitCommonCalled = true;

  // 合并用户透传的参数到 sdkCtx 全局对象里
  mergeOptions(options);
  // 开始监听hel模块变化
  listenHelModChange(platform);
  // 开启定时更新做补偿，内部会自动比较版本避免冗余更新
  mayStartupIntervalModUpdate(platform);
}

function checkGlobalConfig(config: ISDKGlobalConfig) {
  if (isSetGlobalConfigCalled) {
    throw new Error('setGlobalConfig can be called only one time');
  }
  if (hasAnyProps(config, HEL_DIR_KEYS) && !config.dangerouslySetDirPath) {
    throw new Error(`Cannot change any of these params(${HEL_DIR_KEYS}) without dangerouslySetDirPath=true`);
  }
}

/** 控制各平台的 setPlatformConfig 只能调用一次 */
const isSetPlatformConfigCalledDict: Record<string, boolean> = {};

/**
 * 对平台设置相关配置项
 */
export function setPlatformConfig(config: IPlatformConfig) {
  const { platform = PLATFORM } = config;
  if (isSetPlatformConfigCalledDict[platform]) {
    throw new Error('setPlatformConfig can be called only one time');
  }
  isSetPlatformConfigCalledDict[platform] = true;
  mergeConfig(config);
}

/** 控制 setGlobalConfig 只能调用一次 */
let isSetGlobalConfigCalled = false;

/**
 * 针对 sdk 设置一些基础配置项
 */
export function setGlobalConfig(config: ISDKGlobalConfig) {
  checkGlobalConfig(config);
  isSetGlobalConfigCalled = true;
  mergeGlobalConfig(config);
}

/**
 * preloadMiddleware 包含了 initMiddleware 过程，多了一个预加载 hel 模块的过程，
 * 调用后可通过同步方法 getMiddleware 获取到中间件实例，
 * 注（initMiddleware 和 preloadMiddleware 只能调用其中一个）
 * 推荐该方法调用时机在 server 服务启动之前，这样可保证：
 * 1 项目代码里可安全使用 requireMod 同步方法来获取远程模块；
 * 2 server模块和客户端模块版本是一致的；
 */
export async function preloadMiddleware(options: IPreloadMiddlewareOptions) {
  const sdkCtx = getSdkCtx(options.platform);
  sdkCtx.isPreloadMode = true;
  initCommon(options, callLabels.preloadMiddleware);
  const modInfoList = await getModeInfoListForPreloadMode(sdkCtx.platform);
  const helModViewMiddleware = new HelModViewMiddleware();
  middleware = helModViewMiddleware;
  return { helModViewMiddleware, modInfoList };
}

export function getMiddleware() {
  if (!middleware) {
    throw new Error('preloadMiddleware is not called or is still in calling process!');
  }
  return middleware;
}

/**
 * 根据用户配置实例化一个 override-render 中间件
 */
export function initMiddleware(options: IInitMiddlewareOptions) {
  initCommon(options, callLabels.initMiddleware);
  // 载入hel模块兜底配置
  const modInfoList = loadBackupHelMod(options.platform);
  const helModViewMiddleware = new HelModViewMiddleware();
  return { helModViewMiddleware, modInfoList };
}

/**
 * 对列表里的 hel 模块执行预加载
 */
export async function preloadHelMods(helModNames: string[], inputPlat?: string) {
  const sdkCtx = getSdkCtx(inputPlat);
  const { platform } = sdkCtx;
  if (sdkCtx.beforePreloadOnce && !sdkCtx.helpackSocketUrl) {
    const result = await guard.call(platform, sdkCtx.beforePreloadOnce);
    if (result && !sdkCtx.helpackSocketUrl) {
      const { helpackSocketUrl } = result;
      mergeConfig({ helpackSocketUrl, platform });
    }
  }

  const mod2conf: Record<string, IModConf> = {};
  helModNames.forEach((name) => {
    const fetchOptions = mapNodeModsManager.getFetchOptions(name, platform);
    // 同步 fetchOptions 到 sdkCtx 中
    if (fetchOptions) {
      mod2conf[name] = { fetchOptions: { ...fetchOptions, platform } };
    } else {
      mod2conf[name] = {};
    }
  });

  initCommon({ mod2conf, platform }, callLabels.preloadHelMods);
  sdkCtx.isPreloadMode = true;
  // 预加载用户配置的hel模块
  const modInfoList = await getModeInfoListForPreloadMode(platform, true);
  // 缓存起来，提速 fetchModMeta
  modInfoList.forEach((v) => setMetaCache(v.fullMeta));
  return modInfoList;
}

/**
 * 对 mapNodeMods 映射的 hel 模式执行预加载，
 * 多次执行的话可能返回空数组，内部只会对未触发 preload 的 hel 模块执行预加载
 * ```text
 * 注：preloadMappedData 和 (initMiddleware, preloadMiddleware) 区别是：
 * preloadMappedData 只负责监听 hel 模块变化并代理 node 模块，无中间件初始化功能，不会重写 render 方法；
 * (initMiddleware, preloadMiddleware) 包含有 preloadMappedData 功能，同时还会额外返回 render 中间件，
 * 用于修改渲染层返回结果之用；
 * ```
 */
export async function preloadMappedData() {
  const plats = mapNodeModsManager.getMappedPlatforms();
  let list: IModInfo[] = [];

  await Promise.all(
    plats.map(async (platform) => {
      const untriggeredHelModNames = mapNodeModsManager.getHelModNames(platform, true);
      untriggeredHelModNames.forEach((v) => mapNodeModsManager.setIsPreloadTriggered(v, platform));
      const modInfoList = await preloadHelMods(untriggeredHelModNames, platform);
      list = list.concat(modInfoList);
    }),
  );

  return list;
}

/**
 * 映射并预加载 hel 模块数据， mapAndPreload 合并了 mapNodeMods 和 preloadMappedData 调用
 */
export async function mapAndPreload(modMapper: INodeModMapper) {
  mapNodeModsManager.setModMapper(modMapper);
  const helModNameInfos: { helModName: string; platform: string }[] = [];
  const plat2helModNames = {};
  Object.keys(modMapper).forEach((nodeModName) => {
    const { helModName, platform, fallback } = mapNodeModsManager.getNodeModData(nodeModName);
    const helModNames = safeGet<string[]>(plat2helModNames, platform, []);
    // 多个node模块可以映射到同一个hel模块（基于子路径），故这里要去重
    // 例如: mod1: hel-mod/sub-path1, mod2: hel-mod/sub-path2
    if (!helModNames.includes(helModName)) {
      helModNameInfos.push({ platform, helModName });
      helModNames.push(helModName);
    }
  });

  helModNameInfos.forEach((v) => mapNodeModsManager.setIsPreloadTriggered(v.helModName, v.platform));

  const plats = Object.keys(plat2helModNames);
  const aoaList = await Promise.all(plats.map((plat) => preloadHelMods(plat2helModNames[plat], plat)));
  let modInfoList: IModInfo[] = [];
  aoaList.forEach((list) => {
    modInfoList = modInfoList.concat(list);
  });
  return modInfoList;
}
