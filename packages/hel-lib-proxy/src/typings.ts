/* eslint-disable no-unused-vars */
import type { Platform } from 'hel-types';

export type LibName = string;

export type LibProperties = Record<string, any>;
/**
 * let statement in user's types/libIndex file below work:
 * export const lib: LibMap<'someLib', LibPropertyType> = libProxy;
 *
 * 例如：
 * type LibPropertyType = { a:1, b: ()=>2 };
 * const lib: LibMap<'someLib', LibPropertyType> = {} as any;
 *
 * now: lib.someLib.a ... can be inferred by ts
 */
export type LibMap<Name extends LibName = LibName, Properties extends LibProperties = LibProperties> = { [K in Name]: Properties };

export interface IOptions {
  /**
   * default: false
   * 允许重复注册
   */
  allowDup?: boolean;
  platform?: Platform;
  /**
   * 透传的版本号，透传后 hel-micro-core 在加载子应用时就不会从触发加载的js链接里去推导版本号了
   */
  versionId?: string;
  /**
   * 透传的应用名，透传后 hel-micro-core 在加载子应用时就不会从触发加载的js链接里去推导应用名了
   */
  appName?: string;
}

export interface IExposeLibOptions {
  platform?: Platform;
  /** default：true，是否以 proxy 对象暴露出去，仅当浏览器支持 Proxy 时该设置有效 */
  asProxy?: boolean;
}
