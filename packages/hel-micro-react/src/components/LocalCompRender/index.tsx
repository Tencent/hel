import React from 'react';
import type { AnyComp, ILocalCompProps } from '../../types';
import BuildInSkeleton from '../BuildInSkeleton';
import MayShadowComp, { IMayShadowProps } from '../MayShadowComp';
import useLoadStyle from './useLoadStyle';

/**
 * 本地组件渲染器，满足用户想对当前项目的某个组件直接使用 shadow 隔离能力的情况
 */
export default function LocalCompRender(props: ILocalCompProps) {
  const { compProps, name = 'LocalComp', shadow = true } = props;

  const { errMsg, getStyle } = useLoadStyle(props);
  // 此处 moduleReady 代表样式就绪
  const { styleStr, styleUrlList, moduleReady } = getStyle();
  if (!moduleReady) {
    const Skeleton = props.Skeleton || BuildInSkeleton;
    return <Skeleton />;
  }

  const Comp: AnyComp = props.Comp || BuildInSkeleton;
  const wrapProps: IMayShadowProps = {
    loadResult: {
      Comp,
      styleStr,
      styleUrlList,
      errMsg,
    },
    options: {
      ...props,
      isLegacy: false,
      name,
      compProps,
      shadow,
    },
  };
  return <MayShadowComp {...wrapProps} />;
}
