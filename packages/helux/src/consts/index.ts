export const INTERNAL = Symbol('HeluxInternal');

export const SHARED_KEY = Symbol('K');

export const SKIP_CHECK_OBJ = Symbol('HeluxSkipCheckObj');

/** 第一次卸载 */
export const FIRST_UNMOUNT = 1;

/** 第二次卸载 */
export const SECOND_UNMOUNT = 2;

/** 卸载数据的过期时间 */
export const EXPIRE_MS = 2000;

/** limit 检查无删除行为时，扩展 limit 值的增量 */
export const LIMIT_SEED = 1000;

/** limit 检查无删除行为时，扩展 limit 值的增量 */
export const LIMIT_DELTA = 1000;

export const VER = '1.4.0';
