import { getAppMeta, log } from '../deps/helMicroCore';
import type { Platform } from '../deps/helTypes';

interface IVerMatchOptions {
  emitVer: string;
  inputVer: string;
  strictMatchVer?: boolean;
  platform?: Platform;
  projectId?: string;
}

/**
 * @returns true，匹配成功，false，匹配失败
 */
export function isEmitVerMatchInputVer(appName: string, options: IVerMatchOptions) {
  const { platform, emitVer, inputVer, projectId, strictMatchVer } = options;
  const appMeta = getAppMeta(appName, platform);
  if (strictMatchVer === false) {
    log(`[[ isEmitVerMatchInputVer ]] set strictMatchVer false for app (${appName}), trust emitVer (${emitVer}) is the target version`);
    return true;
  }

  // 模块版本信息未发射上来的话，当做匹配成功
  if (!emitVer) {
    log('[[ isEmitVerMatchInputVer ]] emitVer should not be null');
    return true;
  }

  // 用在线版本或灰度版本比较
  if (!inputVer && appMeta) {
    const { online_version: onlineVer, build_version: buildVer } = appMeta;
    // 判断 projectId 是否传入，传入的话看 proj_ver.map[projectId].o 的值是否存在且是否和 emitVer 相等
    if (projectId) {
      const verMap = appMeta.proj_ver?.map || {};
      const config = verMap[projectId];
      if (config) {
        // 后台是按 p1 项目灰度版本 --> p2 应用灰度版本 --> p3 项目线上版本 优先级依次降低返回的版本
        // 这里的匹配规则和后台严格对应上
        return emitVer === config.b || emitVer === buildVer || emitVer === config.o;
      }
    }
    return emitVer === onlineVer || emitVer === buildVer;
  }

  return emitVer === inputVer;
}
