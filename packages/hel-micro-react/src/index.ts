import * as apis from './apis';
import createInstance from './createInstance';
export type { LocalCompType, MicroAppType } from './components/MicroApp';
export type {
  GetSubVal,
  IHelContext,
  IHelProps,
  ILocalCompProps,
  IMicroAppLegacyProps,
  IMicroAppProps,
  IUseRemoteCompOptions,
  IUseRemoteLibCompOptions,
} from './types';
export { createInstance };

export const {
  ShadowView,
  ShadowBody,
  MicroApp,
  MicroAppLegacy,
  MicroAppLegacyMemo,
  LocalComp,
  BuildInSkeleton,
  renderApp,
  useExecuteCallbackOnce,
  useForceUpdate,
  useRemoteComp,
  useRemotePureComp,
  useRemoteCompAndSubVal,
  useRemote2Comps,
  useRemoteLibComp,
  useRemotePureLibComp,
  useRemoteLegacyComp,
} = apis;

const toExport = {
  ShadowView,
  ShadowBody,
  MicroApp,
  MicroAppLegacy,
  MicroAppLegacyMemo,
  LocalComp,
  BuildInSkeleton,
  renderApp,
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
