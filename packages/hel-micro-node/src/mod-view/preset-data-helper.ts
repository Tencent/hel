import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import type { IModInfo } from '../base/types';

export function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'PresetData' });
}

export function hasServerModFile(modInfo: IModInfo) {
  const { srvModSrcList = [] } = modInfo.meta.version.src_map;
  return srvModSrcList.length > 0;
}

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
