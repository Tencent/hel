import type { Platform, ApiMode } from 'hel-types';
import { prepareOtherPlatRequestInfo } from '../services/api';

/**
 * 获取指定应用的 get 型的元数据请求链接
 * @param appName 应用名称
 * @param options 
 * @returns
 */
export function getMetaDataUrl(appName: string, options?: {
  versionId?: string;
  platform?: Platform;
  apiMode?: ApiMode;
}): string {
  const { versionId, platform, apiMode = 'get' } = options || {};
  const { url } = prepareOtherPlatRequestInfo(appName, { platform, versionId, apiMode });
  return url;
}
