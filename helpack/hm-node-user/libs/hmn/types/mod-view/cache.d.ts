import type { IFetchModMetaOptions, IModInfo } from '../base/types';
import { PresetData } from './preset-data';
/** 使用 server 镜像里的数据（来自 server 构建产物里的 hel-meta.json 文件）来生成预置数据，以此作为兜底数据 */
export declare function loadBackupHelMod(platform?: string): IModInfo[];
/** 开启定时器更新模块缓存，兜底 redis 订阅出问题 */
export declare function enableIntervalUpdate(platform: string): void;
/** 开启消息订阅，接收到模块变化信号时刷新内存里的数据 */
export declare function listenHelModChange(platform: string): void;
/**
 * 更新平台对应的所有已注册模块对应的预设数据
 */
export declare function updateRegisteredModsPresetData(platform: string, setBy: string): Promise<IModInfo[]>;
/**
 * 更新模块信息对应的预置数据，注：模块必须在映射表里才会去更新
 * 不传递具体名称则更新注册的所有模块
 */
export declare function mayUpdateModPresetData(platform: string, setBy: string, modName?: string, modInfo?: IModInfo): Promise<void>;
/**
 * 拉取所有已注册模块对应的模块信息列表（通过 mapNodeMods、preloadMiddleware、initMiddleware 完成的注册）
 */
export declare function fetchRegisteredModInfoList(platform: string, options?: IFetchModMetaOptions): Promise<IModInfo[]>;
/**
 * 获取 preload 模式下的模块信息列表，此模式下会优先尝试更新可能存在的 server 模块缓存
 */
export declare function getModeInfoListForPreloadMode(platform: string, mustBeServerMod?: boolean): Promise<IModInfo[]>;
/**
 * 获取本地缓存的模块信息
 */
export declare function getModInfo(modName: string): IModInfo;
/**
 * 依据分支或灰度标记获取预埋数据
 */
export declare function getPresetDataByHelOptions(options: IFetchModMetaOptions): Promise<PresetData>;
/**
 * 获取默认的预置数据
 */
export declare function getPresetData(): PresetData;
