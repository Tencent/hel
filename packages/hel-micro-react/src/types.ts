import type { IPreFetchOptionsBase, IStyleDataResult } from 'hel-micro';
import type { Platform } from 'hel-types';
import React from 'react';

// react-dom <= 16.9.10 并无此类型，取 ReactDOM.Container 会报红警告，这里单独声明一下
export type Container = Element | Document | DocumentFragment;

export type AnyRecord = Record<string, any>;

export type AnyComp = React.FC<any> | React.ComponentClass<any>;

export type AnyCompOrNull = AnyComp | null | undefined;

export type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export type Len2StrArr = [string, string];

export type GetSubVal = <T extends any = any>(subCompName: string, waitVal?: any) => T;

export type GetSubVals = <T extends AnyRecord = AnyRecord>(subCompNames: string[], waitVal?: any) => T;

/**
 * 默认：false
 *
 * 为 true 时，表示使用历史的透传 props 方式
 * 为了让老版本 hel-micro-react 载入远程组件不报错，保持数据形如 { helContext, children, appProps } 透传给远程组件
 *
 * 为 false 时，表示使用最新的透传 props 方式
 * 最新模式透传给远程组件的 props 形如 { helContext, children, ...otherUserDefineProps }
 * 即将用户组件上定义的所有属性原封不动传给远程组件，并额外注入一个 helContext 属性
 */
export type IsLegacy = boolean;

interface IUseOptionsCommon {
  /**
   * 组件样式获取完毕时触发，如返回新的字符串，则会替换掉 renderStyleStr ，为 shadowdom 组件提供样式
   * params参数仅提供给用户参考，shadow 为 false 时 renderStyleStr 为 空字符串
   * @example
   * 有一些框架自己的css变量定义，但这些定义未参与css打包时，可以配置 onStyleFetched 主动注入
   * ```ts
   * onStyleFetched: ({ renderStyleStr }) => {
   *   return `${cssVarStr} ${renderStyleStr}`;
   * },
   * ```
   * @example
   * 某些特殊场景需要独立返回新的样式字符串，例如：
   * 用于配置本地调试 Component 时之用，作用于 Component 组件处于本地调试的 shadow 渲染时，设置样式字符串
   * ```ts
   * // 如
   * ()=>{
   *  let styleStr = '';
   *  document.querySelectorAll('style').forEach(item=>{styleStr+=item.innerText;});
   *  return styleStr;
   * }
   * // 如
   * document.querySelectorAll('style')[0].innerText
   * // 或者组件使用方处于某种目的，想强制重新设置样式字符串
   *
   * ```
   * @param params
   * @returns
   */
  onStyleFetched?: (params: IStyleDataResult) => void | string;
  /**
   * 异步加载组件过程的过度组件
   */
  Skeleton?: AnyCompOrNull;
  /**
   * default: ()=> <h1>HelMicroComp error {errMsg}</h1>
   * 渲染出现错误时的 Error 组件
   */
  Error?: (props: { errMsg: string }) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}

interface ICompRenderOptions {
  /**
   * default: true
   */
  shadow?: boolean;
  /**
   * default: undefined，该属性仅在 shadow 为 true 时有意义
   * 表示包裹shadowRoot节点的div节点的额外样式
   */
  shadowWrapStyle?: React.CSSProperties;
  /**
   * default: undefined，该属性仅在 shadow 为 true 时有意义
   * 表示构建 shadow-dom 的延迟时间
   */
  shadowDelay?: number;
  /**
   * default: true，该属性仅在 shadow 为 true 时有意义
   * 是否把 IPreFetchOptionsBase.extraCssList 和应用自身的构建产物里的样式列表转为字符串后再注入到 shadowdom 里
   * 默认 true 值，避免 shadowdom 组件渲染时出现抖动情况
   */
  cssListToStr?: boolean;
  /**
   * default: false
   * shadow 模式渲染时，是否为为当前实例挂载一个 shadowBody 容器到 document 下，
   * 通常用于组件内部的 Picker Select Modal Drawer 等组件设置 getContainer 时用，
   * 以便让这些组件也安全的渲染到样式隔离的shadowBody 容器里，
   * 为性能考虑，默认是false，让用户优先考虑设置 staticShadowBody
   */
  mountShadowBodyForRef?: boolean;
  /**
   * 自定义的 shadowdom 渲染器，替换内置的渲染器
   * @param props
   * @returns
   */
  ShadowViewImpl?: ShadowViewImplComp;
  /**
   * 在shadow模式下，默认使用 ReactDOM.render 挂载 shadowBody 到 body 下,
   * 18版本react推荐使用 react-dom/client.createRoot 方法替代 ReactDOM.render
   * 但程序内部无法写为如下格式来动态判断是否使用 createRoot 方法
   * ```ts
   *   if (ReactDOM.createRoot) {
   *      // 16 版本 react 时，webpack 编译到此处就报错 webpackMissingModule
   *      const domClient = await import('react-dom/client');
   *      const root = domClient.createRoot(mountNode);
   *      root.render(uiShadowView);
   *   } else {
   *      ReactDOM.render(uiShadowView, mountNode);
   *   }
   * ```
   * 如果如果用户在18版本 react 下调用 useRemoteComp 方法并使用了 shadow 模式，为避免 react-dom/client.createRoot 警告
   * 需人工把 createRoot 传递下来
   */
  createRoot?: (...args: any) => any;
  /**
   * default: false
   * 是否需要忽略把 helContext 透传给远程组件，
   * 默认不忽略，总是透传 helContext 给远程组件
   * 如需要忽略，可设置此项为 true
   */
  ignoreHelContext?: boolean;
}

/**
 * 用户调用 MicroApp 需要传递的类型描述
 */
export interface IUseRemoteCompOptions extends IPreFetchOptionsBase, IUseOptionsCommon, ICompRenderOptions {
  /** 如果指定了 Component，表示复用 name 对应的预设应用样式，但使用用户透传的组件渲染 */
  Component?: AnyCompOrNull;
  /**
   * default: true
   * 远程组件默认是 memo 起来的，设置为 false 关闭 memo 功能
   */
  needMemo?: boolean;
  failCb?: (err: Error) => void;
  /**
   * default: false [when shadow is true], true [when shadow is false]
   * 未显式设置 appendCss 时，它的默认受设置 shadow 影响，大多数时候应该走此规则，不需要人为设置
   * 表示是否向 document 上附加样式外联样式标签
   */
  appendCss?: boolean;
  /**
   * 当需要提高远程组件渲染性能时，可定制此函数
   */
  isCompPropsEqual?: <T extends AnyRecord = AnyRecord>(prevProps: T, nextProps: T) => boolean;
}

/**
 * 用户调用 MicroApp 需要传递的类型描述
 */
export type IMicroAppProps<T extends AnyRecord = AnyRecord> = IUseRemoteCompOptions & ICompRenderConfig<T>;

export interface IInnerUseRemoteCompOptions extends IUseRemoteCompOptions {
  /**
   * default: false
   * 内部使用属性，是否需要兼容历史逻辑
   */
  isLegacy?: IsLegacy;
  /**
   * default: false
   * 内部使用属性，是否lib
   */
  isLib?: boolean;
  /**
   * default: false
   * 内部使用属性，controlOptions里一些关键属性的是否已保证了默认值
   */
  isDefaultEnsured?: boolean;
  /**
   * 当 lisLib 为 true 时，获取组件集里的具体的组件名
   */
  compName?: string;
}

export interface ICompRenderConfig<T extends AnyRecord = AnyRecord> {
  /** 应用名称 */
  name: string;
  /**
   * 透传的组件属性
   */
  compProps?: T;
  /**
   * 透传的孩子组件
   */
  children?: any;
  reactRef?: any;
}

export interface IRemoteCompRenderConfig extends ICompRenderConfig {
  controlOptions: IInnerUseRemoteCompOptions;
}

type IMicroAppLegacyPropsBase<T extends AnyRecord = AnyRecord> = Omit<IMicroAppProps<T>, 'versionId' | 'enableDiskCache'>;

/**
 * MicroAppLegacy 组件的历史遗留属性，后面的新组件和新接口为了统一词汇，
 * 一律都复用 IPreFetchOptionsBase 里的命名
 */
export interface IMicroAppLegacyProps<T extends AnyRecord = AnyRecord> extends IMicroAppLegacyPropsBase<T> {
  version?: string;
  cache?: boolean;
  appProps?: T;
}

export interface ILocalCompProps extends ICompRenderConfig, IUseOptionsCommon, ICompRenderOptions {
  /** 要加载的样式样式列表 */
  cssList: string[];
  /** 要渲染的目标组件 */
  Comp?: AnyCompOrNull;
}

export interface IUseRemoteLibCompOptions extends IPreFetchOptionsBase, IUseOptionsCommon {
  /** 组件获取到后，延迟返回的时间，单位：ms */
  delay?: number;
}

export interface IRenderAppOptions {
  App: AnyComp;
  appGroupName: string;
  hostNodeId?: string;
  /** 是否自渲染，大多数情况下不需要传入，让子应用自己通过内部维护的 signal 去做判断 */
  renderSelf?: boolean;
  /**
   * 当 renderSelf 为 true 时，如果用户传递了定制的 renderSelfFn 函数（例如react18的新渲染方式），
   * 则会执行此函数，否则默认按 ReactDom.render 来执行自渲染
   */
  renderSelfFn?: (App: AnyComp, hostNode: Container) => void;
  /** 也可以透传 createRoot 句柄，来支持18 版本react的渲染 */
  createRoot?: (...args: any[]) => any;
  lifecycle?: {
    mount: () => void;
    unmount: () => void;
  };
  /**
   * default：'unpkg'
   */
  platform?: Platform;
}

export interface IHelContext {
  platform: string;
  name: string;
  versionId: string;
  /**
   * shadow 模式下组件自身挂载的 shadow-dom 节点
   */
  getShadowAppRoot: () => React.ReactHTMLElement<any> | null;
  /**
   * 当做远程组件内部的 Select Picker Modal 等组件设置 Container 时，
   * 可以调用 getShadowBodyRoot 来设置挂载节点，以确保它们也能够渲染到 shadow-dom 里，从而保证样式隔离
   * 注意：非shadow 模式渲染，获取不到 shadow root 的
   * shadowBody的生成规则，受 @see {IMicroAppProps['mountShadowBodyForRef']} 影响
   */
  getShadowBodyRoot: () => React.ReactHTMLElement<any> | null;
  /**
   * 同 getShadowBodyRoot 作用一样，不同是 staticShadowBody 它只会生成一个，shadowBody 会为每一个组件都单独生成一个
   */
  getStaticShadowBodyRoot: () => React.ReactHTMLElement<any> | null;
  /**
   * 优先取 getShadowBodyRoot，再取 getStaticShadowBodyRoot，最后取 document.body
   */
  getEnsuredBodyRoot: () => React.ReactHTMLElement<any> | null;
}

/**
 * 被远程加载的组件可以使用该类型来包裹 props
 * 因用户可能设置 ignoreHelContext 为 true，所以此处 helContext 是 ?
 */
export type IHelProps<ReactProps> = ReactProps & { helContext?: IHelContext };

export interface IShadowViewImplProps {
  onShadowRootReady: (shadowRoot: ShadowRoot) => void;
  /**
   * 根元素的 tagName，默认为 'hel-shadow-view'
   */
  tagName?: string;
  /**
   * shadow host 元素的样式
   */
  style?: React.CSSProperties;
  /**
   * default: '.3s', 显示动画持续时间，如果 style 里也设置了，会覆盖这里
   */
  transitionDuration?: string;
  /**
   * 样式字符串内容
   */
  styleContent?: string;
  /**
   * 样式 url 列表
   */
  styleSheets?: string[];
  /**
   * 显示延时
   */
  shadowDelay?: number;
  /**
   * default: true
   */
  delegatesFocus?: boolean;
  children?: any;
  /**
   * React Ref function
   */
  ref?: Function;
  /**
   * default: ''
   */
  data?: string;
}

/**
 * 实现的 react 组件内部，一定要调用 props.onShadowRootReady 方法把 shadowRoot 引用传出去
 * 示例可参考 @see https://github.com/tnfe/hel/blob/main/packages/hel-micro-react/src/components/ShadowViewV2.tsx
 * 如不调用此方法会导致 useRemoteComp 一直处于骨架屏状态
 */
export type ShadowViewImplComp = (props: IShadowViewImplProps) => React.ReactNode;
