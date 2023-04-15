// export type Dict<T extends any = any> = Record<string | symbol, T>;

export type Dict<T extends any = any> = Record<string, T>;

export type SharedObject<T extends Dict = any> = T;
