import { appStyleSrv, preFetchApp, preFetchLib } from 'hel-micro';
import { helLoadStatus } from 'hel-micro-core';
import React from 'react';
import defaults from '../consts/defaults';
import type { IInnerRemoteModuleProps, ILocalCompProps } from '../types';
import ShadowView from './ShadowViewV2';

export function ensurePropsDefaults(props: IInnerRemoteModuleProps) {
  const ensuredProps = { ...props };

  ensuredProps.platform = props.platform || 'unpkg';
  ensuredProps.extraShadowCssList = props.extraShadowCssList || [];
  ensuredProps.extraShadowCssListToStr = props.extraShadowCssListToStr ?? defaults.CSS_LIST_TO_STR;
  ensuredProps.isLib = props.isLib ?? false;
  ensuredProps.shadow = props.shadow ?? defaults.SHADOW;
  ensuredProps.cssListToStr = props.cssListToStr ?? defaults.CSS_LIST_TO_STR;
  // 是否需要样式字符串（仅针对shadow配置有效）
  // 点击 props.appendCss 可进一步查看详细的默认值生成规则说明
  ensuredProps.appendCss = props.appendCss ?? !ensuredProps.shadow;
  ensuredProps.compProps = props.compProps || {};
  ensuredProps.children = ensuredProps.compProps.children;
  ensuredProps.isLegacy = props.isLegacy ?? false;
  ensuredProps.shadowWrapStyle = props.shadowWrapStyle || {};
  ensuredProps.ShadowViewImpl = props.ShadowViewImpl || ShadowView;

  return ensuredProps;
}

export function getErrResult(props: ILocalCompProps, errMsg: string) {
  const ErrorView = props.Error || (() => <h3 style={defaults.WARN_STYLE}>Hel MicroComp error: {errMsg}</h3>);
  return {
    RemoteModule: () => <ErrorView errMsg={errMsg} />,
    styleStr: '',
    styleUrlList: [],
    moduleReady: true,
  };
}

export function getFetchingResult(SkeletonView: any) {
  return {
    RemoteModule: SkeletonView,
    styleStr: '',
    styleUrlList: [],
    moduleReady: false,
  };
}

export function tryTriggerOnStyleFetched(props: IInnerRemoteModuleProps) {
  if (props.onStyleFetched) {
    const oriStyleStr = appStyleSrv.getStyleStr(props.name, props);
    const styleUrlList = appStyleSrv.getStyleUrlList(props.name, props);
    const mayHandledStyleStr = props.handleStyleStr?.(oriStyleStr) || oriStyleStr;
    props.onStyleFetched({ mayHandledStyleStr, oriStyleStr, styleUrlList });
  }
}

/**
 * 拉取远程组件样式核心逻辑
 * 标记执行中 ---> 开启骨架屏 ---> 异步拉取组件样式 ---> 拉取结束触发forceUpdate
 */
export function fetchLocalCompStyleStr(styleUrlList: string[], ctx: any) {
  const { fetchStyleStatusRef, setState, SkeletonView } = ctx;
  const fetStyleStatus = fetchStyleStatusRef.current;
  // 还在执行中，依然返回骨架屏
  if (fetStyleStatus === helLoadStatus.LOADING) {
    return getFetchingResult(SkeletonView);
  }

  fetchStyleStatusRef.current = helLoadStatus.LOADING;
  // 异步拉取样式函数
  appStyleSrv
    .fetchStyleByUrlList(styleUrlList)
    .then((styleStr) => {
      fetchStyleStatusRef.current = helLoadStatus.LOADED;
      setState({ styleStr });
    })
    .catch((err) => {
      fetchStyleStatusRef.current = helLoadStatus.LOADED;
      setState({ errMsg: err.message || 'err occurred while fetch component style' });
    });

  // 返回骨架屏
  return getFetchingResult(SkeletonView);
}

/**
 * 拉取远程组件样式核心逻辑
 * 标记执行中 ---> 开启骨架屏 ---> 异步拉取组件样式 ---> 拉取结束触发 setState
 */
export function fetchRemoteModuleStyle(props: IInnerRemoteModuleProps, ctx: any) {
  const { isLoadAppStyleExecutingRef, setState, SkeletonView } = ctx;
  // 还在执行中，依然返回骨架屏
  if (isLoadAppStyleExecutingRef.current) {
    return getFetchingResult(SkeletonView);
  }

  isLoadAppStyleExecutingRef.current = true;
  const { platform, versionId, extraShadowCssList = [] } = props;
  // 异步拉取样式函数
  appStyleSrv
    .fetchStyleStr(props.name, { platform, versionId, extraCssList: extraShadowCssList })
    .then((styleStr) => {
      isLoadAppStyleExecutingRef.current = false;
      tryTriggerOnStyleFetched(props);
      setState({ shadowStyleStr: styleStr, isShadowStyleStrFetched: true });
    })
    .catch((err) => {
      isLoadAppStyleExecutingRef.current = false;
      setState({ errMsg: err.message || 'err occurred while fetch component style', isShadowStyleStrFetched: true });
    });

  // 返回骨架屏
  return getFetchingResult(SkeletonView);
}

/**
 * 拉取远程组件核心逻辑
 * 标记执行中 ---> 开启骨架屏 ---> 异步拉取组件 ---> 拉取结束触发 forceUpdate
 */
export function fetchRemoteModule(props: IInnerRemoteModuleProps, ctx: any) {
  const { isLoadAppDataExecutingRef, setState, SkeletonView, forceUpdate } = ctx;
  // 还在执行中，依然返回骨架屏
  if (isLoadAppDataExecutingRef.current) {
    return getFetchingResult(SkeletonView);
  }

  isLoadAppDataExecutingRef.current = true;
  // 声明拉取函数
  const doPreFetch = async () => {
    if (props.isLib) return preFetchLib(props.name, props);
    return preFetchApp(props.name, props);
  };

  // 开始执行异步获取组件操作
  doPreFetch()
    .then((emitAppOrLib) => {
      if (!emitAppOrLib) {
        return setState({ errMsg: 'no component fetched' });
      }
      isLoadAppDataExecutingRef.current = false;
      forceUpdate();
    })
    .catch((err) => {
      isLoadAppDataExecutingRef.current = false;
      setState({ errMsg: err.message || 'err occurred while fetch component' });
    });

  // 返回骨架屏
  return getFetchingResult(SkeletonView);
}
