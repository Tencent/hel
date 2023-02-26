import defaultsCst from '../consts/defaults';
import { getGlobalThis } from '../deps/helMicroCore';

function getExtraDataPrefix(appName: string) {
  return `${defaultsCst.EXTRA_DATA_PREFIX}.${appName}`;
}

export function getExtraData<T = any>(appName: string, shouldParse?: boolean): T | null {
  const shouldParseVar = shouldParse ?? false;
  const str = getGlobalThis().localStorage?.getItem(getExtraDataPrefix(appName)) ?? null;

  if (str) {
    if (shouldParseVar) {
      return JSON.parse(str);
    }
    return str as any;
  }
  return null;
}

export function setExtraData(appName: string, data: any, shouldStringify?: boolean) {
  const shouldStringifyVar = shouldStringify ?? false;
  const mayStr = shouldStringifyVar ? JSON.stringify(data) : data;
  getGlobalThis().localStorage?.setItem(getExtraDataPrefix(appName), mayStr);
}
