import { appStyleSrv, core, logicSrv, preFetchLib } from 'hel-micro';
import React, { forwardRef, useMemo } from 'react';
import BuildInSkeleton from '../components/BuildInSkeleton';
import EmptyView from '../components/EmptyView';
import RemoteCompRender from '../components/RemoteCompRender';
import { tryTriggerOnStyleFetched } from '../components/share';
import defaults from '../consts/defaults';
import type { GetSubVal, IInnerRemoteModuleProps, IInnerUseRemoteCompOptions, IUseRemoteLibCompOptions } from '../types';
import { delay, useForceUpdate } from './share';

const { WARN_STYLE } = defaults;
const { DEFAULT_PLAT } = core.helConsts;

/**
 * 使用远程组件钩子函数核心逻辑，做好参数初始处理后
 * 基于 RemoteComp 并结合组件useMemo、ref转发两个基础工作进一步封装
 */
export function useRemoteCompLogic(name: string, compName: string, options: IInnerUseRemoteCompOptions) {
  const passProps: IInnerRemoteModuleProps = { ...(options || {}), name, compName, isLib: true };
  passProps.platform = passProps.platform || DEFAULT_PLAT;

  const { needMemo = true } = passProps;
  const factory = () => {
    return forwardRef((compProps: React.PropsWithoutRef<any>, reactRef: React.Ref<any>) => {
      return <RemoteCompRender {...{ ...passProps, compProps, reactRef }} />;
    });
  };
  const getSubVal: GetSubVal = (subCompName: string, waitVal?: any) => {
    const emitApp = logicSrv.getLibOrApp(name, passProps);
    const fallbackVal = waitVal !== undefined ? waitVal : EmptyView;
    return emitApp?.appProperties?.[compName]?.[subCompName] || fallbackVal;
  };
  const getSubVals = (subCompNames: string[], waitVal?: any) => {
    const vals: Record<string, any> = {};
    subCompNames.forEach((name) => (vals[name] = getSubVal(name, waitVal)));
    return vals;
  };
  const MemoComp = useMemo(factory, [name, compName, passProps.platform, passProps.versionId, passProps.shadow]);

  return {
    Comp: needMemo ? MemoComp : factory(),
    getSubVal,
    getSubVals,
  };
}

/**
 * 区别于 useRemoteCompLogic，该钩子函数跳过所有步骤，直接基于 preFetchLib 获取远程组件
 * @param name
 * @param compName
 * @param options
 * @returns
 */
export function useRemoteLibCompLogic(name: string, compName: string, options: IUseRemoteLibCompOptions) {
  const { Skeleton, Error, ...restOptions } = options;
  restOptions.platform = restOptions.platform || 'unpkg';
  const forceUpdate = useForceUpdate();
  const isFetchExecuteRef = React.useRef(false);
  const compRef = React.useRef((Skeleton || BuildInSkeleton) as any);

  if (!isFetchExecuteRef.current) {
    isFetchExecuteRef.current = true;
    const fetchComp = async () => {
      const comps: any = await preFetchLib(name, restOptions);
      if (options.onStyleFetched && !appStyleSrv.isStyleFetched(name, options)) {
        await appStyleSrv.fetchStyleStr(name, options);
      }
      tryTriggerOnStyleFetched({ name, ...options });
      if (options.delay) {
        await delay(options.delay);
      }
      const RemoteComp = comps?.[compName];
      if (RemoteComp && typeof RemoteComp === 'object') {
        RemoteComp.__HelRemote__ = 1; // 用户可用此属性判断这是远程组件而非骨架屏
      }
      const Comp = RemoteComp || (() => <h3 style={WARN_STYLE}>Invalid compName {compName}</h3>);
      return Comp;
    };
    fetchComp()
      .then((Comp) => {
        compRef.current = Comp;
      })
      .catch((err: any) => {
        compRef.current = Error || (() => <h3 style={WARN_STYLE}>Load comp err {err.message}</h3>);
      })
      .finally(() => {
        forceUpdate();
      });
  }

  return compRef.current;
}
