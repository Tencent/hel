// @ts-nocheck
import { getGlobalThis, getHelEventBus } from 'hel-micro-core';
import React from 'react';
import defaults from '../consts/defaults';
import { useForceUpdate } from '../hooks/share';
import type { IHelContext, IInnerRemoteModuleProps } from '../types';
import { getStaticShadowBodyRef } from '../wrap';
import BuildInSkeleton from './BuildInSkeleton';
import ShadowBody, { getHostData, getShadowBodyReadyEvName, tryMountStaticShadowBody } from './ShadowBody';

const { SHADOW_HOST_NAME, SHADOW_BODY_NAME } = defaults;

const bus = getHelEventBus();

export interface IMayShadowProps {
  loadResult: {
    Comp: any;
    styleStr: string;
    styleUrlList: string[];
  };
  options: IInnerRemoteModuleProps;
}

function getPassedProps(
  loadOptions: IInnerRemoteModuleProps,
  shadowAppRootRef: React.RefObject<any>,
  shadowBodyRootRef: React.RefObject<any>,
) {
  const { platform, name, versionId, compProps, isLegacy = false, ignoreHelContext = false, reactRef, children } = loadOptions;
  const staticShadowBodyRootRef = getStaticShadowBodyRef(name, loadOptions);
  // 供用户的  Select Picker Modal 等组件设置 Container 之用，以便安全的渲染到 shadow-dom 里
  const getShadowAppRoot = () => shadowAppRootRef.current || null;
  const getShadowBodyRoot = () => shadowBodyRootRef.current || null;
  const getStaticShadowBodyRoot = () => staticShadowBodyRootRef;
  const getEnsuredBodyRoot = () => getShadowBodyRoot() || getStaticShadowBodyRoot() || getGlobalThis()?.document.body || null;

  const helContext: IHelContext = {
    platform,
    name,
    versionId,
    getShadowAppRoot,
    getShadowBodyRoot,
    getStaticShadowBodyRoot,
    getEnsuredBodyRoot,
  };

  // avoid error: compProps object is not extensible,
  let passedProps = { ...compProps, ref: reactRef };
  if (isLegacy) {
    // getShadowContainer getShadowBodyContainer 作为历史方法暴露，让 MicroAppLegacy 载入老应用时不会报错
    Object.assign(helContext, { getShadowContainer: getShadowBodyRoot, getShadowBodyContainer: getShadowBodyRoot });
    passedProps = { appProps: compProps, children, ref: reactRef };
  }
  if (!ignoreHelContext) {
    // helContext 是关键属性key，不允许用户覆盖
    passedProps.helContext = helContext;
  }
  return passedProps;
}

function MayShadowComp(props: IMayShadowProps) {
  const { loadResult, options } = props;
  const { Comp, styleStr, styleUrlList } = loadResult;
  const { name, shadow, Skeleton, shadowWrapStyle = {}, shadowDelay, handleStyleStr, ShadowViewImpl } = options;

  const shadowAppRootRef = React.useRef(null);
  const shadowBodyRootRef = React.useRef(null);
  const forceUpdate = useForceUpdate();
  const data = getHostData(name, options);

  React.useEffect(() => {
    const staticRef = getStaticShadowBodyRef(name, options);
    if (shadow && !staticRef) {
      const evName = getShadowBodyReadyEvName(name, options);
      const evCb = () => {
        bus.off(evName, evCb);
        tryForceUpdate();
      };
      bus.on(evName, evCb);

      const renderProps = { data, delegatesFocus: true, styleSheets: styleUrlList, styleContent: styleStr };
      tryMountStaticShadowBody(renderProps, options);
      return () => {
        bus.off(evName, evCb);
      };
    }
    // here trust my code, ban react-hooks/exhaustive-deps
    // eslint-disable-next-line
  }, []);

  const isShadowRefsReady = () => {
    const staticRef = getStaticShadowBodyRef(name, options);
    return shadowAppRootRef.current && (options.mountShadowBodyForRef ? shadowBodyRootRef.current : true) && staticRef;
  };
  const tryForceUpdate = () => {
    isShadowRefsReady() && forceUpdate();
  };

  const onShadowAppRootReady = (shadowRoot) => {
    shadowAppRootRef.current = shadowRoot;
    tryForceUpdate();
  };
  const onShadowBodyRootReady = (shadowRoot) => {
    shadowBodyRootRef.current = shadowRoot;
    tryForceUpdate();
  };
  const passedProps = getPassedProps(options, shadowAppRootRef, shadowBodyRootRef);

  if (shadow) {
    // shawRoot 容器引用还未准备好时，继续骨架屏等待，
    // 确保 show 模式下透传给子组件的 helContext 的 getShadowAppRoot 方法一定能够活动 shawRoot 引用
    let uiContent: React.ReactNode = '';
    if (!isShadowRefsReady()) {
      const SkeletonComp = Skeleton || BuildInSkeleton;
      uiContent = <SkeletonComp />;
    } else {
      uiContent = <Comp {...passedProps} />;
    }

    const styleContent = handleStyleStr?.(styleStr) || styleStr;
    const commonProps = { id: name, data, style: shadowWrapStyle, styleSheets: styleUrlList, styleContent, shadowDelay };
    return (
      <>
        <ShadowViewImpl tagName={SHADOW_HOST_NAME} onShadowRootReady={onShadowAppRootReady} {...commonProps}>
          {uiContent}
        </ShadowViewImpl>
        {/*
          在body上为子应用挂一个 shadow 容器，方便子应用的 Select Picker Modal 等组件设置 Container 时，
          可以调用 getShadowBodyRoot 来设置挂载节点，以确保它们也能够渲染到 shadow-dom 里，从而保证样式隔离
          为性能考虑，默认不跟随组件实例挂载一个shadow 容器，会在组件初始实例化时生成一个静态 shadow 容器
          推荐用户优化考虑使用静态 shadow 容器，见代码 tryMountStaticShadowBody
       */}
        {options.mountShadowBodyForRef && (
          <ShadowBody tagName={SHADOW_BODY_NAME} onShadowRootReady={onShadowBodyRootReady} ShadowView={ShadowViewImpl} {...commonProps} />
        )}
      </>
    );
  }

  return <Comp {...passedProps} />;
}

export default MayShadowComp;
