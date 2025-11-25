import * as fs from 'fs';
import * as path from 'path';
import { SERVER_INFO } from '../base/consts';
import { rawLog } from '../base/mem-logger';
import { HEL_LOCK_FILE_VALID_TIME_MS, WAIT_INTERVAL_MS } from '../base/mod-consts';
import { loadJson, wait } from './util';

/**
 * 等待锁文件被创建它的 worker 删除掉
 */
export async function waitLockFileDeleted(lockFile: string) {
  rawLog(`[gwmi]: found lock file exist ${lockFile}`);
  let curWaitTotalMs = 0;
  let lockFileExist = true;
  while (lockFileExist && curWaitTotalMs <= HEL_LOCK_FILE_VALID_TIME_MS) {
    await wait(WAIT_INTERVAL_MS);
    curWaitTotalMs += WAIT_INTERVAL_MS;
    if (!fs.existsSync(lockFile)) {
      lockFileExist = false;
      rawLog('[gwmi]: found lock file deleted');
    } else {
      rawLog(`[gwmi]: found lock file still exist after ${curWaitTotalMs} ms`);
    }
  }
}

/**
 * 获得当前模块版本的锁文件路径
 */
export function getLockFilePath(modDir: string) {
  const lockFilePath = path.join(modDir, './hel-download-lock.json');
  return lockFilePath;
}

/**
 * 判断锁文件是否存在
 */
export async function getIsLockFileExist(lockFilePath: string) {
  let isLockFileExist = fs.existsSync(lockFilePath);
  if (!isLockFileExist) {
    await wait(100);
    isLockFileExist = fs.existsSync(lockFilePath);
  }
  return isLockFileExist;
}

/**
 * 创建锁文件
 */
export function createLockFile(lockFilePath: string) {
  try {
    // 此处刻意不用 JSON.stringify，以便提高一定性能
    fs.writeFileSync(lockFilePath, `{"time":${Date.now()},"wid": ${SERVER_INFO.workerId}}`);
    return true;
  } catch (err: any) {
    return false;
  }
}

/**
 * 判断锁文件是否有效
 */
export function isLockFileValid(lockFilePath: string) {
  const lockData = loadJson(lockFilePath, { time: 0, wid: 0 });
  return Date.now() - lockData.time < HEL_LOCK_FILE_VALID_TIME_MS;
}
