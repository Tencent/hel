export declare function strItems2Dict<T = any>(strItems: string[], val: T): Record<string, T>;
/**
 * 判断是否是普通 json 字典对象
 * 例如，{}, {a:1} 为 true，null, undefind, 1, 2, true, [], new Map(), new Set() 等均为 false
 */
export declare function isDict(mayDict: any): boolean;
export declare function isModuleLike(mayModule: any): boolean;
export declare function isFn(mayFn: any): boolean;
export declare function isValidModule(mayModule: any): boolean;
/**
 * xss过滤器
 *
 * @param {string} input 传入字符串
 * @returns {string} 过滤后的字符串
 */
export declare function xssFilter(input: string): string;
export declare function purify<T = any>(raw: object): T;
export declare function purifyFn(raw: object): {};
/**
 * 获取数组倒数位置的元素，默认获取最后一个
 */
export declare function lastNItem(strList: string[], lastIdx?: number): string;
/**
 * 不重复添加元素
 */
export declare function uniqueStrPush(strList: string[], str: string): string[];
export declare function safeGet<T = any>(dict: object, key: string, defaultVal: T): T;
export declare function maySet(dict: object, key: string, val: any): boolean;
export declare function maySetFn(dict: object, key: string, val: any): void;
export declare function noop(...args: any[]): any[];
/**
 * 克隆
 */
export declare function clone(obj: object): any;
