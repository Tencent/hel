import { inectPlatToMod } from 'hel-micro-core';
import * as apis from './apis';

type Apis = typeof apis;
type CreateInstance = (platform: string) => InsApis;
type InsApis = Apis & {
  createInstance: CreateInstance;
  default: InsApis;
};

/**
 * 预设获取参数自定义api实例，之后调用的api实例将总是自动带上用户的预设参数作为兜底参数
 * @returns
 */
export function createInstance(platform: string): InsApis {
  const newApis = inectPlatToMod<Apis>(platform, apis);
  const insApis: any = {
    createInstance,
    ...newApis,
    default: null,
  };
  insApis.default = insApis;
  return insApis;
}
