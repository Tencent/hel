export type PrimitiveItem = number | string | symbol;

export type Dict<T extends any = any> = Record<PrimitiveItem, T>;

export type DictN<T extends any = any> = Record<number, T>;

export type SharedObject<T extends Dict = any> = T;

export type EnableReactive = boolean;

export interface ICreateOptions {
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
}

export type ModuleName = string;

export type ICreateOptionsType = ModuleName | EnableReactive | ICreateOptions;

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;
