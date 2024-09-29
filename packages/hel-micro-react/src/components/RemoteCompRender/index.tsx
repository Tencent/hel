import { appParamSrv } from 'hel-micro';
import React from 'react';
import type { IRemoteCompRenderConfig } from '../../types';
import { getSkeletonEl } from '../../util';
import MayShadowComp from '../MayShadowComp';
import { ensureOptionsDefault } from '../share';
import useLoadRemoteModule from './useLoadRemoteModule';

function getRenderConfig(props: IRemoteCompRenderConfig) {
  const { controlOptions, name } = props;
  const ensuredOptions = ensureOptionsDefault(controlOptions);
  const { platform, versionId } = appParamSrv.getPlatAndVer(name, ensuredOptions);
  Object.assign(ensuredOptions, { platform, versionId });
  return { ...props, controlOptions: ensuredOptions };
}

export function useRemoteCompRender(props: IRemoteCompRenderConfig) {
  const { controlOptions } = props;
  const renderConfig = getRenderConfig(props);

  const { errMsg, RemoteModule, styleStr, styleUrlList, moduleReady } = useLoadRemoteModule(renderConfig);
  if (!moduleReady) {
    return { RemoteCompRender: () => getSkeletonEl(controlOptions.Skeleton), isReady: false, err: null };
  }
  if (errMsg) {
    controlOptions.failCb?.(new Error(errMsg));
    return { RemoteCompRender: () => RemoteModule, isReady: false, err: new Error(errMsg) };
  }

  const compInfo = { Comp: RemoteModule, styleStr, styleUrlList };
  return {
    RemoteCompRender: (props: any) => {
      const { reactRef, compProps } = props;
      if (reactRef) {
        renderConfig.reactRef = reactRef;
      }
      if (compProps) {
        renderConfig.compProps = compProps;
      }
      return <MayShadowComp renderConfig={renderConfig} compInfo={compInfo} />;
    },
    isReady: true,
    err: null,
  };
}

/**
 * 远程组件渲染器
 */
export default function RemoteCompRender(props: IRemoteCompRenderConfig) {
  // TODO: 暂不替换为如下简单写法，后续验证无误后再替换
  // const { RemoteCompRender } = useRemoteCompRender(props);
  // return <RemoteCompRender />;
  const { controlOptions } = props;
  const renderConfig = getRenderConfig(props);
  const { errMsg, RemoteModule, styleStr, styleUrlList, moduleReady } = useLoadRemoteModule(renderConfig);
  if (!moduleReady) {
    return getSkeletonEl(controlOptions.Skeleton);
  }
  if (errMsg) {
    controlOptions.failCb?.(new Error(errMsg));
    return <RemoteModule />;
  }
  const compInfo = { Comp: RemoteModule, styleStr, styleUrlList };
  return <MayShadowComp renderConfig={renderConfig} compInfo={compInfo} />;
}
