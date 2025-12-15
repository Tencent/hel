
declare global {
  /** 全局公共类型 */
  namespace xc {

    type Dict<T extends any = any> = Record<string, T>;

    type ValueType<T extends Dict> = T[keyof T];

    type Fn<P extends any[] = any[], R extends (any | void) = (any | void)> = (...args: P) => R;
  }
}
