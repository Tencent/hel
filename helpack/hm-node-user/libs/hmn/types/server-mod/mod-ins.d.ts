import type { IModIns, IWebFileInfo, OnFilesReady, OnFilesReadySync, PrepareFiles, PrepareFilesSync } from '../base/types';
/**
 * 通过路径获取模块，
 * 如调用时 modPath 确信为完整路径，则无需设置 shouldResolve=true，
 * 如需要遵循 require 规则，则无需设置 allowNull=true，
 */
export declare function getModByPath(modPath: string, options?: {
    allowNull?: boolean;
    shouldResolve?: boolean;
}): any;
/**
 * 通过指定路径从本地获取模块实例
 */
export declare function getDiskModInsByInitPath(initPath: string, modVer?: string): IModIns;
/**
 * 通过 webFile 信息从本地获取模块实例
 */
export declare function getDiskModIns(webFile: IWebFileInfo): IModIns;
/**
 * 为来自 web 的模块准备相关文件
 */
export declare function prepareWebModFiles(webFile: IWebFileInfo, options: {
    meta: any;
    prepareFiles?: PrepareFiles;
    onFilesReady?: OnFilesReady;
    reuseLocalFiles?: boolean;
}): Promise<{
    modPath: string;
    modRelPath: string;
    isMainMod: boolean;
    mainModPath: string;
    modDirPath: string;
    modRootDirPath: string;
    modVer: string;
    fileDownloadInfos: import("../base/types-srv-mod").IFileDownloadInfo[];
}>;
/**
 * 从网络或用户自定义同步准备文件函数获取模块实例对象
 */
export declare function getWebModIns(webFile: IWebFileInfo, options: {
    meta: any;
    prepareFiles?: PrepareFiles;
    onFilesReady?: OnFilesReady;
    reuseLocalFiles?: boolean;
}): Promise<IModIns>;
/**
 * 通过用户自定义的同步准备文件的函数逻辑获取到模式实例对象，通常服务于本地测试之用
 */
export declare function getCustomModIns(webFile: IWebFileInfo, prepareFilesSync: PrepareFilesSync, onFilesReady?: OnFilesReadySync): IModIns;
