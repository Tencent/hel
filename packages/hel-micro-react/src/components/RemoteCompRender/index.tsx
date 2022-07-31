import type { IInnerRemoteModuleProps } from '../../types';
import React from 'react';
import { appParamSrv } from 'hel-micro';
import useLoadRemoteModule from './useLoadRemoteModule';
import { ensurePropsDefaults } from '../share';
import MayShadowComp, { IMayShadowProps } from '../MayShadowComp';

/**
 * 远程组件渲染器
 */
export default function RemoteCompRender(props: IInnerRemoteModuleProps) {
  const ensuredProps = ensurePropsDefaults(props);
  const { compProps, name, children, getStyleStr, shadow } = ensuredProps;

  const { errMsg, getModule } = useLoadRemoteModule(ensuredProps);
  const { RemoteModule, styleStr, styleUrlList } = getModule();

  const { platform, versionId } = appParamSrv.getPlatAndVer(name, ensuredProps);
  const wrapProps: IMayShadowProps = {
    Comp: RemoteModule, styleStr, styleUrlList, errMsg, compProps,
    platform, name, versionId, children, getStyleStr, shadow,
    isLegacy: props.isLegacy, Skeleton: props.Skeleton, mountShadowBodyForRef: props.mountShadowBodyForRef,
    reactRef: props.reactRef, createRoot: props.createRoot, ignoreHelContext: props.ignoreHelContext,
  };
  return <MayShadowComp {...wrapProps} />;
}
