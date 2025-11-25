import type { IInitMiddlewareOptions, IModInfo, INodeModMapper, IPlatformConfig, IPreloadMiddlewareOptions, ISDKGlobalConfig } from '../base/types';
import { HelModViewMiddleware } from './inject';
/**
 * 对平台设置相关配置项
 */
export declare function setPlatformConfig(config: IPlatformConfig): void;
/**
 * 针对 sdk 设置一些基础配置项
 */
export declare function setGlobalConfig(config: ISDKGlobalConfig): void;
/**
 * preloadMiddleware 包含了 initMiddleware 过程，多了一个预加载 hel 模块的过程，
 * 调用后可通过同步方法 getMiddleware 获取到中间件实例，
 * 注（initMiddleware 和 preloadMiddleware 只能调用其中一个）
 * 推荐该方法调用时机在 server 服务启动之前，这样可保证：
 * 1 项目代码里可安全使用 requireMod 同步方法来获取远程模块；
 * 2 server模块和客户端模块版本是一致的；
 */
export declare function preloadMiddleware(options: IPreloadMiddlewareOptions): Promise<{
    helModViewMiddleware: HelModViewMiddleware;
    modInfoList: IModInfo[];
}>;
export declare function getMiddleware(): HelModViewMiddleware;
/**
 * 根据用户配置实例化一个 override-render 中间件
 */
export declare function initMiddleware(options: IInitMiddlewareOptions): {
    helModViewMiddleware: HelModViewMiddleware;
    modInfoList: IModInfo[];
};
/**
 * 对列表里的 hel 模块执行预加载
 */
export declare function preloadHelMods(helModNames: string[], inputPlat?: string): Promise<IModInfo[]>;
/**
 * 对 mapNodeMods 映射的 hel 模式执行预加载，
 * 多次执行的话可能返回空数组，内部只会对未触发 preload 的 hel 模块执行预加载
 * ```text
 * 注：preloadMappedData 和 (initMiddleware, preloadMiddleware) 区别是：
 * preloadMappedData 只负责监听 hel 模块变化并代理 node 模块，无中间件初始化功能，不会重写 render 方法；
 * (initMiddleware, preloadMiddleware) 包含有 preloadMappedData 功能，同时还会额外返回 render 中间件，
 * 用于修改渲染层返回结果之用；
 * ```
 */
export declare function preloadMappedData(platform?: string): Promise<IModInfo[]>;
/**
 * 映射并预加载 hel 模块数据， mapAndPreload 合并了 mapNodeMods 和 preloadMappedData 调用
 */
export declare function mapAndPreload(modMapper: INodeModMapper): Promise<IModInfo[]>;
