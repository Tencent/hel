import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import type { IModInfo } from '../base/types';

// 控制 PresetData 服务于 planner 时只能初始化一次
let isPlannerPresetDataInit = false;

export function checkPresetDataInit(isForPlanner: boolean) {
  if (!isForPlanner) {
    return;
  }
  if (isPlannerPresetDataInit) {
    throw new Error('PresetData can only be init one time for planner');
  }

  isPlannerPresetDataInit = true;
}

export function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'PresetData' });
}

export function hasServerModFile(modInfo: IModInfo) {
  const { srvModSrcList = [] } = modInfo.meta.version.src_map;
  return srvModSrcList.length > 0;
}

/**
 * 检查元数据里 server 模块对应文件
 */
export function checkServerModFile(modInfo: IModInfo, options: { mustBeServerMod?: boolean; label: string }) {
  const { mustBeServerMod, label } = options;
  if (!hasServerModFile(modInfo)) {
    log({ subType: label, desc: 'no srvModSrcList' });
    if (mustBeServerMod) {
      throw new Error(`no server mod files for ${modInfo.name}`);
    }
    return false;
  }

  return true;
}
