import type { Platform } from 'hel-types';
import type { IInnerPreFetchOptions, ICustom } from '../types';
import { log, getAppMeta } from 'hel-micro-core';

interface IVerMatchOptions {
  platform: Platform;
  emitVer: string;
  inputVer: string;
  projectId?: string;
}

/**
 * @returns true，匹配成功，false，匹配失败
 */
export function isEmitVerMatchInputVer(appName: string, options: IVerMatchOptions) {
  const { platform, emitVer, inputVer, projectId } = options;
  const appMeta = getAppMeta(appName, platform);
  // 模块版本信息未发射上来的话，当做匹配成功
  if (!emitVer) {
    log('[[ isEmitVerMatchInputVer ]] emitVer should not be null');
    return true;
  }

  // 用在线版本或灰度版本比较
  if (!inputVer) {
    // 判断 projectId 是否传入，传入的话看 proj_ver.map[projectId].o 的值是否存在且是否和 emitVer 相等
    if (projectId && appMeta) {
      const verMap = appMeta.proj_ver?.map || {};
      const config = verMap[projectId];
      if (config) {
        return emitVer === config.o || emitVer === config.b;
      }
    }
    return emitVer === appMeta?.online_version || emitVer === appMeta?.build_version;
  }

  return emitVer === inputVer;
}


export function isCustomValid(custom: IInnerPreFetchOptions['custom']): custom is ICustom {
  if (custom) {
    const { enable = true, host } = custom;
    return !!(host && enable);
  }
  return false;
}
