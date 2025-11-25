import type { HelModName, HelModOrPath, HelModPath, IFetchModMetaOptions, INodeModFallbackConf, INodeModMapper, PkgName, Platform, PrepareFiles } from '../base/types';
import { type ICheckData } from './map-node-helper';
interface IMapDetail {
    mod2isPreloadTriggered: Record<HelModName, boolean>;
    modOrPath2plat: Record<HelModName | HelModOrPath, string>;
    mod2helModPaths: Record<HelModName, HelModPath[]>;
    helModFileCount: Record<HelModName, number>;
    mod2nodeName: Record<HelModOrPath, PkgName>;
    mod2fetchOptions: Record<HelModOrPath, IFetchModMetaOptions>;
    prepareFilesFns: Record<HelModOrPath, PrepareFiles>;
    proxyFiles: Record<HelModOrPath, string>;
}
interface INodeModData {
    platform: string;
    helModName: HelModName;
    helPath: HelModPath;
    rawPath: string;
    proxyFilePath: string;
    fallback: INodeModFallbackConf;
    fnProps: Record<string, boolean>;
    dictProps: Record<string, boolean>;
    isShapeReady: boolean;
}
declare class MapNodeModsManager {
    nodeName2data: Record<PkgName, INodeModData>;
    mapDetails: Record<Platform, IMapDetail>;
    checkData: ICheckData;
    /**
     * 获取node模块对应的hel代理模块文件路径
     */
    getProxyFile(pkgName: PkgName, helModOrPath: HelModOrPath, sourceFullPath: string): string;
    getNodeModData(nodeModName: PkgName, allowFake?: boolean): INodeModData;
    getMappedPath(nodeModName: PkgName): string;
    isFallbackModExist(nodeModName: PkgName): boolean;
    isModShapeExist(nodeModName: PkgName): boolean;
    getFallbackMod(helModNameOrPath: HelModOrPath, platform: string): any;
    getMappedApiUrl(helModName: HelModName): string;
    /**
     * 获取预设的准备文件函数
     */
    getPrepareFilesFn(helModNameOrPath: HelModOrPath, platform: string): PrepareFiles;
    /**
     * 获取hel模块名映射的node模块包名，如获得空字符串表示上传还未映射模块关系就直接调用了 importMod
     */
    getNodeModName(helModNameOrPath: HelModOrPath, platform: string): string;
    getHelModData(helModName: HelModName, platform?: string): {
        nodeModName: string;
        helModPaths: string[];
    };
    /**
     * 获取映射 node 模块与 hel 模块关系时的拉取 meta 的请求参数选项
     */
    getFetchOptions(helModNameOrPath: HelModOrPath, platform: string): IFetchModMetaOptions | null;
    /**
     * 获取hel模块名下所有映射的hel模块路径
     */
    getHelModPaths(helModName: HelModName, platform: string): string[];
    /**
     * 获取映射的 hel 模块名称列表，不传递 onlyUntriggered 或传递 onlyUntriggered=false 时，会获取所有的，
     * 传递 onlyUntriggered=true 时，只返回未触发 preload 流程的 hel 模块名称列表
     */
    getHelModNames(platform: string, onlyUntriggered?: boolean): string[];
    setIsPreloadTriggered(helModName: HelModName, platform: string): void;
    /**
     * 设置node模块与hel模块配置的映射关系
     */
    setModMapper(modMapper: INodeModMapper): void;
    /**
     * 根据 MOD_TPL 模板生成新的代理模块文件
     */
    private genProxyModFile;
    /**
     * 对hel模块对应的导出文件数量加1
     */
    private incProxyFileCount;
    /**
     * 获取hel模块对应的导出文件数量
     */
    private getProxyFileCount;
    private getMapDetail;
}
export declare const mapNodeModsManager: MapNodeModsManager;
export {};
