import { getDirFileList } from '../base/path-helper';
import type {
  IDownloadServerModFilesOptions,
  IFetchModMetaOptions,
  IImportHelModByMetaOptions,
  IImportHelModByMetaSyncOptions,
  IImportHelModByPathOptions,
  IImportHelModOptions,
  IMeta,
} from '../base/types';
import { getModMeta } from '../context/meta-cache';
import { modManager } from './mod-manager';
import { extractNameData } from './mod-name';

export { downloadFile } from './file-helper';

/**
 * 获取 hel 模块 meta
 */
export async function getHelModMeta(helModNameOrPath: string, options?: IFetchModMetaOptions) {
  const { helModName } = extractNameData(helModNameOrPath);
  const meta = await getModMeta(helModName, options);
  return meta;
}

/**
 * 异步获取 hel 微模块
 * 未设置 apiUrl 时，会尝试复用 mapNodeMods 设置的 apiUrl，最后才是顶层 platformConfig 里的 apiUrl
 * @example
 * importMod('@hel-demo/mono-libs');
 */
export async function importHelMod<T extends any = any>(helModNameOrPath: string, options?: IImportHelModOptions) {
  const importOptions = { ...(options || {}), standalone: true };
  const mod = await modManager.importMod<T>(helModNameOrPath, importOptions);
  return mod;
}

/**
 * 人工透传 hel 模块元数据来导出 hel 模块，
 * 在一些测试场景时，可以自定义准备文件函数做二次修改后再导出 hel 模块
 */
export function importHelModByMeta(meta: IMeta, options: IImportHelModByMetaOptions) {
  const importOptions = { ...(options || {}), standalone: true };
  return modManager.importModByMeta(meta, importOptions);
}

/**
 * 人工透传 hel 模块元数据，并传入同步的 prepareFiles onFilesReady 函数来进一步处理模块文件如何复制，
 * 进而导出 hel 模块
 */
export function importHelModByMetaSync(meta: IMeta, options: IImportHelModByMetaSyncOptions) {
  const importOptions = { ...options, standalone: true };
  return modManager.importModByMetaSync(meta, importOptions);
}

/**
 * 通过模块路径导出 hel 模块，通常用于测试场景
 * @example
 * importHelModByPath('@hel-demo/mono-libs', '/user/proj/node_modules/my-mode/dist/index.js');
 */
export function importHelModByPath(helModNameOrPath: string, modePath: string, options?: IImportHelModByPathOptions) {
  const importOptions = { ...(options || {}), standalone: true };
  const result = modManager.importModByPath(helModNameOrPath, modePath, importOptions);
  return result.mod;
}

/**
 * 下载 hel 模块对应的网络文件到本地磁盘
 */
export async function downloadHelModFiles(helModNameOrPath: string, options?: IDownloadServerModFilesOptions) {
  const { modFileInfo, meta } = await modManager.prepareServerModFiles(helModNameOrPath, options);
  const files = getDirFileList(modFileInfo.modDirPath);
  return { meta, files };
}
