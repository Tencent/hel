/**
 * @file 一系列占位空函数
 */

/** 此函数用于消除 unused vars 警告 */
function noopArgs(...args: any[]) {
  return args;
}

/**
 * 创建 noop 函数，内置的 noopStr、noopNum、noopObj、noopVoid 不满足使用场景时，可用此函数来创建新的 noop 函数
 * @example
 * ```
 * const noopCat = makeNoopAny({ name: 'cat' });
 * ```
 */
export function makeNoopAny<T = any>(result?: T) {
  return (...args: any[]): T => {
    noopArgs(args);
    return result;
  };
}

/** noopAny 默认返回 {}, 如不满足使用场景可基于 makeNoopAny 来定制 */
export function noopAny(...args: any[]): any {
  noopArgs(args);
  return {};
}

export function noopStr(...args: any[]) {
  noopArgs(args);
  return '';
}

export function noopNum(...args: any[]) {
  noopArgs(args);
  return 0;
}

export function noopObj<T = Record<string, any>>(...args: any[]): T {
  noopArgs(args);
  return {} as unknown as T;
}

export function noopVoid(...args: any[]) {
  noopArgs(args);
}

/**
 * 创建 noop async 函数，内置的 noopStrAsync、noopNumAsync、noopObjAsync、noopVoidAsync 不满足使用场景时，
 * 可用此函数来创建新的 noop 函数
 * @example
 * ```
 * const noopCatAsync = makeNoopAnyAsync({ name: 'cat' });
 * ```
 */
export function makeNoopAnyAsync<T = any>(result?: T) {
  return async (...args: any[]): Promise<T> => {
    noopArgs(args);
    return result;
  };
}

/** noopAnyAsync 默认返回 {}, 如不满足使用场景可基于 makeNoopAnyAsync 来定制 */
export async function noopAnyAsync(...args: any[]): Promise<any> {
  noopArgs(args);
  return {};
}

export async function noopStrAsync(...args: any[]) {
  noopArgs(args);
  return '';
}

export async function noopNumAsync(...args: any[]) {
  noopArgs(args);
  return 0;
}

export async function noopObjAsync<T = Record<string, any>>(...args: any[]): Promise<T> {
  noopArgs(args);
  return {} as unknown as T;
}

export async function noopVoidAsync(...args: any[]) {
  noopArgs(args);
}
