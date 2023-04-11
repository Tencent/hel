import { appParamSrv, appStyleSrv } from 'hel-micro';
import React from 'react';
import type { IInnerRemoteModuleProps } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import MayShadowComp from '../MayShadowComp';
import { ensurePropsDefaults, tryTriggerOnStyleFetched } from '../share';
import useLoadRemoteModule from './useLoadRemoteModule';

/**
 * 远程组件渲染器
 */
export default function RemoteCompRender(props: IInnerRemoteModuleProps) {
  const ensuredProps = ensurePropsDefaults(props);
  const { platform, versionId } = appParamSrv.getPlatAndVer(ensuredProps.name, ensuredProps);
  Object.assign(ensuredProps, { platform, versionId });

  const { errMsg, getModule } = useLoadRemoteModule(ensuredProps);
  React.useEffect(() => {
    const isStyleFetched = appStyleSrv.isStyleFetched(props.name, props);
    isStyleFetched && tryTriggerOnStyleFetched(props);
    // here trust my code
    // eslint-disable-next-line
  }, []);

  const { RemoteModule, styleStr, styleUrlList, moduleReady } = getModule();

  if (!moduleReady) {
    const Skeleton = props.Skeleton || BuildInSkeleton;
    // @ts-ignore
    return <Skeleton />;
  }

  const loadResult = { Comp: RemoteModule, styleStr, styleUrlList, errMsg };
  return <MayShadowComp options={ensuredProps} loadResult={loadResult} />;
}
