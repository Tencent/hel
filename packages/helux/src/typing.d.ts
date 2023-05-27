export type PrimitiveItem = number | string | symbol;

export type Dict<T extends any = any> = Record<PrimitiveItem, T>;

export type SharedObject<T extends Dict = any> = T;

export type EenableReactive = boolean;
export interface ICreateOptions {
  /** default: false，是否创建响应式状态，true：是，false：否 */
  enableReactive?: EenableReactive;
  /** 模块名称，不传递的话内部会生成 symbol 作为key */
  moduleName?: string;
}

export type ModuleName = string;

export type ICreateOptionsType = ModuleName | EenableReactive | ICreateOptions;
