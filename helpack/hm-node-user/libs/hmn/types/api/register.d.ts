import * as api from '../api';
import type { IRegisterPlatformConfig } from '../base/types';
/**
 * 注册平台信息并返回此平台对应的 api，此接口面向库开发者
 */
export declare function registerPlatform(config: IRegisterPlatformConfig): typeof api;
