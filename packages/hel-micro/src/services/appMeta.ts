import type { IAppAndVer } from 'hel-micro-core';
import type { ApiMode, Platform } from 'hel-types';
import type { IGetVerOptions, IHelGetOptions } from './api';
import * as innerApiSrv from './api';

export async function getSubAppVersion(versionId: string, options: IGetVerOptions) {
  const versionData = await innerApiSrv.getSubAppVersion(versionId, options);
  return versionData;
}

export async function getSubAppMeta(versionId: string, options?: IHelGetOptions): Promise<IAppAndVer> {
  const meta = await innerApiSrv.getSubAppAndItsVersion(versionId, options || {});
  return meta;
}

/**
 * 获取某个应用的元数据请求链接
 * @param appName 应用名称
 * @param options
 * @returns
 */
export function getMetaDataUrl(
  appName: string,
  options?: {
    versionId?: string;
    platform?: Platform;
    apiMode?: ApiMode;
  },
): string {
  const { versionId, platform, apiMode = 'get' } = options || {};
  const { url } = innerApiSrv.prepareOtherPlatRequestInfo(appName, { platform, versionId, apiMode });
  return url;
}
