export type {
  IHelProps, ILocalCompProps, IMicroAppProps, IHelContext, IMicroAppLegacyProps,
  IUseRemoteCompOptions, IUseRemoteLibCompOptions, GetSubVal,
} from './types';
export type { LocalCompType, MicroAppType } from './components/MicroApp';
import ShadowView from 'shadow-view';
import { MicroApp, MicroAppLegacy, MicroAppLegacyMemo, LocalComp } from './components/MicroApp';
import ShadowBody from './components/ShadowBody';
import BuildInSkeleton from './components/BuildInSkeleton';
import renderApp from './process/renderApp';
import * as hooks from './hooks';
import { useForceUpdate, useExecuteCallbackOnce } from './hooks/share';

const {
  useRemoteComp, useRemoteCompAndSubVal, useRemotePureComp, useRemote2Comps, useRemoteLibComp, useRemotePureLibComp, useRemoteLegacyComp
} = hooks;

// 支持语法 import * as helMicroReact from 'hel-micro-react';
export {
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
};

// 支持语法 import helMicroReact from 'hel-micro-react';
export default {
  ShadowView,
  ShadowBody,
  MicroApp,
  MicroAppLegacy,
  MicroAppLegacyMemo,
  BuildInSkeleton,
  LocalComp,
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
};
