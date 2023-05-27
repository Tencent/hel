import type { PrimitiveItem } from '../typing';

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
