/**
 * hel 包代理库，用于暴露占位模块和运行时模块，将此代码独立出来替代放在 hel-micro 里是
 * 考虑到用户可能只是想暴露模块，而非使用 hel-micro 里其他功能，这样可以减少打包体积，且能够更独立的维护包代理逻辑
 * @author fatasticsoul
 * @since 2021-06-06
 */
import * as apis from './apis';
import { createInstance } from './ins';
export * from './typings';
export { createInstance };

export const { libReady, exposeLib, getLib, isSubApp, isMasterApp, eventBus, appReady, exposeApp } = apis;

export default {
  libReady,
  exposeLib,
  getLib,
  isSubApp,
  isMasterApp,
  eventBus,
  appReady,
  exposeApp,
  createInstance,
};
