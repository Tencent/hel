import type { IPlatformConfig } from '../deps/helMicroCore';
import * as core from '../deps/helMicroCore';
import type { Platform } from '../deps/helTypes';

export function getHelEventBus() {
  return core.getHelEventBus();
}

export function getSharedCache(platform?: Platform) {
  return core.getSharedCache(platform);
}

/**
 * 3.3.2+，接口不再自动设置默认平台，非hel平台的模块，用户在获取或暴露模块时，
 * 需在 preFetchLib preFetchApp libReady exposeLib 接口里显式的传递平台值
 * @param initOptions
 */
export function init(initOptions: IPlatformConfig) {
  const { platform, ...restOptions } = initOptions;
  core.initPlatformConfig(restOptions, platform);
}
