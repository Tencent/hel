import { createSymbol } from '../helpers/sym';
import type { Dict } from '../typing';

function getGlobalThis() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  // @ts-ignore
  if (typeof this !== 'undefined') return this;
  throw new Error('no globalThis');
}

// 直接写 window 导致 vitest 报错，改为 getGlobalThis 写法
// export const GLOBAL_REF: Dict & Window & typeof globalThis = window || global;

export const GLOBAL_REF: Dict & Window & typeof globalThis = getGlobalThis();

export const IS_SERVER = GLOBAL_REF.window === undefined && GLOBAL_REF.global !== undefined;

export const SHARED_KEY = createSymbol('HeluxSharedKey');

export const IS_SHARED = createSymbol('HeluxIsShared');

export const SKIP_MERGE = createSymbol('HeluxSkipMerge');

export const KEYED_SHARED_KEY = createSymbol('HeluxKeyedSharedKey');

/** 第一次卸载 */
export const FIRST_UNMOUNT = 1;

/** 第二次卸载 */
export const SECOND_UNMOUNT = 2;

/** 卸载数据的过期时间（单位：ms） */
export const EXPIRE_MS = 2000;

/** limit 初始值 */
export const LIMIT_SEED = 1000;

/** limit 检查无删除行为时，扩展 limit 值的增量 */
export const LIMIT_DELTA = 1000;

export const VER = '1.2.4';

export const RENDER_START = '1';

export const RENDER_END = '2';
