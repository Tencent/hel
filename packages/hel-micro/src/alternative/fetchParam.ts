import { getPlatformConfig } from 'hel-micro-core';
import type { IInnerPreFetchOptions } from '../types';

/**
 * 按下面 'getApiPrefix' 链接里描述的生成规则生成api域名前缀
 * @type {import('hel-micro-core').IControlPreFetchOptions['getApiPrefix']}
 * @param platform
 * @param loadOptions
 * @returns
 */
export function genApiPrefix(platform: string, loadOptions: IInnerPreFetchOptions) {
  let prefix = loadOptions.getApiPrefix?.() || loadOptions.apiPrefix;
  if (prefix) {
    return prefix;
  }
  const conf = getPlatformConfig(platform);
  prefix = conf.getApiPrefix?.() || conf.apiPrefix;
  if (prefix) {
    return prefix;
  }
  const { origin } = conf;
  prefix = origin.getApiPrefix?.() || origin.apiPrefix;
  return prefix;
}
