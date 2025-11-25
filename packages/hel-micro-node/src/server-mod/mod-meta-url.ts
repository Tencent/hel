import { AS_FALSE, AS_TRUE, HELPACK_API_URL, PLATFORM, PLATFORM_HEL } from '../base/consts';
import type { IFetchModMetaBaseOptions, IFetchModMetaOptions } from '../base/types';
import { getSdkCtx } from '../context';

/**
 * 谨防用户把版本索引 xxx@1.1.1 当成版本号传递，这里提取出 1.1.1 即可
 */
function normalizeVer(name: string, mayVersionIndex: string) {
  const verStr = String(mayVersionIndex || '');
  let ver = verStr;
  const prefix = `${name}@`;
  if (verStr.startsWith(prefix)) {
    ver = verStr.substring(prefix.length);
  }
  return ver;
}

function getRequestMetaBaseUrl(helpackApiUrl: string, name: string, ver: string) {
  const verTag = normalizeVer(name, ver);
  const verSeg = verTag ? `@${verTag}` : '';
  return `${helpackApiUrl}/${name}${verSeg}`;
}

/**
 * helpack 可以感知 branch gray projId 参数
 */
function getHelpackMetaUrl(name: string, helpackApiUrl: string, options?: IFetchModMetaBaseOptions | null) {
  const { branch = '', gray, ver = '', projId } = options || {};
  let url = getRequestMetaBaseUrl(helpackApiUrl, name, ver);
  let andStr = '?';
  const attachVal = (key: string, val: any, mayBool?: any) => {
    const toJudge = mayBool === undefined ? val : mayBool;
    if (toJudge) {
      url = `${url}${andStr}${key}=${val}`;
      andStr = '&';
    }
  };

  attachVal('projId', projId);
  attachVal('branch', branch);
  if (typeof gray === 'boolean') {
    attachVal('gray', gray ? AS_TRUE : AS_FALSE, true);
  }

  return url;
}

/** 拼接获取元数据的请求链接 */
export function getRequestMetaUrl(name: string, options?: IFetchModMetaOptions | null) {
  const { platform = PLATFORM, ver = '', helpackApiUrl = '' } = options || {};
  const sdkCtx = getSdkCtx(platform);
  let apiUrl = helpackApiUrl || sdkCtx.helpackApiUrl;
  // 是 unpkg，仅支持 ver 值设定，生成类似请求链接
  // 无 scope
  // https://unpkg.com/hel-demo-lib1/hel_dist/hel-meta.json
  // https://unpkg.com/hel-demo-lib1@0.2.0/hel_dist/hel-meta.json
  // 有 scope
  // https://unpkg.com/@hel-demo/lib1/hel_dist/hel-meta.json
  // https://unpkg.com/@hel-demo/lib1@0.2.0/hel_dist/hel-meta.json
  if (PLATFORM === platform) {
    const baseUrl = getRequestMetaBaseUrl(apiUrl, name, ver);
    return `${baseUrl}/hel_dist/hel-meta.json`;
  }

  // 指定了 hel 平台，但是未重写 sdkCtx.helpackApiUrl 时，优先度用户的，然后读 HELPACK_API_URL
  if (PLATFORM_HEL === platform && !sdkCtx.isApiUrlOverwrite) {
    apiUrl = helpackApiUrl || HELPACK_API_URL;
  }

  return getHelpackMetaUrl(name, apiUrl, options);
}
