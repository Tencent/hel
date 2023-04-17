export type Dict<T extends any = any> = Record<string, T>;

export type SharedObject<T extends Dict = any> = T;
