'use strict';
/*
|--------------------------------------------------------------------------
| redis 服务
|--------------------------------------------------------------------------
*/
import { safeParse } from 'at/utils/obj';
import type { Redis } from 'ioredis';
import IORedis from 'ioredis';
import LRU from 'lru-cache';
import { internal } from 'services/logger';

const PUB_CACHE = new LRU<string, any>({
  max: 3000,
  ttl: 1000 * 6,
});

interface IRedisConf {
  ip: string;
  port: number;
  password: string;
  keyPrefix?: string;
}

let redisInstance: Redis | null = null;
let cachedConf: any = null;

export async function init(redisConf: IRedisConf, shouldCacheIns = true) {
  cachedConf = redisConf;
  return new Promise<Redis>((resolve, reject) => {
    const redis = new IORedis({
      host: redisConf.ip,
      port: redisConf.port,
      password: redisConf.password,
      db: 0,
      keyPrefix: redisConf.keyPrefix,
    });

    redis.on('connect', () => {
      if (shouldCacheIns) {
        redisInstance = redis;
      }
      console.log('redis connect success!', redisConf);
      resolve(redis);
    });

    redis.on('error', (err) => {
      reject(err);
      console.log('redis connect error!', err);
    });

    redis.on('reconnecting', () => {
      // 断线重连时，获取新的ip，port
      redis.options.host = redisConf.ip;
      redis.options.port = redisConf.port;
      redis.options.password = redisConf.password;
      console.log('redis reconnecting.', redisConf);
    });
  });
}

const getRedisInstance = () => {
  if (!redisInstance) {
    throw new Error('forget init redis');
  }
  return redisInstance;
};

interface ISaveOptions {
  /**
   * 过期时间值，单位见 expireMode
   */
  expireValue?: number;
  /**
   * default: 'EX'，过期时间模式
   * EX：过期时间为单位秒
   * PX：过期时间为单位毫秒
   */
  expireMode?: 'EX' | 'PX';
  /**
   * default: 'NX'，设置value的模式
   * NX：key不存在时才让设置成功
   * XX：key存在时才让设置成功
   */
  setMode?: 'NX' | 'XX';
}

export async function saveCache(key: string, value: any, saveOptions?: ISaveOptions) {
  const redis = getRedisInstance();
  const finalValue = typeof value === 'string' ? value : JSON.stringify(value);
  const { expireValue = 0, expireMode = 'EX', setMode = 'NX' } = saveOptions || {};
  if (expireValue) {
    // @ts-ignore
    const result = await redis.set(key, finalValue, expireMode, expireValue, setMode);
    return result;
  }
  const result = await redis.set(key, finalValue);
  return result;
}

export async function getCache<T extends any = any>(key: string, shouldParse?: boolean): Promise<T | null> {
  const finalShouldParse = shouldParse !== undefined ? shouldParse : false;
  const redis = getRedisInstance();
  return await new Promise((resolve, reject) => {
    redis.get(key, (err, result) => {
      if (err) {
        internal.error(`redis get ${key} error: `, err);
        reject(err);
        return;
      }

      if (finalShouldParse) {
        let ret = safeParse(result || '', null);
        // 在反序列化一次
        if (typeof ret === 'string') {
          ret = safeParse(ret || '', null);
        }
        resolve(ret);
      } else {
        resolve(result as T);
      }
    });
  });
}

export async function delCache(key: string) {
  const redis = getRedisInstance();
  return await new Promise((resolve, reject) => {
    redis.del(key, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
}

let redisInstanceOfSub = null as unknown as Redis;
/**
 * 订阅消息接口，
 * 需 pattern 模式时，可传递 channelName 带通配符，形如：xc.*
 * 此处需重新初始化一个实例用于订阅，复用已经存在的 redis 实例会出现以下错误
 * Connection in subscriber mode, only subscriber commands may be used
 */
export async function subscribe(
  channelName: string,
  options: {
    msgReceiveCb: (params: { pattern: string; channel: string; message: string }) => void;
    redisConf?: IRedisConf;
  },
) {
  let ins = redisInstanceOfSub;

  if (options.redisConf) {
    ins = await init(options.redisConf, false);
  } else if (!ins) {
    getRedisInstance(); // 防止 init 函数从未调用过，导致 cachedConf 为 null
    redisInstanceOfSub = await init(cachedConf, false);
    ins = redisInstanceOfSub;
  }

  if (channelName.endsWith('.*')) {
    // 以 pattern 模式来订阅消息
    await ins.psubscribe(channelName);
    // channel 为 xx.yy. 开头的值，都将触发 pmessage 回调，回调参数示例：
    // pattern: 'xx.yy.*', channel: 'xx.yy.gogo'
    // pattern: 'xx.yy.*', channel: 'xx.yy.gogo.test'
    ins.on('pmessage', (pattern, channel, message) => {
      // pattern 模式收到的 channel 和 pattern 是匹配的，故这里不用再次判断
      options.msgReceiveCb({ pattern, channel, message });
    });
  } else {
    await ins.subscribe(channelName);
    ins.on('message', (channel, message) => {
      // 普通订阅会收到非本频道的消息，这里判断一下
      if (channelName === channel) {
        options.msgReceiveCb({ pattern: '', channel, message });
      }
    });
  }
}

/**
 * 发布消息
 * @return 返回接受到消息的客户端数量
 */
export async function pub(channelName: string, msg: string) {
  const redis = getRedisInstance();
  const result = await redis.publish(channelName, msg);
  return result;
}

/**
 * 保证相同的 key 在 6 秒内才会执行一次 pub
 * @param channelName
 * @param msg
 * @returns
 */
export async function safePub(channelName: string, msg: string) {
  const key = `${channelName}_${msg}`;
  const hasPubLock = PUB_CACHE.get(key);
  if (!hasPubLock) {
    return pub(channelName, msg);
  }

  PUB_CACHE.set(key, 1);
  return 0;
}
