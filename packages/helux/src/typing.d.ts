export type PrimitiveItem = number | string | symbol;

export type Dict<T extends any = any> = Record<PrimitiveItem, T>;

export type DictN<T extends any = any> = Record<number, T>;

export type SharedObject<T extends Dict = any> = T;

export type EenableReactive = boolean;

export interface ICreateOptions {
  /** default: false，是否创建响应式状态，true：是，false：否 */
  enableReactive?: EenableReactive;
  /** 模块名称，不传递的话内部会生成 symbol 作为key */
  moduleName?: string;
  /** default: false，直接读取 sharedObj 时是否记录依赖，目前用于满足 helux-solid 库的需要，enableReactive 为 true 时 ，设置此参数才有意义 */
  enableRecordDep?: boolean;
}

export type ModuleName = string;

export type ICreateOptionsType = ModuleName | EenableReactive | ICreateOptions;

export type CleanUpCb = () => void;

export type EffectCb = () => void | CleanUpCb;
