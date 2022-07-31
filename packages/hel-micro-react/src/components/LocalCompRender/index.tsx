import type { ILocalCompProps, AnyComp } from '../../types';
import React from 'react';
import useLoadStyle from './useLoadStyle';
import MayShadowComp, { IMayShadowProps } from '../MayShadowComp';
import BuildInSkeleton from '../BuildInSkeleton';


/**
 * 本地组件渲染器，满足用户想对当前项目的某个组件直接使用 shadow 隔离能力的情况
 */
export default function LocalCompRender(props: ILocalCompProps) {
  const { children, reactRef, compProps, name = 'LocalComp' } = props;

  const { errMsg, getStyle } = useLoadStyle(props);
  const { styleStr, styleUrlList } = getStyle();

  const Comp: AnyComp = props.Comp || BuildInSkeleton;
  const wrapProps: IMayShadowProps = {
    name, Comp, styleStr, styleUrlList, errMsg, compProps, platform: 'hel', versionId: '',
    children, shadow: true, Skeleton: props.Skeleton, isLegacy: false,
    reactRef,
  };
  return <MayShadowComp {...wrapProps} />;
}
