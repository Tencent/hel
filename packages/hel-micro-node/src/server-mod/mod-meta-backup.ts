import * as fs from 'fs';
import { print } from '../base/logger';
import type { IMeta, IModInfo } from '../base/types';
import { safeGet } from '../base/util';
import { getSdkCtx } from '../context/index';
import { makeModInfo } from './mod-meta-helper';

const backupModInfos: Record<string, Record<string, IModInfo>> = {};
const backupModMetas: Record<string, Record<string, IModInfo>> = {};
const backupModIsInit: Record<string, boolean> = {};

const errDesc = 'err-init-hed-mod-defaults';

function mayInitModBackupData(platform: string) {
  if (backupModIsInit[platform]) {
    return;
  }

  const sdkCtx = getSdkCtx(platform);
  const mayThrowErr = (err: any) => {
    // // 非 preload 模式才需要抛出兜底文件不存在的异常，preload 模式是允许本地无兜底模块配置的
    // if (!sdkCtx.isPreloadMode) {
    //   throw err;
    // }
    // TODO setGlobalConfig 新增 mustHaveBackup 选项，为 true 时这里才报错
    print(err);
  };

  backupModIsInit[platform] = true;
  const platModInfos = safeGet(backupModInfos, platform, {});
  const platModMetas = safeGet(backupModMetas, platform, {});
  try {
    // 解析镜像里存在的模块兜底元数据
    const metas: Record<string, IMeta> = JSON.parse(fs.readFileSync(sdkCtx.helMetaBackupFilePath).toString());
    Object.assign(backupModMetas, metas);
    Object.keys(metas).forEach((name) => {
      const meta = metas[name];
      const modInfo = makeModInfo(meta);
      modInfo.meta.version._is_backup = true;
      platModMetas[name] = meta;
      platModInfos[name] = modInfo;
    });
  } catch (err: any) {
    sdkCtx.reporter.reportError(err.stack, errDesc);
    mayThrowErr(err);
  }

  /** 未在镜像里对这些模块写入默认元数据 */
  const noDefaultNames: string[] = [];
  sdkCtx.modNames.forEach((name) => {
    if (!platModInfos[name]) {
      noDefaultNames.push(name);
    }
  });

  if (noDefaultNames.length) {
    const msg = `these mods(${noDefaultNames}) has no backup hel meta`;
    sdkCtx.reporter.reportError(msg, errDesc);
    mayThrowErr(new Error(msg));
  }
}

/**
 * 获取模块兜底数据
 */
export function getBackupModInfo(platform: string, modName: string) {
  mayInitModBackupData(platform);
  const platModInfos = safeGet(backupModInfos, platform, {});
  const modInfo = platModInfos[modName];
  return modInfo;
}
