import type { IMockAutoDownloadOptions } from '../base/types';
/**
 * 创建自动下载任务，并同时返回一个清除自动任务的句柄
 */
export declare function mockAutoDownload(helModName: string, options?: IMockAutoDownloadOptions): () => void;
