import type { ILocalCompProps, AnyComp } from '../../types';
import React from 'react';
import useLoadStyle from './useLoadStyle';
import MayShadowComp, { IMayShadowProps } from '../MayShadowComp';
import BuildInSkeleton from '../BuildInSkeleton';
import defaults from '../../consts/defaults';


/**
 * 本地组件渲染器，满足用户想对当前项目的某个组件直接使用 shadow 隔离能力的情况
 */
export default function LocalCompRender(props: ILocalCompProps) {
  const { children, reactRef, compProps, name = 'LocalComp',
    shadow = true, shadowMode, shadowWrapStyle, shadowDelay, setStyleAsString = defaults.SET_STYLE_AS_STRING,
  } = props;

  const { errMsg, getStyle } = useLoadStyle(props);
  // 此处 moduleReady 代表样式就绪
  const { styleStr, styleUrlList, moduleReady } = getStyle();
  if (!moduleReady) {
    const Skeleton = props.Skeleton || BuildInSkeleton;
    return <Skeleton />;
  }

  const Comp: AnyComp = props.Comp || BuildInSkeleton;
  const wrapProps: IMayShadowProps = {
    name, Comp, styleStr, styleUrlList, errMsg, compProps, platform: 'hel', versionId: '',
    children, Skeleton: props.Skeleton, isLegacy: false,
    shadow, shadowMode, shadowWrapStyle, shadowDelay, setStyleAsString,
    reactRef,
  };
  return <MayShadowComp {...wrapProps} />;
}
