import { createSymbol } from '../helpers/sym';

export const SHARED_KEY = createSymbol('HeluxSharedKey');

export const PROTO_KEY = '__proto__';

export const FN_KEY = createSymbol('HeluxFnKey');

export const IS_SHARED = createSymbol('HeluxIsShared');

export const SKIP_MERGE = createSymbol('HeluxSkipMerge');

/** 卸载数据的过期时间（单位：ms） */
export const EXPIRE_MS = 2000;

export const VER = '2.1.7';

export const RENDER_START = '1';

export const RENDER_END = '2';

export const NOT_MOUNT = 1;

export const MOUNTED = 2;

export const UNMOUNT = 3;
