import type { IMeta, IModInfo } from '../base/types';
import type { IInnerImportModByMetaOptions, IInnerImportModByMetaSyncOptions } from '../base/types-srv-mod';
declare type AssetMap = Record<string, {
    css: string;
    js: string;
} | null>;
interface IUpdateServerModOptions {
    mustBeServerMod?: boolean;
    importOptions?: IInnerImportModByMetaOptions;
}
interface IUpdateServerModSyncOptions {
    mustBeServerMod?: boolean;
    importOptions?: IInnerImportModByMetaSyncOptions;
}
/**
 * 预置数据逻辑类，内部有两个场景会用到：
 * 1 供中间件使用，需要把数据某些 hel 模块的加工数据透传给模板引擎时，会调用此类
 * 2 监听到版本变化时，由此类来响应变化的信号，执行 client 和 server 端模块相关更新动作
 */
export declare class PresetData {
    modInfoCache: Record<string, IModInfo>;
    /** 元数据缓存 */
    metaCache: Record<string, IMeta>;
    /** 已生成的元数据字符串 */
    metaStr: string;
    /** css 含link的字符串缓存 */
    cssCache: Record<string, string>;
    /** 已生成的样式字符串 */
    cssLinkStr: string;
    /** hel-entry js sdk 缓存 */
    helEntryCache: Record<string, string>;
    /** 模板名对应的产物数据, key: 模板名（ xxx.ejs ），value：产物对象 */
    viewAssetCache: AssetMap;
    /** 入口名对应的产物数据, key: 带模块前缀的入口名（ xxxMod/yyy ），value：产物对象 */
    entryAssetCache: AssetMap;
    /** 需预拉取 js 的模块元数据缓存 */
    preloadMetaCache: Record<string, IMeta>;
    /** 已生成的需预拉取的 js link 字符串 */
    preloadJsStr: string;
    /** 是否允许更新低于镜像里默认版本的旧版本数据 */
    allowOldVer: boolean;
    constructor(allowOldVer?: boolean);
    /**
     * 服务于 initMiddleware 同步流程，此模式下优先更新客户端模块，
     * 顺带检查服务端模块是否存在，如存在则异步更新，适用于前后端模块版本可短时间不一致的场景
     */
    updateForClient(platform: string, modInfo: IModInfo): boolean;
    /**
     * 优先更新服务端模块数据，服务于 preloadMiddleware 异步流程，此模式下优先更新服务端模块（如存在），
     * 更新成功后再更新客户端模块数据（预埋在首页里下发给前端hel-micro sdk使用的相关hel数据），
     * 适用于需要前后端模块版本强一致的场景
     */
    updateForServerFirst(platform: string, modInfo: IModInfo, options?: IUpdateServerModOptions): Promise<boolean>;
    updateForServerFirstSync(platform: string, modInfo: IModInfo, options?: IUpdateServerModSyncOptions): boolean;
    /**
     * 获取 hel 主项目胶水层代码 js
     */
    getHelPageEntrySrc(modName?: string): string;
    /**
     * 获取页面对应的 js css 资源路径
     */
    getPageAsset(viewName: string, helEntry?: string): {
        css: string;
        js: string;
    };
    getCachedModInfo(modName: string): IModInfo | null;
    /** 尝试更新前端模块相关预设数据 */
    private updateClientMod;
    private setModInfo;
    /** 如存在 server 模块则更新对应模块实例 */
    private updateServerMod;
    /** 如存在 server 模块则更新对应模块实例 */
    private updateServerModSync;
    /** 更新用户可能设定的 server 端本地初始兜底模块 */
    private updateServerInitMod;
    /**
     * 能否使用新版本
     */
    private canUseNewVersion;
    /**
     * 出现以下状况任意一个，则不能更新：
     * 1 未在用户的模块声明表里
     * 2 模块版本检查失败
     */
    private canUpdate;
    /**
     * 更新需要在首页预埋的 hel-meta 对象
     */
    private updatePresetHelMetaStr;
    /**
     * 更新访问页面的资源描述对象
     */
    private updatePageAssetCache;
    /**
     * 获取需要预设的 css link 字符串
     */
    private updatePresetCssLinkStr;
    /**
     * 更新入口胶水层代码 js 缓存
     */
    private updateHelEntryCache;
    /**
     * 更新需在首页做 js 预拉取的描述字符
     */
    private updatePreloadJsStr;
}
/** 内部全局使用的预置数据管理对象 */
export declare const presetDataMgr: PresetData;
export {};
