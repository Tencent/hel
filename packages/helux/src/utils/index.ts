import type { PrimitiveItem } from '../typing';

export function getGlobalThis() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  // @ts-ignore
  if (typeof this !== 'undefined') return this;
  throw new Error('no globalThis');
}

export function safeGet<T = any>(obj: Record<string | symbol, any>, key: PrimitiveItem, defaultValue: T): T {
  let item = obj[key];
  if (!item) {
    item = obj[key] = defaultValue;
  }
  return item;
}

export function nodupPush(list: PrimitiveItem[], toPush: PrimitiveItem) {
  if (!list.includes(toPush)) list.push(toPush);
}

export function prefixValKey(valKey: string, sharedKey: number) {
  return `${sharedKey}/${valKey}`;
}

export function isSymbol(maySymbol: any): maySymbol is symbol {
  return typeof maySymbol === 'symbol';
}
