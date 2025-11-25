import { KW_NODE_MOD_NAME } from '../base/mod-consts';
import { getDirFileList } from '../base/path-helper';
import type {
  DictData,
  IDownloadNodeServerModFilesOptions,
  IDownloadServerModFilesOptions,
  IGetModDescOptions,
  IImportModByMetaOptions,
  IImportModByMetaSyncOptions,
  IImportModByNodePathOptions,
  IImportModOptions,
  IImportNodeModResult,
  IMeta,
  IModDesc,
  INodeModMapper,
  IResolveModResult,
} from '../base/types';
import { IInnerImportModByMetaOptions } from '../base/types-srv-mod';
import { presetDataMgr } from '../mod-view/preset-data';
import { mapNodeModsManager } from '../server-mod/map-node-mods';
import { modManager } from '../server-mod/mod-manager';
import { getMetaByImportOptions } from '../server-mod/mod-manager-helper';
import { makeModInfo } from '../server-mod/mod-meta-helper';

export { downloadFile } from '../server-mod/file-helper';

function getMappedData(nodeModName: string) {
  return mapNodeModsManager.getNodeModData(nodeModName, false);
}

function extractOptions(nodeModName: string, meta: IMeta, options?: any) {
  const { helModName, platform } = getMappedData(nodeModName);
  if (helModName !== meta.app.name) {
    throw new Error(`Meta name ${meta.app.name} not equal to helModName ${helModName}`);
  }
  const newOptions = { ...(options || {}), standalone: false, platform };
  return newOptions;
}

/**
 * 查看映射了 hel 模块的 node 模块路径数据，
 * 如果未映射会报错 Unmapped node module，
 * 如果 hel 模块未加载，会报错 Mapped hel module xxx not preloaded，
 */
export function resolveNodeMod(nodeModName: string): IResolveModResult {
  const { helPath, platform } = getMappedData(nodeModName);
  return modManager.resolveMod(helPath, platform);
}

/**
 * 同步获取映射了 hel 模块的 node 模块（对齐 require），如果模块未加载，会报错 Mapped hel module xxx not preloaded
 * @example
 * requireNodeMod('@hel-demo/mono-libs');
 * ```
 */
export function requireNodeMod<T extends any = any>(nodeModName: string) {
  if (nodeModName === KW_NODE_MOD_NAME) {
    // 来自初始模板的调用
    return {} as unknown as T;
  }
  const { helPath, platform } = getMappedData(nodeModName);
  const mod = modManager.requireMod<T>(helPath, { platform });
  return mod;
}

/**
 * 异步获取映射了 hel 模块的 node 模块（对齐 import）
 * 未设置 apiUrl 时，会尝试复用 mapNodeMods 设置的 apiUrl，最后才是顶层 platformConfig 里的 apiUrl
 * @example
 * importNodeMod('@hel-demo/mono-libs');
 */
export async function importNodeMod<T extends any = any>(
  nodeModName: string,
  options?: IImportModOptions,
): Promise<IImportNodeModResult<T>> {
  const { helPath, platform } = getMappedData(nodeModName);
  const importOptions: IInnerImportModByMetaOptions = { ...(options || {}), standalone: false, platform };
  const meta = await getMetaByImportOptions(helPath, importOptions);
  const modInfo = makeModInfo(meta);
  const isUpdated = await presetDataMgr.updateForServerFirst(platform, modInfo, { mustBeServerMod: true, importOptions });
  const mod = requireNodeMod(nodeModName);

  return { mod, isUpdated };
}

/**
 * 人工透传 hel 模块元数据来导出映射了 hel 模块的 node 模块，
 * 在一些测试场景时，可以自定义准备文件函数做二次修改后再导出 hel 模块
 * @example
 * ```
 * // 映射模块关系
 * mapNodeMods({'mod': 'my-mod'});
 * // 人工初始化模块
 * importNodeModByMeta('mod', myModMeta, {prepareFiles: ()=>{...}});
 * // 其他文件里，xxMethod 即是 prepareFiles 准备的文件对应的模块导出的函数
 * import { xxMethod } from 'mod';
 * ```
 */
export async function importNodeModByMeta<T extends any = any>(
  nodeModName: string,
  meta: IMeta,
  options: IImportModByMetaOptions,
): Promise<IImportNodeModResult<T>> {
  const { platform } = getMappedData(nodeModName);
  const importOptions = extractOptions(nodeModName, meta, options);
  const modInfo = makeModInfo(meta);
  const isUpdated = await presetDataMgr.updateForServerFirst(platform, modInfo, { mustBeServerMod: true, importOptions });
  const mod = requireNodeMod(nodeModName);

  return { mod, isUpdated };
}

/**
 * 人工透传 hel 模块元数据，并传入同步的 prepareFiles onFilesReady 函数来进一步处理模块文件如何复制，
 * 进而导出映射了 hel 模块的 node 模块
 */
export function importNodeModByMetaSync<T extends any = any>(
  nodeModName: string,
  meta: IMeta,
  options: IImportModByMetaSyncOptions,
): IImportNodeModResult<T> {
  const { platform } = getMappedData(nodeModName);
  const importOptions = extractOptions(nodeModName, meta, options);
  const modInfo = makeModInfo(meta);
  const isUpdated = presetDataMgr.updateForServerFirstSync(platform, modInfo, { mustBeServerMod: true, importOptions });
  const mod = requireNodeMod(nodeModName);

  return { mod, isUpdated };
}

/**
 * 通过 node 模块路径导出映射了 hel 模块的 node 模块，此接口会更新内部 helModNameOrPath 对应的模块，通常用于测试场景
 * @example
 * importNodeModByPath('@hel-demo/mono-libs', '/user/proj/node_modules/my-mode/dist/index.js');
 */
export function importNodeModByPath(nodeModName: string, nodeModPath: string, options?: IImportModByNodePathOptions) {
  const { helPath, platform } = getMappedData(nodeModName);
  const newOptions = { ...(options || {}), standalone: false, platform };
  return modManager.importModByPath(helPath, nodeModPath, newOptions);
}

/**
 * 设定 node 模块和 hel 模块映射关系
 * @example
 * ```ts
 * // node 模块映射为 hel 模块
 * mapNodeMods({'qn-utils': 'hel-qn-utils'});
 *
 * // 既是node模块也是hel模块时，可自己映射自己
 * mapNodeMods({'hel-demo-lib1': true});
 * ```
 */
export function mapNodeMods(modMapper: INodeModMapper) {
  return mapNodeModsManager.setModMapper(modMapper);
}

/**
 * 获取映射了 hel 模块的 node 模块的简要描述信息
 */
export function getNodeModDesc(nodeModName: string, options?: IGetModDescOptions): IModDesc {
  const { helPath, platform } = getMappedData(nodeModName);
  const newOptions = { ...(options || {}), standalone: false, platform };
  return modManager.getModDesc(helPath, newOptions);
}

/**
 * 获取映射了 hel 模块的 node 模块的版本号，需要获取更完整的描述信息时可调用 getNodeModDesc
 * 如果模块未加载，会报错 Mapped hel module xxx not preloaded
 */
export function getNodeModVer(nodeModName: string): string {
  const { helPath, platform } = getMappedData(nodeModName);
  return modManager.getModVer(helPath, platform);
}

/**
 * 下载映射了 hel 模块的 node 模块的的网络文件到本地磁盘
 */
export async function downloadNodeModFiles(nodeModName: string, options?: IDownloadNodeServerModFilesOptions) {
  const { helPath, platform } = getMappedData(nodeModName);
  const prepareOptions: IDownloadServerModFilesOptions = { ...(options || {}), platform };
  const { modFileInfo, meta } = await modManager.prepareServerModFiles(helPath, prepareOptions);
  const files = getDirFileList(modFileInfo.modDirPath);
  return { meta, files };
}

/**
 * 获取映射了 hel 模块的 node 模块的备选模块
 */
export function getFallbackMod<T extends DictData>(nodeModName: string): T | null {
  const { helPath, platform } = getMappedData(nodeModName);
  return mapNodeModsManager.getFallbackMod(helPath, platform);
}
