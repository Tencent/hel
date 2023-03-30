import { appParamSrv, appStyleSrv } from 'hel-micro';
import React from 'react';
import type { IInnerRemoteModuleProps } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import MayShadowComp, { IMayShadowProps } from '../MayShadowComp';
import { ensurePropsDefaults, tryTriggerOnStyleFetched } from '../share';
import useLoadRemoteModule from './useLoadRemoteModule';

/**
 * 远程组件渲染器
 */
export default function RemoteCompRender(props: IInnerRemoteModuleProps) {
  const ensuredProps = ensurePropsDefaults(props);
  const { compProps, name, children, handleStyleStr, shadow, shadowWrapStyle } = ensuredProps;
  const { platform, versionId } = appParamSrv.getPlatAndVer(name, ensuredProps);

  const { errMsg, getModule } = useLoadRemoteModule(ensuredProps);
  React.useEffect(() => {
    const isStyleFetched = appStyleSrv.isStyleFetched(props.name, props);
    isStyleFetched && tryTriggerOnStyleFetched(props);
  }, []);

  const { RemoteModule, styleStr, styleUrlList, moduleReady } = getModule();

  if (!moduleReady) {
    const Skeleton = props.Skeleton || BuildInSkeleton;
    // @ts-ignore
    return <Skeleton />;
  }

  const wrapProps: IMayShadowProps = {
    Comp: RemoteModule,
    styleStr,
    styleUrlList,
    errMsg,
    compProps,
    platform,
    name,
    versionId,
    children,
    handleStyleStr,
    isLegacy: props.isLegacy,
    Skeleton: props.Skeleton,
    mountShadowBodyForRef: props.mountShadowBodyForRef,
    reactRef: props.reactRef,
    createRoot: props.createRoot,
    ignoreHelContext: props.ignoreHelContext,
    shadow,
    shadowWrapStyle,
    shadowDelay: props.shadowDelay,
    setStyleAsString: ensuredProps.setStyleAsString,
  };
  return <MayShadowComp {...wrapProps} />;
}
