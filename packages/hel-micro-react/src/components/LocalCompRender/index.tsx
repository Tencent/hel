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
  const { cssList, compProps, name = 'LocalComp', shadow = true, Comp, handleStyleStr, onStyleFetched } = props;

  const { errMsg, getStyle } = useLoadStyle(props);
  // 此处 moduleReady 代表样式就绪
  const { styleStr, styleUrlList, moduleReady } = getStyle();
  const mayHandledStyleStr = handleStyleStr?.(styleStr) || styleStr;
  React.useEffect(() => {
    if (moduleReady && !errMsg && onStyleFetched) {
      onStyleFetched({ mayHandledStyleStr, oriStyleStr: styleStr, styleUrlList: cssList });
    }
    // here trust my code, only trigger onStyleFetched one time
    // eslint-disable-next-line
  }, [moduleReady, errMsg]);

  if (!moduleReady) {
    const Skeleton = props.Skeleton || BuildInSkeleton;
    return <Skeleton />;
  }
  if (errMsg) {
    return <h3 style={defaults.WARN_STYLE}>Hel LocalComp error: {errMsg}</h3>;
  }

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
