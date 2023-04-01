export { default as BuildInSkeleton } from './components/BuildInSkeleton';
export { LocalComp, MicroApp, MicroAppLegacy, MicroAppLegacyMemo } from './components/MicroApp';
export { default as ShadowBody } from './components/ShadowBody';
export { default as ShadowView } from './components/ShadowViewV2';
export { VER } from './consts/ver';
export {
  useRemote2Comps,
  useRemoteComp,
  useRemoteCompAndSubVal,
  useRemoteLegacyComp,
  useRemoteLibComp,
  useRemotePureComp,
  useRemotePureLibComp,
} from './hooks';
export { useExecuteCallbackOnce, useForceUpdate } from './hooks/share';
export { default as renderApp } from './process/renderApp';
export { getMayStaticShadowNode } from './wrap';
