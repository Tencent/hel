/**
 * 参数相关服务
 */
import * as core from 'hel-micro-core';
import type { IGetOptionsLoose } from '../types';

export function getWebDirPath(name: string, options?: IGetOptionsLoose) {
  const verData = core.getVersion(name, options);
  return verData?.src_map.webDirPath || '';
}
