/**
 * hel 包代理库，用于暴露占位模块和运行时模块，将此代码独立出来替代放在 hel-micro 里是
 * 考虑到用户可能只是想暴露模块，而非使用 hel-micro 里其他功能，这样可以减少打包体积，且能够更独立的维护包代理逻辑
 * @author fatasticsoul
 * @since 2021-06-06
 */
import type { IAppReadyOptions, IGetOptions } from 'hel-micro-core';
import core from 'hel-micro-core';
import type { Platform } from 'hel-types';
import * as share from './share';
import type { IExposeLibOptions, IOptions, LibName, LibProperties } from './typings';
import * as diff from './_diff';
export * from './typings';

core.log(`hel-lib-proxy ver ${diff.VER}`);

const { getUserEventBus } = core;

/**
 * // 发射事件
 * eventBus.emit('evName', ...args);
 * // 监听事件
 * eventBus.on('evName', (...args)=>{ // your logic });
 * // 取消监听
 * eventBus.off('evName', cb);
 */
export const eventBus = getUserEventBus();

/**
 * 对某个库执行 preFetchLib 后，可通过此函数拿到目标模块
 * @param libName
 * @param platform - 默认 'hel'
 * @returns
 */
export function getLib<T extends any>(libName: LibName, getOptions?: IGetOptions): T | null {
  const filledOptions = { ...(getOptions || {}) };
  filledOptions.platform = diff.getDefaultPlatform();
  return core.getVerLib(libName, filledOptions) as T;
}

/**
 * 模快提供方使用此函數來暴露对外提供接口的【代理对象】，作为 rollup 打包的入口文件之用（也是 types 文件入口）
 * 对于模块使用方导入 npm 包时可直接导出模块对象引用，
 * 在支持 proxy 的环境下默认以 proxy 对象来暴露，可显式地设置 asProxy 为 false 来屏蔽此行为
 * ```js
 * import xxxLib from 'hel-xxx-lib';
 * import { xxxLib } from 'hel-xxx-lib'
 * const sum = xxxLib.sum;
 * ```
 * @param libName - https://hel.woa.com HelPack平台注册的应用名
 * @param options
 * @returns
 */
export function exposeLib<L extends LibProperties>(libName: string, versionId: string, options?: IExposeLibOptions | Platform): L {
  let asProxy = true;
  let platform = '';
  if (options) {
    if (typeof options === 'string') {
      platform = options;
    } else {
      platform = options.platform || '';
      asProxy = options.asProxy ?? true;
    }
  }
  platform = platform || diff.getDefaultPlatform();

  let libObj = share.getLibObj<L>(libName, versionId, platform);
  if (typeof Proxy === 'function' && asProxy) {
    libObj = share.getLibProxy(libName, libObj, versionId, platform);
  }
  core.log('[[ exposeLib ]] libName, libObj', libName, libObj);
  return libObj;
}

/**
 * 运行时代码暴露实际的模块对象，该模块对象会被 helEventBus 发射给模块使用方
 * 使用场景：
 * 当需要将web项目里已有的组件暴露出去一部分给另一个项目直接使用时可以用到此接口
 * 通常在模块提供方的入口文件加载完毕时调用，相比【模块联邦】更加灵活
 * @param appGroupName
 * @param libProperties
 */
export function libReady(appGroupName: string, libProperties: LibProperties, options?: IOptions) {
  const mergedOptions = share.getMergedOptions(options);
  // 将注册结果返回给 preFetchLib 函数调用方
  core.libReady(appGroupName, libProperties, mergedOptions);
}

export function appReady(appGroupName: string, Comp: any, options?: IAppReadyOptions) {
  // 将注册结果返回给 preFetchApp 函数调用方
  core.appReady(appGroupName, Comp, options);
}

export function exposeApp<T extends any = any>(libName: string, options?: IGetOptions): T {
  const Comp = core.getVerApp(libName, options) as T;
  return Comp;
}

export function isMasterApp() {
  return !core.isSubApp();
}

export const isSubApp = core.isSubApp;

export default {
  libReady,
  exposeLib,
  getLib,
  isSubApp,
  isMasterApp,
  eventBus,
  appReady,
  exposeApp,
};
