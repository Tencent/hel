import type { IMeta } from '../base/types';
import { cpSync } from '../server-mod/file-helper';
import { readFileContent } from './mock-util-inner';
export { readFileContent, cpSync };
export declare function getVerSeedExpire(helModName: string): any;
export declare function setVerSeedExpire(helModName: string, expireMs: number): void;
export declare function clearVerSeed(helModName: string): void;
/**
 * 获取版本种子，mockInterval毫秒内重复调用则返回相同种子数，反之则加1后返回
 */
export declare function getVerSeed(helModName: string): any;
export declare function getMetaDict(): Record<string, IMeta | null>;
export declare function saveMetaDict(metaDict: Record<string, IMeta | null>): void;
export declare function getCacheMeta(helModName: string): IMeta;
export declare function setCacheMeta(helModName: string, meta: IMeta | null): void;
export declare function getFirstVerModDirPath(helModName: string): '';
export declare function setFirstVerModDirPath(helModName: string, path: string): void;
export declare function getServerInfo(): {
    containerName: string;
    workerId: string | number;
    env: string;
};
export declare function getIsHandled(helModName: string, verSeed: number): any;
export declare function setIsHandled(helModName: string, verSeed: number, isHandle: boolean): void;
export declare function getCanClear(): boolean;
export declare function clearData(helModName: string, mockInterval: number, platform?: string): void;
