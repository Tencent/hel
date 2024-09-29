import { appStyleSrv, logicSrv, preFetchLib } from 'hel-micro';
import React, { forwardRef, useMemo } from 'react';
import EmptyView from '../components/EmptyView';
import RemoteCompRender, { useRemoteCompRender } from '../components/RemoteCompRender';
import { ensureOptionsDefault, tryTriggerOnStyleFetched } from '../components/share';
import defaults from '../consts/defaults';
import type { CompStatus, GetSubVal, IInnerUseRemoteCompOptions, IRemoteCompRenderConfig, IUseRemoteLibCompOptions } from '../types';
import { getSkeletonComp } from '../util';
import { delay, isEqual, useForceUpdate } from './share';

const { WARN_STYLE } = defaults;

function makeSubValGetter(name: string, compName: string, controlOptions: IInnerUseRemoteCompOptions) {
  const getSubVal: GetSubVal = (subCompName: string, waitVal?: any) => {
    const emitApp = logicSrv.getLibOrApp(name, controlOptions);
    const fallbackVal = waitVal !== undefined ? waitVal : EmptyView;
    return emitApp?.appProperties?.[compName]?.[subCompName] || fallbackVal;
  };
  const getSubVals = (subCompNames: string[], waitVal?: any) => {
    const vals: Record<string, any> = {};
    subCompNames.forEach((name) => (vals[name] = getSubVal(name, waitVal)));
    return vals;
  };
  return { getSubVal, getSubVals };
}

/**
 * 使用远程组件钩子函数核心逻辑，做好参数初始处理后
 * 基于 RemoteComp 并结合组件useMemo、ref转发两个基础工作进一步封装
 */
export function useRemoteCompLogic(name: string, compName: string, options: IInnerUseRemoteCompOptions) {
  const controlOptions: IInnerUseRemoteCompOptions = { ...(options || {}), compName, isLib: true };
  const ensuredOptions = ensureOptionsDefault(controlOptions);
  const { needMemo = true, platform, versionId, shadow, isCompPropsEqual } = ensuredOptions;

  const factory = () => {
    // @ts-ignore
    const Comp = forwardRef((compProps: React.PropsWithoutRef<any>, reactRef: React.Ref<any>) => {
      return <RemoteCompRender name={name} controlOptions={ensuredOptions} compProps={compProps} reactRef={reactRef} />;
    });
    // 用户不显式设置 needMemo 为 false 的话，会自动使用 React.memo 包裹远程组件做默认优化
    // 此时如用户不传递 isCompPropsEqual 函数的话会使用内部默认的浅比较函数 isEqual
    if (needMemo) {
      return React.memo(Comp, isCompPropsEqual || isEqual);
    }
    return Comp;
  };

  const { getSubVal, getSubVals } = makeSubValGetter(name, compName, controlOptions);
  // only accept name, compName, platform, versionId, shadow change,
  // will trigger unmount old one, mount new one
  // eslint-disable ban react-hooks/exhaustive-deps, trust my code
  const WrappedComp = useMemo(factory, [name, compName, platform, versionId, shadow]);

  return {
    Comp: WrappedComp,
    getSubVal,
    getSubVals,
  };
}

/**
 * 返回带执行状态的远程组件
 * 注：useRemoteCompStatusLogic 是后增的逻辑，为尽可能的减少对原来逻辑的影响，不在 useRemoteCompLogic 基础上扩展，
 * 而是新增 useRemoteCompStatusLogic 方法
 */
export function useRemoteCompStatusLogic(name: string, compName: string, options: IInnerUseRemoteCompOptions) {
  const controlOptions: IInnerUseRemoteCompOptions = { ...(options || {}), compName, isLib: true };
  const ensuredOptions = ensureOptionsDefault(controlOptions);
  const { needMemo = true, platform, versionId, shadow, isCompPropsEqual } = ensuredOptions;
  const { RemoteCompRender, isReady, err } = useRemoteCompRender({ name, controlOptions: ensuredOptions });
  const factory = () => {
    // @ts-ignore
    const Comp = forwardRef((compProps: React.PropsWithoutRef<any>, reactRef: React.Ref<any>) => {
      return <RemoteCompRender {...{ compProps, reactRef }} />;
    });
    if (needMemo) {
      return React.memo(Comp, isCompPropsEqual || isEqual);
    }
    return Comp;
  };
  const { getSubVal, getSubVals } = makeSubValGetter(name, compName, controlOptions);
  // eslint-disable ban react-hooks/exhaustive-deps, trust my code
  const WrappedComp = useMemo(factory, [name, compName, platform, versionId, shadow, isReady, err]);

  return {
    // 出现错误时，RemoteCompRender 指向一个错误展示组件
    Comp: err ? RemoteCompRender : WrappedComp,
    isReady,
    err,
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
  const compRef = React.useRef<{ Comp: any } & CompStatus>({ Comp: getSkeletonComp(Skeleton), isReady: false, err: null });

  // 获取组件逻辑还未执行过
  if (!isFetchExecuteRef.current) {
    isFetchExecuteRef.current = true;
    const fetchComp = async () => {
      const comps: any = await preFetchLib(name, restOptions);
      if (options.onStyleFetched && !appStyleSrv.isStyleFetched(name, options)) {
        const styleData = await appStyleSrv.fetchAppStyleData(name, options);
        const config: IRemoteCompRenderConfig = { name, controlOptions: options };
        tryTriggerOnStyleFetched(config, styleData);
      }
      if (options.delay) {
        await delay(options.delay);
      }
      const RemoteComp = comps?.[compName];
      if (RemoteComp && typeof RemoteComp === 'object') {
        // 用户可用此属性判断这是远程组件而非骨架屏
        // 此逻辑为历史遗留逻辑，新版已推荐使用 isReady 来做判断
        RemoteComp.__HelRemote__ = 1;
      }
      const Comp = RemoteComp || (() => <h3 style={WARN_STYLE}>Invalid compName {compName}</h3>);
      return { Comp, isReady: true, err: null };
    };

    fetchComp()
      .then((CompData) => {
        compRef.current = CompData;
      })
      .catch((err: any) => {
        compRef.current = {
          Comp: Error || (() => <h3 style={WARN_STYLE}>Load comp err {err.message}</h3>),
          isReady: false,
          err,
        };
      })
      .finally(() => {
        forceUpdate();
      });
  }

  return compRef.current;
}
