import { getVerLib, getVerLoadStatus, setVerLoadStatus } from '../core';
import { helLoadStatus } from '../core/consts';
import { log } from '../core/microDebug';
import loadApp from './loadApp';
import waitAppEmit from './waitAppEmit';

interface IPrefetchOptions {
  custom: string;
}

export async function preFetchLib(appName: string, options: IPrefetchOptions) {
  const lib = getVerLib(appName, options);

  if (lib) {
    return lib;
  }

  let emitApp = null;
  const currentLoadStatus = getVerLoadStatus(appName, options);
  // 已加载完毕，（子应用js已开始执行）, 未拿到数据说明应用有异步依赖，继续等一下，直到拿到数据
  if (currentLoadStatus === helLoadStatus.LOADED) {
    emitApp = await waitAppEmit(appName, options);
    log(`[[ preFetchLib ]] return emit app:`, appName, options, emitApp);
    return { emitApp, msg: '' };
  }

  let loadAssetsStarter: any = null;
  // 还未开始加载，标记加载中，防止连续的 preFetch 调用重复触发 loadApp
  if (currentLoadStatus !== helLoadStatus.LOADING) {
    setVerLoadStatus(appName, helLoadStatus.LOADING, options);
    loadAssetsStarter = await loadApp(appName, { ...options, controlLoadAssets: true });
  }

  // 正在加载中，等待模块获取
  emitApp = await waitAppEmit(appName, options, loadAssetsStarter);
  log(`[[ ${preFetchLib} ]] return fetch&emit app:`, appName, options, emitApp);
}
