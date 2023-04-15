import { appParamSrv } from 'hel-micro';
import React from 'react';
import type { IRemoteCompRenderConfig } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import MayShadowComp from '../MayShadowComp';
import { ensureOptionsDefault, tryTriggerOnStyleFetched } from '../share';
import useLoadRemoteModule from './useLoadRemoteModule';

/**
 * 远程组件渲染器
 */
export default function RemoteCompRender(props: IRemoteCompRenderConfig) {
  const { controlOptions, name } = props;
  const ensuredOptions = ensureOptionsDefault(controlOptions);
  const { platform, versionId } = appParamSrv.getPlatAndVer(name, ensuredOptions);
  Object.assign(ensuredOptions, { platform, versionId });
  const renderConfig = { ...props, controlOptions: ensuredOptions };

  const { errMsg, getModule } = useLoadRemoteModule(renderConfig);
  const { RemoteModule, styleStr, styleUrlList, moduleReady } = getModule();
  const mayHandledStyleStr = controlOptions.handleStyleStr?.(styleStr) || styleStr;
  React.useEffect(() => {
    if (moduleReady && !errMsg) {
      tryTriggerOnStyleFetched(renderConfig, mayHandledStyleStr);
    }
    // here trust my code, only trigger onStyleFetched one time
    // eslint-disable-next-line
  }, [moduleReady, errMsg]);

  if (!moduleReady) {
    const Skeleton = controlOptions.Skeleton || BuildInSkeleton;
    // @ts-ignore
    return <Skeleton />;
  }

  if (errMsg) {
    controlOptions.failCb?.(new Error(errMsg));
    return <RemoteModule />;
  }

  const compInfo = { Comp: RemoteModule, styleStr: mayHandledStyleStr, styleUrlList };
  return <MayShadowComp renderConfig={renderConfig} compInfo={compInfo} />;
}
