/**
 * 等待锁文件被创建它的 worker 删除掉
 */
export declare function waitLockFileDeleted(lockFile: string): Promise<void>;
/**
 * 获得当前模块版本的锁文件路径
 */
export declare function getLockFilePath(modDir: string): string;
/**
 * 判断锁文件是否存在
 */
export declare function getIsLockFileExist(lockFilePath: string): Promise<boolean>;
/**
 * 创建锁文件
 */
export declare function createLockFile(lockFilePath: string): boolean;
/**
 * 判断锁文件是否有效
 */
export declare function isLockFileValid(lockFilePath: string): boolean;
