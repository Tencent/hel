import { Platform } from 'hel-types';
import { getPlatformHost, getPlatformConfig } from '../shared/platform';
import { apiSrvConst } from '../consts/logic';

/**
 * 获取指定应用的 get 型的元数据请求链接
 * @param appName 应用名称
 * @param options 
 * @returns
 */
export function getMetaDataUrl(appName: string, options?: {
  versionId?: string;
  platform?: Platform;
  apiSuffix?: string;
}): string {
  const { versionId, platform, apiSuffix } = options || {};
  const apiHost = getPlatformHost(platform);
  const { apiPathOfApp } = getPlatformConfig(platform);
  const finalApiPath = apiPathOfApp || apiSrvConst.API_PATH_PREFIX;
  const interfaceName = apiSrvConst.GET_APP_AND_VER;
  let url = `${apiHost}${finalApiPath}/${interfaceName}?name=${appName}`;
  if (versionId) {
    url += `&version=${versionId}`;
  }
  if (apiSuffix) {
    url += `&apiSuffix=${apiSuffix}`;
  }
  // 加时间戳防止缓存
  url += `&_t=${Date.now()}`;
  return url;
}
