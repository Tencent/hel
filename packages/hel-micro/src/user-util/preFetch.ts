import type { IEmitAppInfo } from 'hel-types';
import type { IGetOptions } from 'hel-micro-core';
import type { IInnerPreFetchOptions, IPreFetchLibOptions, IPreFetchAppOptions, AnyRecord } from '../types';
import {
  helLoadStatus, helEvents, getVerLoadStatus, getHelEventBus, setVerLoadStatus, log, getPlatformConfig,
} from 'hel-micro-core';
import { loadApp } from '../services/app';
import * as logicSrv from '../services/logic';

const eventBus = getHelEventBus();

interface IWaitOptions extends IGetOptions {
  isLib: boolean;
  loadAssetsStarter?: (() => void) | null;
}


async function waitAppEmit(appName: string, waitOptions: IWaitOptions) {
  const { platform, isLib, loadAssetsStarter, versionId, strictMatchVer } = waitOptions;
  const eventName = isLib ? helEvents.SUB_LIB_LOADED : helEvents.SUB_APP_LOADED;

  let handleAppLoaded: any = null;
  await new Promise((resolve) => {
    handleAppLoaded = (appInfo: IEmitAppInfo) => {
      logicSrv.judgeAppReady(appInfo, { appName, platform, versionId, isLib, next: resolve, strictMatchVer });
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
  const emitAppOrLib = logicSrv.getLibOrApp(appName, isLib, { platform, versionId, strictMatchVer });
  return emitAppOrLib;
}


/**
 * 预抓取一些应用js脚本并解析执行，返回应用暴露的模块或组件
 * @param appName
 * @param iOptions
 * @returns
 */
async function innerPreFetch(appName: string, iOptions?: IInnerPreFetchOptions) {
  let emitApp: null | IEmitAppInfo = null;
  try {
    const options = iOptions || {};
    const { isLib = false, versionId } = options;
    const conf = getPlatformConfig(options.platform);
    const platform = conf.platform;
    // 用户未传的话走平台默认值 true
    const strictMatchVer = options.strictMatchVer ?? conf.strictMatchVer;
    const waitOptions = { platform, isLib, versionId, strictMatchVer };
    const getOptions: IGetOptions = { platform, versionId, strictMatchVer };

    emitApp = logicSrv.getLibOrApp(appName, isLib, getOptions);
    if (emitApp) {
      // 支持用户拉取同一个模块的多个版本，但是实际工程里不鼓励这么做
      if (
        !versionId
        || (versionId && emitApp.versionId === versionId)
      ) {
        log('[[ preFetch ]] hit cached app', appName, iOptions);
        return emitApp;
      }
    }

    let loadAssetsStarter: any = null;
    const currentLoadStatus = getVerLoadStatus(appName, getOptions);
    // 已加载完毕，（子应用js已开始执行）, 未拿到数据说明应用有异步依赖，继续等一下，直到拿到数据
    if (currentLoadStatus === helLoadStatus.LOADED) {
      emitApp = await waitAppEmit(appName, waitOptions);
      log('[[ preFetch ]] return emit app', appName, iOptions);
      return emitApp;
    }

    // 还未开始加载，标记加载中，防止连续的 preFetch 调用重复触发 loadApp
    if (currentLoadStatus !== helLoadStatus.LOADING) {
      setVerLoadStatus(appName, helLoadStatus.LOADING, getOptions);
      loadAssetsStarter = await loadApp(appName, { ...options, controlLoadAssets: true });
    }

    emitApp = await waitAppEmit(appName, { ...waitOptions, loadAssetsStarter });
    log('[[ preFetch ]] return fetch&emit app', appName, iOptions);
    return emitApp;
  } catch (err) {
    log('[[ preFetch ]] err', err);
    return emitApp;
  }
}


/**
 * 等待 helEvents.SUB_LIB_LOADED 信号发射的模块对象
 * 由 hel-lib-proxy 的 libReady 函数发射上来
 * 这里采取相信用户传递的是正确的模块名原则，故返回类型不写为 Promise<T | null>，
 * 如用户需要有空值返回断言处理，可以写为
 * ```js
 *  const lib = await preFetchLib(Lib | null)('remote-lib-tpl');
 * ```
 */
export async function preFetchLib<T extends AnyRecord = AnyRecord>(
  appName: string, options?: IPreFetchLibOptions,
): Promise<T> {
  const optionsCopy = { ...(options || {}), isLib: true };
  const appInfo = await innerPreFetch(appName, optionsCopy);
  if (!appInfo) {
    throw new Error(`preFetchLib ${appName} fail, it may be an invalid module!`);
  }
  return appInfo.appProperties as unknown as T;
}


/**
 * 等待 helEvents.SUB_APP_LOADED 信号发射的应用根组件
 * 由中间层ui适配库自己实现，如 hel-micro-react 的 renderApp
 */
export async function preFetchApp(appName: string, options?: IPreFetchAppOptions) {
  const optionsCopy = { ...(options || {}), isLib: false };
  const appInfo = await innerPreFetch(appName, optionsCopy);
  return appInfo;
};
