import defaults from '../consts/defaults';
import { PLAT_UNPKG } from '../consts/logic';
import { getHelEventBus, getPlatformConfig, getVerLoadStatus, helEvents, helLoadStatus, log, setVerLoadStatus } from '../deps/helMicroCore';
import type { IEmitAppInfo } from '../deps/helTypes';
import { getDefaultPlatform } from '../deps/plat';
import type { BatchGetFn } from '../services/api';
import * as apiSrv from '../services/api';
import { cacheApp, getAppFromRemoteOrLocal, loadApp } from '../services/app';
import * as logicSrv from '../services/logic';
import type {
  AnyRecord,
  BatchAppNames,
  IBatchPreFetchLibOptions,
  IInnerPreFetchOptions,
  IPreFetchAppOptions,
  IPreFetchLibOptions,
  VersionId,
} from '../types';
import { purify } from '../util';

type LoadAssetsStarter = (() => void) | null;

function makePreFetchOptions(isLib: boolean, options?: IPreFetchLibOptions | VersionId) {
  const optionsVar: IInnerPreFetchOptions = typeof options === 'string' ? { versionId: options } : { ...(options || {}) };
  optionsVar.platform = getDefaultPlatform(optionsVar.platform);
  optionsVar.isLib = isLib;
  return optionsVar;
}

async function waitAppEmit(appName: string, innerOptions: IInnerPreFetchOptions, loadAssetsStarter?: LoadAssetsStarter) {
  const eventBus = getHelEventBus();
  const { platform, isLib = false, versionId, projectId, strictMatchVer } = innerOptions;
  const eventName = isLib ? helEvents.SUB_LIB_LOADED : helEvents.SUB_APP_LOADED;

  let handleAppLoaded: any = null;
  await new Promise((resolve, reject) => {
    handleAppLoaded = (appInfo: IEmitAppInfo) => {
      logicSrv.judgeAppReady(
        appInfo,
        { appName, platform, versionId, projectId, isLib, next: resolve, error: reject, strictMatchVer },
        innerOptions,
      );
    };

    // 先监听，再触发资源加载，确保监听不会有遗漏
    eventBus.on(eventName, handleAppLoaded);
    if (loadAssetsStarter) {
      loadAssetsStarter();
    }
  });

  if (handleAppLoaded) {
    eventBus.off(eventName, handleAppLoaded);
  }
  const emitAppOrLib = logicSrv.getLibOrApp(appName, innerOptions);
  return emitAppOrLib;
}

/**
 * 预抓取一些应用js脚本并解析执行，返回应用暴露的模块或组件
 * @param appName
 * @param preFetchOptions
 * @returns
 */
async function innerPreFetch(appName: string, preFetchOptions: IInnerPreFetchOptions) {
  let emitApp: null | IEmitAppInfo = null;
  const { versionId, platform, isLib } = preFetchOptions;
  const fixedInnerOptions = { ...preFetchOptions };
  const fnName = isLib ? 'preFetchLib' : 'preFetchApp';
  try {
    const conf = getPlatformConfig(platform);
    // 用户未传的话走平台默认值 true
    fixedInnerOptions.strictMatchVer = preFetchOptions.strictMatchVer ?? conf.strictMatchVer;
    // 默认为 indexedDB，不支持 indexedDB 的环境会降级为 localStorage
    fixedInnerOptions.storageType = preFetchOptions.storageType || 'indexedDB';

    emitApp = logicSrv.getLibOrApp(appName, fixedInnerOptions);
    if (emitApp) {
      // 支持用户拉取同一个模块的多个版本，但是实际工程里不鼓励这么做
      if (!versionId || (versionId && emitApp.versionId === versionId)) {
        log(`[[ ${fnName} ]] return cached app:`, appName, fixedInnerOptions);
        return { emitApp, msg: '' };
      }
    }

    let loadAssetsStarter: any = null;
    const currentLoadStatus = getVerLoadStatus(appName, fixedInnerOptions);
    // 已加载完毕，（子应用js已开始执行）, 未拿到数据说明应用有异步依赖，继续等一下，直到拿到数据
    if (currentLoadStatus === helLoadStatus.LOADED) {
      emitApp = await waitAppEmit(appName, fixedInnerOptions);
      log(`[[ ${fnName} ]] return emit app:`, appName, fixedInnerOptions, emitApp);
      return { emitApp, msg: '' };
    }

    // 还未开始加载，标记加载中，防止连续的 preFetch 调用重复触发 loadApp
    if (currentLoadStatus !== helLoadStatus.LOADING) {
      setVerLoadStatus(appName, helLoadStatus.LOADING, fixedInnerOptions);
      loadAssetsStarter = await loadApp(appName, { ...fixedInnerOptions, controlLoadAssets: true });
    }

    // 正在加载中，等待模块获取
    emitApp = await waitAppEmit(appName, preFetchOptions, loadAssetsStarter);
    log(`[[ ${fnName} ]] return fetch&emit app:`, appName, fixedInnerOptions, emitApp);
    return { emitApp, msg: '' };
  } catch (err: any) {
    return { emitApp, msg: err.message };
  }
}

/**
 * 等待 helEvents.SUB_LIB_LOADED 信号发射的模块对象
 * 由 hel-lib-proxy 的 libReady 函数发射上来
 * 这里采取相信用户传递的是正确的模块名原则，故返回类型不写为 Promise<T | null>，
 * 如用户需要有空值返回断言处理，可以写为
 * ```js
 *  const lib = await preFetchLib<Lib | null>('remote-lib-tpl');
 * ```
 */
export async function preFetchLib<T extends AnyRecord = AnyRecord>(appName: string, options?: IPreFetchLibOptions | VersionId): Promise<T> {
  const targetOpts = makePreFetchOptions(true, options);
  const { emitApp, msg } = await innerPreFetch(appName, targetOpts);
  let appProperties = emitApp?.appProperties;

  if (!appProperties && targetOpts.onLibNull) {
    const fallbackLib = targetOpts.onLibNull(appName, { versionId: targetOpts.versionId });
    if (fallbackLib) {
      appProperties = fallbackLib;
    }
  }
  if (!appProperties) {
    const details = msg ? ` details : ${msg}` : '';
    throw new Error(`preFetchLib ${appName} fail, it may be an invalid module!${details}`);
  }
  return appProperties as unknown as T;
}

/**
 * 等待 helEvents.SUB_APP_LOADED 信号发射的应用根组件
 * 由中间层ui适配库自己实现，如 hel-micro-react 的 renderApp
 */
export async function preFetchApp(appName: string, options?: IPreFetchAppOptions | VersionId) {
  const targetOpts = makePreFetchOptions(false, options);
  const result = await innerPreFetch(appName, targetOpts);
  return result.emitApp;
}

interface IBatchPreFetchLibCommon {
  batchGetFn?: BatchGetFn;
  platform?: string;
  enableDiskCache?: IBatchPreFetchLibOptions['enableDiskCache'];
  enableSyncMeta?: IBatchPreFetchLibOptions['enableSyncMeta'];
  storageType?: IBatchPreFetchLibOptions['storageType'];
  versionIdList?: string[];
  projectIdList?: string[];
  branchIdList?: string[];
}

/**
 * 批量预加载模块，特别注意一下两点：
 * 1 因服务器端控制，一次性最多只能获取 8 个
 * 2 该接口仅支持 hel-pack（包括其他私有部署版）
 */
export async function batchPreFetchLib<T extends AnyRecord[] = AnyRecord[]>(
  appNames: BatchAppNames,
  batchOptions?: {
    /** 针对单个应用的设置 */
    preFetchConfigs?: Record<string, IBatchPreFetchLibOptions | VersionId>;
    /** 批量获取的通用设置 */
    common?: IBatchPreFetchLibCommon;
  },
): Promise<T> {
  const optionsMap = batchOptions?.preFetchConfigs || {};
  const commonOptions: IBatchPreFetchLibCommon = { ...(batchOptions?.common || {}) };
  const platform = getDefaultPlatform(commonOptions.platform);
  const { versionIdList = [], projectIdList = [], branchIdList = [] } = commonOptions;
  const targetVerList: string[] = [];
  const targetProjList: string[] = [];
  const targetBranchList: string[] = [];

  if (platform === PLAT_UNPKG) {
    throw new Error('only support platform hel!');
  }
  if (appNames.length > 8) {
    throw new Error('only support 8 appName at most!'); // 平台默认只支持最多拉8个
  }

  const shouldFetchAppNames: string[] = [];
  const ensuredOptionsMap: Record<string, IBatchPreFetchLibOptions> = {};
  let idx = 0;
  // why hot for in: for..in loops iterate over the entire prototype chain, which is virtually never what you want
  for (const name of appNames) {
    const customOptions = optionsMap[name];
    let options: IInnerPreFetchOptions = {
      platform,
      versionId: versionIdList[idx] || '',
      projectId: projectIdList[idx] || '',
      branchId: branchIdList[idx] || '',
    };

    if (typeof customOptions === 'string' && customOptions) {
      options.versionId = customOptions;
    } else if (typeof customOptions === 'object' && customOptions) {
      options = { ...options, ...purify(customOptions) };
      options.platform = platform; // 平台值优先使用 common 设定值
    }
    ensuredOptionsMap[name] = options;

    options.enableDiskCache = options.enableDiskCache ?? commonOptions.enableDiskCache ?? defaults.ENABLE_DISK_CACHE;
    options.enableSyncMeta = options.enableSyncMeta ?? commonOptions.enableSyncMeta ?? defaults.ENABLE_SYNC_META;
    options.storageType = options.storageType ?? commonOptions.storageType ?? defaults.STORAGE_TYPE;
    const appData = await getAppFromRemoteOrLocal(name, options, { callRemote: false });

    if (!appData) {
      shouldFetchAppNames.push(name);
      // for ts check, add || ''
      targetVerList[idx] = options.versionId || '';
      targetProjList[idx] = options.projectId || '';
      targetBranchList[idx] = options.branchId || '';
    }
    idx += 1;
  }

  commonOptions.versionIdList = versionIdList;
  commonOptions.projectIdList = projectIdList;
  commonOptions.branchIdList = targetBranchList;

  const appDataList = await apiSrv.batchGetSubAppAndItsVersion(shouldFetchAppNames, commonOptions);
  // 设置到内存里，方便后续 preFetchLib 执行时可以跳过请求阶段
  appDataList.forEach(({ app, version }) => {
    const loadOptions = ensuredOptionsMap[app.name] || {};
    cacheApp(app, { appVersion: version, platform, toDisk: loadOptions.enableDiskCache, loadOptions });
  });

  const tasks = appNames.map((name) => {
    // 刻意剔除 branchId，让 preFetchLib 内部逻辑能命中 cacheApp 逻辑生成的缓存
    const { branchId, ...rest } = ensuredOptionsMap[name];
    return preFetchLib(name, rest);
  });
  const mods = await Promise.all(tasks);
  // @ts-ignore, trust user specified AnyRecord[]
  return mods;
}
