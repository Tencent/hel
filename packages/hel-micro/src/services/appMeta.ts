import type { IAppAndVer } from 'hel-micro-core';
import type { ApiMode, Platform } from 'hel-types';
import { API_NORMAL_GET } from '../consts/logic';
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
    /** default: 'http'， 在 node 环境里使用 http 请求不会存在证书过期问题，故协议类型默认值为 http */
    protocol?: 'http' | 'https';
  },
): string {
  const { versionId, platform, apiMode = API_NORMAL_GET, protocol = 'http' } = options || {};
  let { url } = innerApiSrv.prepareHelPlatRequestInfo(appName, { platform, versionId, apiMode });
  if (protocol === 'http') {
    url = url.replace('https:', 'http:');
  }
  return url;
}
