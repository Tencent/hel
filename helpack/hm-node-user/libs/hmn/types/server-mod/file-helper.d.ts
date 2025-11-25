import type { IFileDownloadInfo, IMeta, IPrepareFilesParams, IWebFileInfo, OnFilesReady, PrepareFiles } from '../base/types';
interface IDownloadModFilesOptions {
    onSuccess: () => void;
    onFailed: () => void;
    modDirPath: string;
    name: string;
    prepareFiles?: PrepareFiles;
    onFilesReady?: OnFilesReady;
    meta: IMeta;
    webFile: IWebFileInfo;
}
export declare function downloadFile(fileWebPath: string, fileLocalPath: string): Promise<void>;
/**
 * 获取需要透传给 getPrepareFiles 函数参数列表的 params
 */
export declare function getPrepareFilesParams(name: string, modDirPath: string, fileInfos: IFileDownloadInfo[]): IPrepareFilesParams;
/**
 * 下载模块对应的文件
 */
export declare function downloadModFiles(fileInfos: IFileDownloadInfo[], options: IDownloadModFilesOptions, retryCount?: number): Promise<void>;
/**
 * 检查本地已下载文件数量是否对应，此逻辑可保证重启服务后不用重复下载文件
 */
export declare function getIsFilesReusable(fileDownloadInfos: IFileDownloadInfo[]): boolean;
export declare function delFileOrDir(fileOrDirPath: string, options?: {
    onSuccess?: () => void;
    onFail?: (err: Error) => void;
}): void;
export declare function cpSync(fromDirPath: string, toDirPath: string): void;
export {};
