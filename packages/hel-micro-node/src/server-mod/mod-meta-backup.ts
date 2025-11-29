import * as fs from 'fs';
import { PLATFORM } from '../base/consts';
import type { IMeta, IModInfo } from '../base/types';
import { safeGet } from '../base/util';
import { getGlobalConfig } from '../context/global-config';
import { makeModInfo } from './mod-meta-helper';

const backupModInfos: Record<string, Record<string, IModInfo>> = {};
const backupModMetas: Record<string, Record<string, IModInfo>> = {};
let isBackupMetaInit = false;

// 解析用户准备的兜底元数据文件
export function loadMetasFromFile(metaBackupFilePath: string) {
  if (!metaBackupFilePath) {
    throw new Error('no metaBackupFilePath defined!');
  }

  const metas: IMeta[] = JSON.parse(fs.readFileSync(metaBackupFilePath).toString());
  metas.forEach((meta) => {
    const { name, platform = PLATFORM } = meta.app;
    const modInfo = makeModInfo(meta);
    modInfo.meta.version._is_backup = true;
    const platModInfos = safeGet(backupModInfos, platform, {});
    const platModMetas = safeGet(backupModMetas, platform, {});
    platModMetas[name] = meta;
    platModInfos[name] = modInfo;
  });
}

export function mayInitModBackupData() {
  if (isBackupMetaInit) {
    return;
  }
  const { metaBackupFilePath, forceUseMetaBackupFile } = getGlobalConfig();
  if (!forceUseMetaBackupFile) {
    return;
  }

  loadMetasFromFile(metaBackupFilePath);
  isBackupMetaInit = true;
}

/**
 * 获取模块兜底数据
 */
export function getBackupModInfo(platform: string, modName: string) {
  mayInitModBackupData();
  const platModInfos = safeGet(backupModInfos, platform, {});
  const modInfo = platModInfos[modName];
  return modInfo;
}
