import type { IImportNodeModByMetaOptions, IImportNodeModByMetaSyncOptions, IMeta } from '../base/types';
import type { IInnerImportModByMetaOptions, IInnerImportModByMetaSyncOptions } from '../base/types-srv-mod';
import { mapNodeModsManager } from '../server-mod/map-node-mods';

export function extractImportNodeModByMetaSyncOptions(nodeModName: string, meta: IMeta, options: IImportNodeModByMetaSyncOptions) {
  const { helModName, platform } = mapNodeModsManager.getNodeModData(nodeModName, false);
  if (helModName !== meta.app.name) {
    throw new Error(`Meta name ${meta.app.name} not equal to helModName ${helModName}`);
  }
  const newOptions: IInnerImportModByMetaSyncOptions = { ...options, standalone: false, platform };
  return newOptions;
}

export function extractImportNodeModByMetaOptions(nodeModName: string, meta: IMeta, options?: IImportNodeModByMetaOptions) {
  const { helModName, platform } = mapNodeModsManager.getNodeModData(nodeModName, false);
  // @ts-ignore 运行时剔除掉 helModNameOrPath 属性，避免误传影响结果
  const { helModNameOrPath, ...rest } = options || {};
  if (helModName !== meta.app.name) {
    throw new Error(`Meta name ${meta.app.name} not equal to helModName ${helModName}`);
  }
  const newOptions: IInnerImportModByMetaOptions = { ...rest, platform, standalone: false, helModNameOrPath: helModName };
  return newOptions;
}
