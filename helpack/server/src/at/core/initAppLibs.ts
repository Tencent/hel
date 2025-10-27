/**
 * 初始 app 引入的一些第三方驱动或库
 */
import envConf from 'at/configs/env';
import { initModels } from 'at/models';
import { isLocal } from 'at/utils/deploy';
import * as redisSrv from 'services/redis';

export default async function () {
  // TODO 本地启动暂时不连缓存与数据库，后期再优化本地开发模式
  if (isLocal()) {
    // do nothing
    return;
  }
  await Promise.all([
    initModels(envConf.dbConf), // 初始化数据库
    redisSrv.init(envConf.redisConf), // 初始化 redis
  ]);
}
