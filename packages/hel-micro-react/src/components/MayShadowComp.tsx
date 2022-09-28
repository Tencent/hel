// @ts-nocheck
import { getGlobalThis, getHelEventBus } from 'hel-micro-core';
import React from 'react';
import ShadowView from 'shadow-view';
import { useForceUpdate } from '../hooks/share';
import type { AnyComp, AnyCompOrNull, IHelContext, IsLegacy, IUseRemoteCompOptions } from '../types';
import BuildInSkeleton from './BuildInSkeleton';
import ShadowBody, { getShadowBodyReadyEvName, getStaticShadowBodyRef, tryMountStaticShadowBody } from './ShadowBody';
import ShadowViewV2 from './ShadowViewV2';

const bus = getHelEventBus();

export interface IMayShadowProps {
  platform: string;
  name: string;
  versionId: string;
  styleStr: string;
  compProps: any;
  Comp: AnyComp;
  setStyleAsString?: boolean;
  handleStyleStr?: (mayFetchedStr: string) => string;
  Skeleton?: AnyCompOrNull;
  styleUrlList?: string[];
  isLegacy?: IsLegacy;
  shadow?: boolean;
  shadowMode?: 'v1' | 'v2';
  shadowWrapStyle?: any;
  shadowDelay?: number;
  errMsg?: string;
  children?: any;
  reactRef?: any;
  createRoot?: IUseRemoteCompOptions['createRoot'];
  mountShadowBodyForRef?: IUseRemoteCompOptions['mountShadowBodyForRef'];
  ignoreHelContext?: IUseRemoteCompOptions['ignoreHelContext'];
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
    platform,
    name,
    versionId,
    getShadowBodyRoot,
    getShadowAppRoot,
    getStaticShadowBodyRoot,
    getEnsuredBodyRoot,
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
    passedProps = { ...passedProps, helContext };
  }

  return passedProps;
}

function MayShadowComp(props: IMayShadowProps) {
  const {
    errMsg,
    name,
    shadow,
    styleUrlList = [],
    styleStr,
    Comp,
    children,
    Skeleton,
    shadowMode = 'v1',
    shadowWrapStyle = {},
    shadowDelay,
    reactRef, // 透传用户可能传递下来的 ref
    setStyleAsString,
    handleStyleStr,
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

      const renderProps = { id: name, delegatesFocus: true, styleSheets: styleUrlList, styleContent: styleStr };
      tryMountStaticShadowBody(renderProps, props.createRoot);
      return () => {
        bus.off(evCb);
      };
    }
  }, []);

  const isShadowRefsReady = () => {
    if (shadowMode === 'v2') {
      // v2 暂无 ShadowAppRoot 结构
      return true;
    }

    return shadowAppRootRef.current && (props.mountShadowBodyForRef ? shadowBodyRootRef.current : true) && staticShadowBodyRootRef.current;
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

  let allProps = { ...passedProps, ref: reactRef };
  if (shadow) {
    // shawRoot 容器引用还未准备好时，继续骨架屏等待，
    // 确保 show 模式下透传给子组件的 helContext 的 getShadowAppRoot 方法一定能够活动 shawRoot 引用
    let TargetComp = Comp;
    if (!isShadowRefsReady()) {
      TargetComp = Skeleton || BuildInSkeleton;
      // 避免警告: Attempts to access this ref will fail
      allProps = {};
    }

    let finalStyleStr = '';
    let finalStyleUrlList = styleUrlList;
    if (setStyleAsString) {
      finalStyleStr = handleStyleStr?.(styleStr) || styleStr;
      finalStyleUrlList = [];
    }

    // TODO 可考虑将 staticShadowBody 管理下沉到 hel-micro-core 内部，
    // 以便让库发布者可使用 hel-lib-proxy getStaticShadowBody 获得 staticShadowBody 引用
    return (
      <>
        {shadowMode === 'v1' && (
          <ShadowView
            tagName="hel-shadow-app"
            id={name}
            delegatesFocus={true}
            shadowDelay={shadowDelay}
            style={shadowWrapStyle}
            styleSheets={finalStyleUrlList}
            styleContent={finalStyleStr}
            onShadowRootReady={onShadowAppRootReady}
          >
            <TargetComp {...allProps}>{children}</TargetComp>
          </ShadowView>
        )}
        {shadowMode === 'v2' && (
          <ShadowViewV2 styleWrap={shadowWrapStyle} styleSheets={finalStyleUrlList} styleContent={finalStyleStr} shadowDelay={shadowDelay}>
            <TargetComp {...allProps}>{children}</TargetComp>
          </ShadowViewV2>
        )}
        {/*
        在body上为子应用挂一个 shadow 容器，方便子应用的 Select Picker Modal 等组件设置 Container 时，
        可以调用 getShadowBodyRoot 来设置挂载节点，以确保它们也能够渲染到 shadow-dom 里，从而保证样式隔离
       */}
        {props.mountShadowBodyForRef && (
          <ShadowBody
            id={name}
            onShadowRootReady={onShadowBodyRootReady}
            delegatesFocus={true}
            styleSheets={finalStyleUrlList}
            styleContent={finalStyleStr}
          />
        )}
      </>
    );
  }

  return <Comp {...allProps}>{children}</Comp>;
}

export default MayShadowComp;
