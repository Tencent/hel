import type { ApiMode, ISubAppVersion, Platform } from 'hel-types';
import { API_NORMAL_GET } from '../consts/logic';
import type { IHelMeta } from '../types';
import type { IGetVerOptions, IHelGetOptions } from './api';
import * as innerApiSrv from './api';
import * as innerAppSrv from './app';

export interface IGetMetaDataUrlOptions {
  versionId?: string;
  platform?: Platform;
  apiMode?: ApiMode;
  /** default: 'http'， 在 node 环境里使用 http 请求不会存在证书过期问题，故协议类型默认值为 http */
  protocol?: 'http' | 'https';
  projectId?: string;
  /** default: true */
  semverApi?: boolean;
}

/**
 * 获取应用构建版本数据
 */
export async function getSubAppVersion(versionId: string, options: IGetVerOptions): Promise<ISubAppVersion> {
  const versionData = await innerApiSrv.getSubAppVersion(versionId, options);
  return versionData;
}

/**
 * 获取应用自身描述和构建版本数据
 */
export async function getSubAppMeta(appName: string, options?: IHelGetOptions): Promise<IHelMeta> {
  const meta = await innerApiSrv.getSubAppAndItsVersion(appName, options || {});
  return meta;
}

/**
 * 获取某个应用的元数据请求链接
 * @param appName 应用名称
 * @param options
 * @returns
 */
export function getMetaDataUrl(appName: string, options?: IGetMetaDataUrlOptions): string {
  const { versionId, platform, apiMode = API_NORMAL_GET, protocol = 'http', projectId, semverApi = true } = options || {};
  let { url } = innerApiSrv.prepareCustomPlatRequestInfo(appName, { platform, versionId, apiMode, projectId, semverApi });
  if (protocol === 'http') {
    url = url.replace('https:', 'http:');
  }
  return url;
}

export async function clearDiskCachedApp(appNameOrNames: string | string[]) {
  if (Array.isArray(appNameOrNames)) {
    const tasks: Array<Promise<any>> = [];
    appNameOrNames.forEach((name) => tasks.push(innerAppSrv.clearDiskCachedApp(name)));
    await Promise.all(tasks);
  } else {
    await innerAppSrv.clearDiskCachedApp(appNameOrNames);
  }
}
