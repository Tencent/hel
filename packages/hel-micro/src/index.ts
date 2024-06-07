import defaultsCst from './consts/defaults';
import * as core from './deps/helMicroCore';
import emitApp from './process/emitApp';
import * as appMetaSrv from './services/appMeta';
import * as appParamSrv from './services/appParam';
import * as appStyleSrv from './services/appStyle';
import * as logicSrv from './services/logic';
import { init } from './shared/helMicro';
import { isSubApp } from './shared/signal';
import { bindExternals, bindReactRuntime, bindVueRuntime } from './user-util/bindExternals';
import { getExtraData, setExtraData } from './user-util/extraData';
import getFakeHelContext from './user-util/getFakeHelContext';
import { batchPreFetchLib, preFetchApp, preFetchLib } from './user-util/preFetch';
export type { IGroupedStyleList, IPreFetchAppOptions, IPreFetchLibOptions, IPreFetchOptionsBase } from './types';
export {
  preFetchLib,
  preFetchApp,
  batchPreFetchLib,
  appStyleSrv,
  appParamSrv,
  appMetaSrv,
  logicSrv,
  emitApp,
  eventBus,
  init,
  isSubApp,
  getFakeHelContext,
  getExtraData,
  setExtraData,
  bindExternals,
  bindVueRuntime,
  bindReactRuntime,
  core,
};

export const { resetGlobalThis } = core;

/**
 * // 发射事件
 * eventBus.emit('evName', ...args);
 * // 监听事件
 * eventBus.on('evName', (...args)=>{ // your logic });
 * // 取消监听
 * eventBus.off('evName', cb);
 */
const eventBus = core.getUserEventBus();

core.log(`hel-micro ver ${defaultsCst.VER}`);

const toExport = {
  preFetchLib,
  preFetchApp,
  batchPreFetchLib,
  appStyleSrv,
  appParamSrv,
  appMetaSrv,
  logicSrv,
  emitApp,
  eventBus,
  init,
  isSubApp,
  getFakeHelContext,
  getExtraData,
  setExtraData,
  bindExternals,
  bindVueRuntime,
  bindReactRuntime,
  resetGlobalThis,
  core,
};

export default toExport;
