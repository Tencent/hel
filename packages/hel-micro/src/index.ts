export type {
  IPreFetchLibOptions, IPreFetchAppOptions, IPreFetchOptionsBase, IGroupedStyleList,
} from './types';
import * as core from 'hel-micro-core';
import { isSubApp } from './shared/signal';
import emitApp from './process/emitApp';
import * as appStyleSrv from './services/appStyle';
import * as appParamSrv from './services/appParam';
import * as appMetaSrv from './services/appMeta';
import * as logicSrv from './services/logic';
import getFakeHelContext from './user-util/getFakeHelContext';
import { preFetchApp, preFetchLib } from './user-util/preFetch';
import { getExtraData, setExtraData } from './user-util/extraData';
import { bindExternals, bindReactRuntime, bindVueRuntime } from './user-util/bindExternals';
import { init } from './shared/helMicro';
import defaultsCst from './consts/defaults';

core.log(`hel-micro ${defaultsCst.VER}`);

export {
  preFetchLib,
  preFetchApp,
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
  core,
};


export default {
  preFetchLib,
  preFetchApp,
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
  core,
};
