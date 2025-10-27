import * as redisSrv from 'services/redis';

// 检查锁并上锁，防止暴力调用某段逻辑
export async function lockLogic(key: string, subKey: string, options?: { seconds: number }) {
  const { seconds = 3 } = options || {}; // 默认锁 3s
  const lockKey = `Lock_${key}_${subKey}`;
  const lock = await redisSrv.getCache(lockKey);
  const throwFrequentlyCallErr = () => {
    throw new Error(`${lockKey} too busy, try again after ${seconds}s later!`);
  };
  if (lock) {
    throwFrequentlyCallErr();
  }
  const result = await redisSrv.saveCache(lockKey, 1, { expireValue: seconds });
  if (result !== 'OK') {
    throwFrequentlyCallErr();
  }
}

export async function lockLogicBool(key: string, subKey: string, options?: { seconds: number }) {
  try {
    await lockLogic(key, subKey, options);
    return true;
  } catch (err) {
    return false;
  }
}

export async function lockByLabel(label: string, seconds = 3) {
  await lockLogic(label, '', { seconds });
}
