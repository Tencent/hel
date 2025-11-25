import type { IFetchModMetaOptions, IImportModOptions, IMeta, IModManagerItem } from '../base/types';
import { IInnerImportModByMetaOptions } from '../base/types-srv-mod';
export declare function getEnsuredIMBMOptions(meta: IMeta, options: IInnerImportModByMetaOptions): {
    platform: string;
    standalone: boolean;
    prepareFiles?: import("../base/types-srv-mod").PrepareFiles;
    onFilesReady?: import("../base/types-srv-mod").OnFilesReady;
    helModNameOrPath?: string;
    reuseLocalFiles?: boolean;
};
export declare function getModProxyHelpData(helModNameOrPath: string, platform: string): {
    fnProps: Record<string, boolean>;
    dictProps: Record<string, boolean>;
    rawMod: {};
    fallback: import("../base/types-srv-mod").INodeModFallbackConf;
    rawPath: string;
};
/**
 * 获取当前运行中的 hel 模块的入口文件路径
 */
export declare function getHelModFilePath(helModOrPath: string, modItem: IModManagerItem): string;
export declare function isHelModProxy(mayModProxy: any): boolean;
/**
 * 尝试复用 mapNodeMods 设置的 apiUrl
 */
export declare function mayInjectApiUrl(helModName: string, options?: IFetchModMetaOptions): IFetchModMetaOptions;
export declare function getMetaByImportOptions(helModNameOrPath: string, options?: IImportModOptions): Promise<IMeta>;
