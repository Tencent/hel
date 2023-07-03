export type PrimitiveItem = number | string;

export type PrimitiveSymItem = PrimitiveItem | symbol;

export type Dict<T extends any = any> = Record<PrimitiveSymItem, T>;

export type DictN<T extends any = any> = Record<number, T>;

export type Fn<T extends any = any> = (...args: any[]) => T;

export type SharedObject<T extends Dict = any> = T;

export type EenableReactive = boolean;

export interface ICreateOptionsFull {
  /** default: false，是否创建响应式状态，true：是，false：否 */
  enableReactive: EenableReactive;
  /** 模块名称，不传递的话内部会生成 symbol 作为key */
  moduleName: string;
  /** default: false，直接读取 sharedObj 时是否记录依赖，目前用于满足 helux-solid 库的需要，enableReactive 为 true 时 ，设置此参数才有意义 */
  enableRecordDep: boolean;
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
  copyObj: boolean;
  /**
   * defaut: true, 修改的状态值是否同步到原始状态
   * 注意此参数仅在 copyObj=true 时设置才有意义
   * ```
   * const originalObj = { a:1, b: 2 };
   * const { state, setState } = createShared(originalObj);
   * // 为 true 时，任何 setState 调用都会同步到 originalObj 上
   * ```
   */
  enableSyncOriginal: boolean;
}

export type ICreateOptions = Partial<ICreateOptionsFull>;

export type ModuleName = string;

export type ICreateOptionsType = ModuleName | EenableReactive | ICreateOptions;

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;

export interface IFnParams {
  isFirstCall: boolean;
}

export type ComputedResult<T extends Dict = Dict> = T;

export type ComputedFn<T extends Dict = Dict> = (params: IFnParams) => T;

export interface IUnmountInfo {
  t: number;
  /** mount count, 第一次挂载或第二次挂载 */
  c: 1 | 2;
  /**
   * @deprecated
   * 前一个实例 id，已无意义，后续会移除
   */
  prev: number;
}

export type FnType = 'watch' | 'computed';

export type ScopeType = 'static' | 'hook';

export type ReanderStatus = '1' | '2';

export type MountStatus = 1 | 2 | 3;

export interface IFnCtx {
  fn: Fn;
  fnKey: number;
  /** 中转了此函数返回结果的其他函数 */
  downstreamFnKeys: number[];
  /** 未挂载 已挂载 已卸载 */
  mountStatus: MountStatus;
  depKeys: string[];
  result: Dict;
  /** work for hook computed fnCtx */
  proxyResult: Dict;
  fnType: FnType;
  scopeType: ScopeType;
  /** work for hook computed fnCtx */
  updater?: Fn;
  /** work for hook computed fnCtx */
  isResultReaded: boolean;
  /** work for computed result transfer mechanism */
  isUpstreamResult: boolean;
  /** work for hook computed fnCtx */
  renderStatus: ReanderStatus;
  /** fn ctx created timestamp */
  createTime: number;
}

export interface IInsCtx {
  /** 当前渲染完毕所依赖的 key 记录 */
  readMap: Dict;
  /** 上一次渲染完毕所依赖的 key 记录 */
  readMapPrev: Dict;
  /** StrictMode 下辅助 resetDepMap 函数能够正确重置 readMapPrev 值 */
  readMapStrict: null | Dict;
  insKey: number;
  internal: Dict;
  rawState: Dict;
  sharedState: Dict;
  proxyState: Dict;
  setState: Fn;
  /** 未挂载 已挂载 已卸载 */
  mountStatus: MountStatus;
  renderStatus: ReanderStatus;
  /** ins ctx created timestamp */
  createTime: number;
}
