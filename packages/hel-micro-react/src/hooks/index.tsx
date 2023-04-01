import type {
  AnyComp,
  AnyRecord,
  GetSubVal,
  GetSubVals,
  IUseRemoteCompOptions,
  IUseRemoteLibCompOptions,
  Len2StrArr,
  ObjectFromList,
} from '../types';
import { useRemoteCompLogic, useRemoteLibCompLogic } from './base';

/**
 * 获取 hel-lib-proxy 由 libReady 接口弹射的 react ui 组件
 * 拿到的组件渲染时可自动享受到 shadow-dom 样式隔离能力
 * @param name - 应用名
 * @param compName  - 组件名
 * @param options
 * @returns
 */
export function useRemoteComp<T extends any = React.ForwardRefExoticComponent<any>>(
  name: string,
  compName: string,
  options?: IUseRemoteCompOptions,
) {
  const { Comp } = useRemoteCompLogic(name, compName, options || {});
  return Comp as T;
}

/**
 * 某些组件下面挂载了子组件并导出，如 Tabs 下有 Tabs.TabPane，此时可调用 getSubVal 函数获得子组件
 * 类型 T 拼接 AnyRecord 是为了让用户在代理对象下补子属性时 ts 编译能够通过
 * ```ts
 *  const ret = useRemoteCompAndSubVal(...);
 *  if (compName === 'Tabs') {
 *    // 拼接 AnyRecord 后，支持此处动态挂上子组件
 *    ret.Comp.TabPanel = ret.getSubVal<Lib['Tabs']['TabPanel']>('TabPanel');
 *  }
 * ```
 */
export function useRemoteCompAndSubVal<T extends any = React.ForwardRefExoticComponent<any> & AnyRecord>(
  name: string,
  compName: string,
  options?: IUseRemoteCompOptions,
) {
  const CompAndSubVal = useRemoteCompLogic(name, compName, options || {});
  return CompAndSubVal as { Comp: T; getSubVal: GetSubVal; getSubVals: GetSubVals };
}

/**
 * 使用不携带任何样式的原始组件，用户可透传 onStyleFetched 自己做 shadow 实现
 * 区别于 useRemoteLibComp，该函数会保证样式不追加到文档上
 */
export function useRemotePureComp<T extends any = React.ForwardRefExoticComponent<any> & AnyRecord>(
  name: string,
  compName: string,
  options?: Omit<IUseRemoteCompOptions, 'appendCss' | 'shadow'>,
) {
  const targetOptions: IUseRemoteCompOptions = {
    ...(options || {}),
    shadow: false,
    appendCss: false,
  };

  const { Comp } = useRemoteCompLogic(name, compName, targetOptions);
  return Comp as T;
}

/**
 * 使用不携带任何样式的原始组件，用户可透传 onStyleFetched 自己做 shadow 实现
 * 区别于 useRemoteLibComp ，该函数会保证样式不追加到文档上
 * 区别于 useRemotePureComp ，该函数直接基于 preFetchLib 实现，调用性能开销会少于 useRemotePureComp
 */
export function useRemotePureLibComp<T extends any = React.ForwardRefExoticComponent<any> & AnyRecord>(
  name: string,
  compName: string,
  options?: Omit<IUseRemoteLibCompOptions, 'appendCss'>,
) {
  const targetOptions: IUseRemoteLibCompOptions = { ...(options || {}), appendCss: false };

  const Comp = useRemoteLibCompLogic(name, compName, targetOptions);
  return Comp as T;
}

/**
 * useRemoteComp 的二次封装，一次获取2个组件
 * ```js
 *  cont comps = useRemote2Comps('xx', ['aa', 'bb'] as const);
 * ```
 * 如需要2以上的个组件，可自行封装或单独基于 useRemoteComp 逐个获取
 */
export function useRemote2Comps<T extends Len2StrArr | Readonly<Len2StrArr>>(name: string, compNames: T, options?: IUseRemoteCompOptions) {
  const [name1, name2] = compNames;
  const comps: any = {};
  comps[name1] = useRemoteComp(name, name1, options);
  comps[name2] = useRemoteComp(name, name2, options);
  return comps as ObjectFromList<typeof compNames, AnyComp>;
}

/**
 * 该钩子函数跳过所有 shadow 判断的附加逻辑，直接基于 preFetchLib 获取远程组件，
 * 调用性能开销会少于 useRemoteComp，返回的组件一定是非 shadow 模式渲染的组件
 */
export function useRemoteLibComp(name: string, compName: string, options?: IUseRemoteLibCompOptions) {
  const Comp = useRemoteLibCompLogic(name, compName, options || {});
  return Comp;
}

/**
 * @deprecated
 * 对应上 MicroAppLegacy
 */
export function useRemoteLegacyComp(name: string, compName: string, options?: IUseRemoteCompOptions) {
  const { Comp } = useRemoteCompLogic(name, compName, { ...(options || {}), shadow: true, isLegacy: true });
  return Comp;
}
