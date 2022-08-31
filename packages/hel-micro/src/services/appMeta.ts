import type { IGetVerOptions, IHelSimpleGetOptions } from './api';
import type { Platform, ApiMode } from 'hel-types';
import type { IAppAndVer } from 'hel-micro-core';
import * as innerApiSrv from './api';

export async function getSubAppVersion(versionId: string, options: IGetVerOptions) {
  const versionData = await innerApiSrv.getSubAppVersion(versionId, options);
  return versionData;
}


export async function getSubAppMeta(versionId: string, options?: IHelSimpleGetOptions): Promise<IAppAndVer> {
  const meta = await innerApiSrv.getSubAppAndItsVersion(versionId, options || {});
  return meta;
}


/**
 * 获取某个应用的元数据请求链接
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
  const { url } = innerApiSrv.prepareOtherPlatRequestInfo(appName, { platform, versionId, apiMode });
  return url;
}
