// @ts-nocheck
import type { AnyComp, AnyCompOrNull, IsLegacy, IUseRemoteCompOptions, IHelContext } from '../types';
import React from 'react';
import ShadowView from 'shadow-view';
import { getHelEventBus, getGlobalThis } from 'hel-micro-core';
import { useForceUpdate } from '../hooks/share';
import ShadowBody, { getShadowBodyReadyEvName, getStaticShadowBodyRef, tryMountStaticShadowBody } from './ShadowBody';
import BuildInSkeleton from './BuildInSkeleton';

const bus = getHelEventBus();

export interface IMayShadowProps {
  platform: string;
  name: string;
  versionId: string;
  styleStr: string;
  compProps: any;
  Comp: AnyComp;
  Skeleton?: AnyCompOrNull;
  styleUrlList?: string[];
  isLegacy?: IsLegacy;
  shadow?: boolean;
  errMsg?: string;
  getStyleStr?: (mayFetchedStr: string) => string;
  children?: any;
  reactRef?: any;
  createRoot?: IUseRemoteCompOptions['createRoot'],
  mountShadowBodyForRef?: IUseRemoteCompOptions['mountShadowBodyForRef'],
  ignoreHelContext?: IUseRemoteCompOptions['ignoreHelContext'],
}


function getPassedProps(
  helProps: IMayShadowProps,
  shadowAppRootRef: React.RefObject<any>,
  shadowBodyRootRef: React.RefObject<any>,
  staticShadowBodyRootRef: React.RefObject<any>,
) {
  // 供用户的  Select Picker Modal 等组件设置 Container 之用，以便安全的渲染到 shadow-dom 里
  const getShadowAppRoot = () => shadowAppRootRef.current || null;
  const getShadowBodyRoot = () => shadowBodyRootRef.current || null;
  const getStaticShadowBodyRoot = () => staticShadowBodyRootRef.current || null;
  const getEnsuredBodyRoot = () => getShadowBodyRoot() || getStaticShadowBodyRoot() || getGlobalThis()?.document.body || null;

  const { platform, name, versionId, compProps, isLegacy = false, ignoreHelContext = false } = helProps;
  const helContext: IHelContext = {
    platform, name, versionId, getShadowBodyRoot, getShadowAppRoot, getStaticShadowBodyRoot, getEnsuredBodyRoot,
  };

  let passedProps;
  if (isLegacy) {
    // getShadowContainer getShadowBodyContainer 作为历史方法暴露，让 MicroAppLegacy 载入老应用时不会报错
    Object.assign(helContext, { getShadowContainer: getShadowBodyRoot, getShadowBodyContainer: getShadowBodyRoot });
    passedProps = { appProps: compProps, children: compProps.children };
  } else {
    passedProps = compProps;
  }

  if (!ignoreHelContext) {
    // helContext 是关键属性key，不允许用户覆盖
    passedProps.helContext = helContext;
  }

  return passedProps;
}


function MayShadowComp(props: IMayShadowProps) {
  const {
    errMsg, name, shadow, styleUrlList = [], styleStr, Comp, getStyleStr, children, Skeleton,
    reactRef, // 透传用户可能传递下来的 ref
  } = props;
  const shadowAppRootRef = React.useRef(null);
  const shadowBodyRootRef = React.useRef(null);
  const staticShadowBodyRootRef = React.useRef(getStaticShadowBodyRef(name));
  const forceUpdate = useForceUpdate();
  React.useEffect(() => {
    if (shadow && !staticShadowBodyRootRef.current) {
      const evName = getShadowBodyReadyEvName(name);
      const evCb = (shadowBodyRef: React.ReactHTMLElement<any>) => {
        bus.off(evCb);
        staticShadowBodyRootRef.current = shadowBodyRef;
        tryForceUpdate();
      };
      bus.on(evName, evCb);

      const styleContent = getStyleStr?.(styleStr) || styleStr;
      const renderProps = { id: name, delegatesFocus: true, styleSheets: styleUrlList, styleContent };
      tryMountStaticShadowBody(renderProps, props.createRoot);
      return () => {
        bus.off(evCb);
      };
    }
  }, []);

  const isShadowRefsReady = () => {
    return shadowAppRootRef.current
      && (props.mountShadowBodyForRef ? shadowBodyRootRef.current : true)
      && staticShadowBodyRootRef.current;
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
  const passedProps = getPassedProps(props, shadowAppRootRef, shadowBodyRootRef, staticShadowBodyRootRef);

  if (errMsg) {
    return React.createElement(Comp, passedProps);
  }

  if (shadow) {
    // shawRoot 容器引用还未准备好时，继续骨架屏等待，
    // 确保 show 模式下透传给子组件的 helContext 的 getShadowAppRoot 方法一定能够活动 shawRoot 引用
    let TargetComp = Comp;
    if (!isShadowRefsReady()) {
      TargetComp = Skeleton || BuildInSkeleton;
    }

    const finalStyleStr = getStyleStr?.(styleStr) || styleStr;
    // TODO 将 staticShadowBody 管理下沉到 hel-micro-core 内部，
    // 以便让库发布者可使用 hel-lib-proxy getStaticShadowBody 获得 staticShadowBody 引用
    return <>
      <ShadowView tagName="hel-shadow-app" id={name} delegatesFocus={true}
        styleSheets={styleUrlList} styleContent={finalStyleStr} onShadowRootReady={onShadowAppRootReady}
      >
        <TargetComp {...passedProps} ref={reactRef}>{children}</TargetComp>
      </ShadowView>
      {/* 
        在body上为子应用挂一个 shadow 容器，方便子应用的 Select Picker Modal 等组件设置 Container 时，
        可以调用 getShadowBodyRoot 来设置挂载节点，以确保它们也能够渲染到 shadow-dom 里，从而保证样式隔离
       */}
      { props.mountShadowBodyForRef
        && <ShadowBody id={name} onShadowRootReady={onShadowBodyRootReady} delegatesFocus={true}
          styleSheets={styleUrlList} styleContent={finalStyleStr}
        />
      }
    </>;
  }

  return <Comp {...passedProps} ref={reactRef}>{children}</Comp>;
}

export default MayShadowComp;
