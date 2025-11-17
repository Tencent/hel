export type PrimitiveItem = number | string | symbol;

export type Dict<T extends any = any> = Record<PrimitiveItem, T>;

export type DictN<T extends any = any> = Record<number, T>;

export type SharedObject<T extends Dict = any> = T;

export type EnableReactive = boolean;

export type KeyedState<T extends Dict> = T & { key: string };

export interface ILifeCycleInner {
  beforeMount: () => void,
  mounted: () => void,
  willUnmount: () => void,
  beforeSetState: () => void,
}

export interface ILifeCycle<S extends Dict = Dict, A extends Dict = Dict> {
  /** 第一个使用此共享状态的组件 beforeMount 时触发，其他组件再挂载时不会触发，当所有组件都卸载后若满足条件会重新触发   */
  beforeMount?: (params: { state: S, setState: (partialState: Partial<S>) => void, actions: A }) => void,
  /** 第一个使用此共享状态的组件 mounted 时触发，其他组件再挂载时不会触发，当所有组件都卸载后若满足条件会重新触发 */
  mounted?: (params: { state: S, setState: (partialState: Partial<S>) => void, actions: A }) => void,
  /** 最后一个使用此共享状态的组件 willUnmount 时触发，多个组件挂载又卸载干净会重新触发 */
  willUnmount?: (params: { state: S, setState: (partialState: Partial<S>) => void, actions: A }) => void,
  /** setState 之前触发，可用于辅助 console.trace 来查看调用源头 */
  beforeSetState?: () => void,
}

export interface IKeyedLifeCycle<S extends Dict = Dict, A extends Dict = Dict> {
  /** 第一个使用此共享状态的组件 beforeMount 时触发，其他组件再挂载时不会触发，当所有组件都卸载后若满足条件会重新触发   */
  beforeMount?: (params: { state: KeyedState<S>, setState: (partialState: Partial<S>) => void, actions: A }) => void,
  /** 第一个使用此共享状态的组件 mounted 时触发，其他组件再挂载时不会触发，当所有组件都卸载后若满足条件会重新触发 */
  mounted?: (params: { state: KeyedState<S>, setState: (partialState: Partial<S>) => void, actions: A }) => void,
  /** 最后一个使用此共享状态的组件 willUnmount 时触发，多个组件挂载又卸载干净会重新触发 */
  willUnmount?: (params: { state: KeyedState<S>, setState: (partialState: Partial<S>) => void, actions: A }) => void,
  /** setState 之前触发，可用于辅助 console.trace 来查看调用源头 */
  beforeSetState?: () => void,
}

export interface ICreateOptions<S extends Dict = Dict, A extends Dict = {}> {
  /** default: false，是否创建响应式状态，true：是，false：否 */
  enableReactive?: EnableReactive;
  /** 模块名称，不传递的话内部会生成 symbol 作为 key */
  moduleName?: string;
  /** default: false，直接读取 sharedObj 时是否记录依赖，目前用于满足 helux-solid 库的需要，enableReactive 为 true 时 ，设置此参数才有意义 */
  enableRecordDep?: boolean;
  /**
   * default: false
   * 是否对传入进来的 obj 做浅拷贝
   * ```
   * const originalObj = { a:1, b: 2 };
   * const { state } = createShared(originalObj, { copyObj: true } );
   * // 若 copyObj === true, 则 getRawState(state) === originalObj 结果为 false
   * // 若 copyObj === false, 则 getRawState(state) === originalObj 结果为 true
   * ```
   */
  copyObj?: boolean;
  /**
   * default: true, 修改的状态值是否同步到原始状态
   * 注意此参数仅在 copyObj=true 时设置才有意义
   * ```
   * const originalObj = { a:1, b: 2 };
   * const { state, setState } = createShared(originalObj);
   * // 为 true 时，任何 setState 调用都会同步到 originalObj 上
   * ```
   */
  enableSyncOriginal?: boolean;
  lifecycle?: ILifeCycle<S, A>;
  /** actions 工厂函数 */
  actionsFactory?: (params: { state: S, setState: (partialState: Partial<S>) => void }) => A,
}

export type ModuleName = string;

export type ICreateOptionsType = ModuleName | EnableReactive | ICreateOptions;

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;
