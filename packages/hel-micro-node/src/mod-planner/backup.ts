import { SET_BY } from '../base/consts';
import type { IModInfo } from '../base/types';
import { getGlobalConfig } from '../context/global-config';
import { getSdkCtx } from '../context/index';
import { getBackupModInfo } from '../server-mod/mod-meta-backup';
import { mayUpdateModPresetData } from './facade';
import { markAppDesc } from './facade-helper';
import { presetDataMgr } from './preset-data';

/**
 * 同步缓存模块相关预置数据，由 loadBackupHelMod 调用，此场景本地磁盘有备份文件，故可用同步模式来缓存
 */
function updateModPresetDataSync(platform: string, setBy: string, modInfo: IModInfo | null) {
  if (!modInfo) {
    return;
  }
  markAppDesc(setBy, modInfo);
  presetDataMgr.updateForClient(platform, modInfo);
}

/** 使用 server 镜像里的数据（来自 server 构建产物里的 hel-meta.json 文件）来生成预置数据，以此作为兜底数据 */
export function loadBackupHelMod(platform?: string) {
  const sdkCtx = getSdkCtx(platform);
  const modInfoList: IModInfo[] = [];
  try {
    sdkCtx.modNames.forEach((name) => {
      const modInfo = getBackupModInfo(sdkCtx.platform, name);
      updateModPresetDataSync(sdkCtx.platform, SET_BY.init, modInfo);
      modInfoList.push(modInfo);
    });
    return modInfoList.filter((v) => !!v);
  } catch (err: any) {
    mayUpdateModPresetData(sdkCtx.platform, SET_BY.init).catch((err) => {
      const { reporter } = getGlobalConfig();
      reporter.reportError({ message: err.stack, desc: 'err-loadBackupHelMod', data: platform });
    });
  }
  return modInfoList;
}
