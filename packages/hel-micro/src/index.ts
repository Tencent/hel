import * as apis from './apis'
import createInstance from './createInstance';
export type { IGroupedStyleList, IPreFetchAppOptions, IPreFetchLibOptions, IPreFetchOptionsBase } from './types';

export const {
  preFetchLib,
  preFetchApp,
  batchPreFetchLib,
  appStyleSrv,
  appParamSrv,
  appMetaSrv,
  logicSrv,
  emitApp,
  init,
  isSubApp,
  getFakeHelContext,
  getExtraData,
  setExtraData,
  bindExternals,
  bindVueRuntime,
  bindReactRuntime,
} = apis;
export const { resetGlobalThis } = apis.core;
export const eventBus = apis.core.getUserEventBus();

export {
  createInstance,
};

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
  core: apis.core,
  createInstance,
};

export default toExport;
