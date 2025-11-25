import { ConcurrencyGuard } from '@helux/f-guard';
import type { IDownloadServerModFilesOptions, IGetModDescOptions, IModDesc, IModManagerItem, IResolveModResult, IMeta } from '../base/types';
import type { IInnerImportModOptions, IInnerImportModByMetaOptions, IInnerImportModByMetaSyncOptions, IInnerImportModByNodePathOptions } from '../base/types-srv-mod';
/**
 * server 模块管理类
 */
declare class ModManager {
    /** 模块管理数据映射 */
    modItemMap: Record<string, IModManagerItem>;
    /** 并发守护实例 */
    guard: ConcurrencyGuard;
    /** 模块代理缓存 */
    modProxyCache: Record<string, any>;
    /**
     * 获取模块描述，支持传入 hel 模块名或原始模块名，
     * 需注意如果传入的是原始模块名的话，需提前在 mapNodeMod 里映射了调用才会返回有意义的值
     */
    getModDesc(helModNameOrPath: string, options?: IGetModDescOptions): IModDesc;
    /**
     * 获取模块版本, 支持传入 hel 模块名或原始模块名
     */
    getModVer(helModNameOrPath: string, platform: string): string;
    /**
     * 查看映射的 hel 模块路径数据
     * @example
     * 当 mapNodeMod 函数映射的hel模块被激活时，导出的模块路径会指向代理模块，形如：
     * /proj/node_modules/.hel_modules/.proxy/hel-lib-test.js
     */
    resolveMod(helModNameOrPath: string, platform: string): IResolveModResult;
    /**
     * 同步获取 server 模块，确保模块已被初始化过，此同步方法才可用，
     * 提供 proxy 对象，支持用户在文件头部缓存模块根引用
     * @example 无兜底模块时，不可以在文件头部对模块引用做解构，只能在用的地方现场解构或直接调用
     * ```
     * // good 热更新能生效的写法
     * const someMod = requireMod('my-util');
     *
     * function logic(){
     *   // 直接调用
     *   someMod.callMethod();
     *   // 或写为
     *   const { callMethod } = someMod;
     *   callMethod();
     * }
     *
     * // bad 缓存住了方法引用，导致热更新失效
     * const { callMethod } = requireMod('my-util');
     * ```
     * @example 有兜底模块时，可以提前解构函数、字典对象，内部会自动创建一层包裹
     * ```
     * // ok, 热更新能正常工作，此时的 callMethod 是一个包裹函数，someDict 是一个代理对象
     * const { callMethod, someDict } = requireMod('my-util', { rawMod });
     *
     * // 如一级属性对应 primitive 类型，则不能提前解构，否则导致热更新失效
     * // bad
     * const { someNum } = requireMod('my-util', { rawMod });
     * // good;
     * const mod = requireMod('my-util', { rawMod });
     * mod.someNum; // 用的地方现获取
     *
     * // 故建议一级属性不要暴露原始类型的值，可以统一包裹到一个字典下再导出，例如
     * const { consts } = requireMod('my-util', { rawMod });
     * consts.someNum // consts 会把包裹为一个代理，用的时候才获取，此时热更新能生效
     * ```
     */
    requireMod<T extends any = any>(helModNameOrPath: string, options?: {
        platform?: string;
    }): T;
    /**
     * 通过 hel 模块信息参数异步导入 server 模块
     */
    importModByMeta<T extends any = any>(meta: IMeta, options: IInnerImportModByMetaOptions): Promise<any>;
    /**
     * 通过 hel 模块名称异步导入 server 模块
     */
    importMod<T extends any = any>(helModNameOrPath: string, options: IInnerImportModOptions): Promise<any>;
    /**
     * 通过自定义的同步的准备文件函数准备 server 模块
     */
    importModByMetaSync(meta: IMeta, options: IInnerImportModByMetaSyncOptions): any;
    /**
     * 根据用户透传的模块初始路径，同步准备 server 模块
     */
    importModByPath(helModName: string, modInitPath: string, options?: IInnerImportModByNodePathOptions): any;
    /**
     * 为服务端模块准备相关文件
     */
    prepareServerModFiles(helModNameOrPath: string, options?: IDownloadServerModFilesOptions): Promise<{
        meta: IMeta;
        modFileInfo: {
            modPath: string;
            modRelPath: string;
            isMainMod: boolean;
            mainModPath: string;
            modDirPath: string;
            modRootDirPath: string;
            modVer: string;
            fileDownloadInfos: import("../base/types-srv-mod").IFileDownloadInfo[];
        };
    }>;
    /**
     * 尝试从本地磁盘里获取模块实例
     */
    private tryGetLocalModIns;
    /**
     * 清理上一个版本的已导出模块内存数据
     */
    private clearPrevModCache;
    /**
     * 获取模块引用，优先获取hel模块，不存在则降级为兜底模块
     */
    private getModRef;
    /**
     * 获取hel模块引用对象
     */
    private getHelModRef;
    /**
     * 确保模块对应管理对象存在
     */
    private ensureModItem;
    /**
     * 为后续逻辑执行准备模块相关参数
     */
    private prepareModParams;
    /**
     * 清理模块磁盘文件
     */
    private mayClearModDiskFiles;
    /**
     * 获取模块管理对象
     */
    private getServerModItem;
    /**
     * 更新模块管理数据
     */
    private updateModManagerItem;
    private triggerOnModLoadedHook;
    private getDictKey;
}
export declare const modManager: ModManager;
export {};
