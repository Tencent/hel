import type {
  IInnerUseRemoteCompOptions, IInnerRemoteModuleProps, IUseRemoteLibCompOptions, GetSubVal,
} from '../types';
import React, { useMemo, forwardRef } from 'react';
import { preFetchLib, appStyleSrv } from 'hel-micro';
import { getVerLib } from 'hel-micro-core';
import RemoteCompRender from '../components/RemoteCompRender';
import BuildInSkeleton from '../components/BuildInSkeleton';
import EmptyView from '../components/EmptyView';
import { tryTriggerOnStyleFetched } from '../components/share';
import defaults from '../consts/defaults';
import { getDefaultPlatform } from '../_diff/index';
import { useForceUpdate, delay } from './share';

const { H1_STYLE } = defaults;

/**
 * 使用远程组件钩子函数核心逻辑，做好参数初始处理后
 * 基于 RemoteComp 并结合组件useMemo、ref转发两个基础工作进一步封装
 */
export function useRemoteCompLogic(name: string, compName: string, options: IInnerUseRemoteCompOptions) {
  const passProps: IInnerRemoteModuleProps = { ...(options || {}), name, compName, isLib: true };
  passProps.platform = getDefaultPlatform(passProps.platform);

  const { needMemo = true } = passProps;
  const factory = () => {
    return forwardRef((compProps: React.PropsWithoutRef<any>, reactRef: React.Ref<any>) => {
      return <RemoteCompRender {...{ ...passProps, compProps, reactRef }} />;
    });
  };
  const getSubVal: GetSubVal = (subCompName: string, waitVal?: any) => {
    const lib = getVerLib(name, options);
    return lib?.[compName]?.[subCompName] || waitVal || EmptyView;
  };

  return {
    Comp: needMemo
      ? useMemo(factory, [name, compName, passProps.platform, passProps.versionId, passProps.shadow])
      : factory(),
    getSubVal
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
  restOptions.platform = getDefaultPlatform(restOptions.platform);
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
      const Comp = RemoteComp || (() => <h1 style={H1_STYLE}>Invalid compName {compName}</h1>);
      return Comp;
    };
    fetchComp().then((Comp) => {
      compRef.current = Comp;
    }).catch((err: any) => {
      compRef.current = Error || (() => <h1 style={H1_STYLE}>Load comp err {err.message}</h1>);
    }).finally(() => {
      forceUpdate();
    });
  }

  return compRef.current;
}
