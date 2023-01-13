import { core } from 'hel-micro';
import ShadowView from 'shadow-view-react';
import BuildInSkeleton from './components/BuildInSkeleton';
import { LocalComp, MicroApp, MicroAppLegacy, MicroAppLegacyMemo } from './components/MicroApp';
import ShadowBody from './components/ShadowBody';
import * as hooks from './hooks';
import { useExecuteCallbackOnce, useForceUpdate } from './hooks/share';
import renderApp from './process/renderApp';
import { VER } from './_diff';

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

core.log(`hel-micro-react ${VER}`);

const {
  useRemoteComp,
  useRemoteCompAndSubVal,
  useRemotePureComp,
  useRemote2Comps,
  useRemoteLibComp,
  useRemotePureLibComp,
  useRemoteLegacyComp,
} = hooks;

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
