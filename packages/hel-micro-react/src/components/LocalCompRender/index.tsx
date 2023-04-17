import React from 'react';
import defaults from '../../consts/defaults';
import type { ILocalCompProps } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import ForgetPassComp from '../ForgetPassComp';
import MayShadowComp, { IMayShadowProps } from '../MayShadowComp';
import useLoadStyle from './useLoadStyle';

/**
 * 本地组件渲染器，满足用户想对当前项目的某个组件直接使用 shadow 隔离能力的情况
 */
export default function LocalCompRender(props: ILocalCompProps) {
  const { compProps, name = 'LocalComp', shadow = true, Comp } = props;

  const { errMsg, styleStr, styleUrlList, moduleReady } = useLoadStyle(props);
  if (!moduleReady) {
    const Skeleton = props.Skeleton || BuildInSkeleton;
    return <Skeleton />;
  }
  if (errMsg) {
    return <h3 style={defaults.WARN_STYLE}>Hel LocalComp error: {errMsg}</h3>;
  }

  // 此处 moduleReady 代表样式就绪
  const wrapProps: IMayShadowProps = {
    compInfo: {
      Comp: Comp || ForgetPassComp,
      styleStr,
      styleUrlList,
    },
    renderConfig: {
      name,
      compProps,
      controlOptions: { ...props, isLegacy: false, shadow },
    },
  };
  return <MayShadowComp {...wrapProps} />;
}
