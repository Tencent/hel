/*
|--------------------------------------------------------------------------
|
| 载入模块提供方通过  hel-micro-react.renderApp 接口弹射出去的根组件
|
|--------------------------------------------------------------------------
*/
import React, { forwardRef } from 'react';
import type { AnyRecord, IInnerRemoteModuleProps, ILocalCompProps, IMicroAppLegacyProps, IMicroAppProps } from '../types';
import LocalCompRender from './LocalCompRender';
import RemoteCompRender from './RemoteCompRender';

export type MicroAppType = <T extends AnyRecord = AnyRecord>(props: IMicroAppProps<T>, ref?: React.Ref<any>) => React.ReactElement | null;

export type LocalCompType = (props: ILocalCompProps, ref?: React.Ref<any>) => React.ReactElement | null;

/**
 * 渲染地本地组件，满足用户想对当前项目的某个组件直接使用 shadow 隔离能力的情况
 * usage: <LocalComp Comp={SomeComp} />
 */
export const LocalComp: LocalCompType = forwardRef((props, reactRef) => {
  const passProps: ILocalCompProps = { ...props, reactRef };
  return <LocalCompRender {...passProps} />;
});

/**
 * usage: <MicroApp name="rule" />
 */
export const MicroApp: MicroAppType = forwardRef((props, reactRef) => {
  const passProps: IInnerRemoteModuleProps = { ...props, isLegacy: false, reactRef };
  return <RemoteCompRender {...passProps} />;
});

export type MicroAppLegacyType = <T extends AnyRecord = AnyRecord>(
  props: IMicroAppLegacyProps<T>,
  ref?: React.Ref<any>,
) => React.ReactElement | null;

/**
 * @deprecated 历史遗留组件，推荐用 MicroApp 替代
 * 渲染模块发布方通过 hel-micro-react.renderApp 接口发射出来的
 * 根组件，具体差异可查看 IsLegacy @typedef {import('../types').IsLegacy}
 */
export const MicroAppLegacy: MicroAppLegacyType = forwardRef((props, reactRef) => {
  // 重名名部分属性名，让下层保持统一
  const { version: versionId, cache: enableDiskCache, appProps: compProps, ...rest } = props;
  // 历史模式 mountShadowBodyForRef 一定为 true，确保 shadowBody 一定存在，让基于老包开发的提供模块可以正常工作
  const passProps: IInnerRemoteModuleProps = {
    ...rest,
    versionId,
    enableDiskCache,
    compProps,
    reactRef,
    isLegacy: true,
    mountShadowBodyForRef: true,
  };
  return <RemoteCompRender {...passProps} />;
});

/**
 * @deprecated 带 memo 的历史遗留组件，推荐用 MicroApp 替代
 * 渲染模块发布方通过 hel-micro-react.renderApp 接口发射出来的根组件
 * 确保挂载好之后，不再因属性变化导致重渲染，
 * 这是历史遗留用法，新版本里推荐用户自己决定要不要memo，以及自行决定如何比较 props
 */
export const MicroAppLegacyMemo = React.memo(MicroAppLegacy, () => true) as <T extends AnyRecord = AnyRecord>(
  props: IMicroAppLegacyProps<T>,
) => React.ReactElement;
