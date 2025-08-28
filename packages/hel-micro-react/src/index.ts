import * as core from 'hel-micro-core';
import * as apis from './apis';
import { createInstance } from './ins';
import { mayBindReactLibs } from './util';
export type { LocalCompType, MicroAppType } from './components/MicroApp';
export type { RemoteComp } from './hooks/index';
export * from './types';
export { createInstance };

export const {
  VER,
  ShadowView,
  ShadowBody,
  MicroApp,
  MicroAppLegacy,
  MicroAppLegacyMemo,
  LocalComp,
  BuildInSkeleton,
  renderApp,
  getMayStaticShadowNode,
  useExecuteCallbackOnce,
  useForceUpdate,
  useRemoteComp,
  useRemoteCompStatus,
  useRemotePureComp,
  useRemotePureCompStatus,
  useRemoteCompAndSubVal,
  useRemoteCompAndSubValStatus,
  useRemote2Comps,
  useRemoteLibComp,
  useRemoteLibCompStatus,
  useRemotePureLibComp,
  useRemotePureLibCompStatus,
  useRemoteLegacyComp,
} = apis;

core.log(`hel-micro-react ver ${VER}`);
mayBindReactLibs();

const toExport = {
  VER,
  ShadowView,
  ShadowBody,
  MicroApp,
  MicroAppLegacy,
  MicroAppLegacyMemo,
  LocalComp,
  BuildInSkeleton,
  renderApp,
  getMayStaticShadowNode,
  useExecuteCallbackOnce,
  useForceUpdate,
  useRemoteComp,
  useRemotePureComp,
  useRemoteCompAndSubVal,
  useRemote2Comps,
  useRemoteLibComp,
  useRemotePureLibComp,
  useRemoteLegacyComp,
  createInstance,
};

export default toExport;
