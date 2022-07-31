import type { Platform } from 'hel-types';
import { log, getAppMeta } from 'hel-micro-core';

/**
 * @returns true，匹配成功，false，匹配失败
 */
export function isEmitVerMatchInputVer(appName: string, platform: Platform, emitVer: string, inputVer: string) {
  const appMeta = getAppMeta(appName, platform);
  // 模块版本信息未发射上来的话，当做匹配成功
  if (!emitVer) {
    log('[[ isEmitVerMatchInputVer ]] emitVer should not be null');
    return true;
  }

  // 用在线版本或灰度版本比较
  if (!inputVer) {
    return emitVer === appMeta?.online_version || emitVer === appMeta?.build_version;
  }

  return emitVer === inputVer;
}
