import type { IModInfo } from '../base/types';
import { getMappedModFetchOptions } from '../context/facade';
import { getGlobalConfig } from '../context/global-config';
import { presetDataMgr } from './preset-data';

export function getCanFetchNewVersionData(platform: string, modName: string) {
  const fetchOptions = getMappedModFetchOptions(modName, platform);
  const { ver: userSpecifiedVer } = fetchOptions || {};
  if (!userSpecifiedVer) {
    return true;
  }

  // 指定了版本号，还未拉取数据
  const cachedModInfo = presetDataMgr.getCachedModInfo(modName);
  if (!cachedModInfo) {
    return true;
  }

  // 如指定了版本号，和已拉取数据的版本号相等，则不用再拉取新版本数据
  const cachedVer = cachedModInfo.meta.version?.sub_app_version;
  if (userSpecifiedVer === cachedVer) {
    return false;
  }

  return true;
}

export function markAppDesc(setBy: string, modInfo: IModInfo) {
  const { containerName, workerId } = getGlobalConfig().getEnvInfo();
  const modInfoVar = modInfo;
  /** 借用暂无意义的 desc 记录一些信息，setBy 目前有 init timer watch */
  modInfoVar.meta.app.desc = `set by [${setBy}], from container [${containerName}] worker [${workerId}]`;
}
