import type { IDownloadServerModFilesOptions, IFetchModMetaOptions, IImportModByMetaOptions, IImportModByMetaSyncOptions, IImportModByNodePathOptions, IImportModOptions, IMeta } from '../base/types';
export { downloadFile } from './file-helper';
/**
 * 获取 hel 模块 meta
 */
export declare function getHelModMeta(helModNameOrPath: string, options?: IFetchModMetaOptions): Promise<IMeta>;
/**
 * 异步获取 hel 微模块
 * 未设置 apiUrl 时，会尝试复用 mapNodeMods 设置的 apiUrl，最后才是顶层 platformConfig 里的 apiUrl
 * @example
 * importMod('@hel-demo/mono-libs');
 */
export declare function importHelMod<T extends any = any>(helModNameOrPath: string, options?: IImportModOptions): Promise<any>;
/**
 * 人工透传 hel 模块元数据来导出 hel 模块，
 * 在一些测试场景时，可以自定义准备文件函数做二次修改后再导出 hel 模块
 */
export declare function importHelModByMeta(meta: IMeta, options: IImportModByMetaOptions): Promise<any>;
/**
 * 人工透传 hel 模块元数据，并传入同步的 prepareFiles onFilesReady 函数来进一步处理模块文件如何复制，
 * 进而导出 hel 模块
 */
export declare function importHelModByMetaSync(meta: IMeta, options: IImportModByMetaSyncOptions): any;
/**
 * 通过模块路径导出 hel 模块，通常用于测试场景
 * @example
 * importHelModByPath('@hel-demo/mono-libs', '/user/proj/node_modules/my-mode/dist/index.js');
 */
export declare function importHelModByPath(helModNameOrPath: string, modePath: string, options?: IImportModByNodePathOptions): any;
/**
 * 下载 hel 模块对应的网络文件到本地磁盘
 */
export declare function downloadHelModFiles(helModNameOrPath: string, options?: IDownloadServerModFilesOptions): Promise<{
    meta: IMeta;
    files: string[];
}>;
