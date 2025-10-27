/**
 * 初始化 app 各种应用级别的监听函数
 */
import biz from 'at/configs/biz';
import { isLocal } from 'at/utils/deploy';
import { allowedAppSrv } from 'services/allowedApp';
import * as dataCacheSrv from 'services/dataCache';
import * as redisSrv from 'services/redis';
import { statSrv } from 'services/stat';

function normalSubscribe(pattern: string, msgReceiveCb: (params: { message: string }) => void) {
  redisSrv.subscribe(pattern, {
    msgReceiveCb: (params) => {
      msgReceiveCb({ message: params.message });
    },
  });
}

export default async function initListeners() {
  if (isLocal()) {
    return;
  }
  // 初始化统计任务
  statSrv.init();
  // 初始化白名单
  await allowedAppSrv.init();

  // 监听应用删除
  normalSubscribe(biz.CHANNEL_APP_INFO_DELED, (params) => {
    dataCacheSrv.handleAppInfoDel(params.message);
  });

  // 监听应用数据变化
  normalSubscribe(biz.CHANNEL_APP_INFO_CHANGED, (params) => {
    dataCacheSrv.handleAppInfoChange(params.message);
  });

  // 监听应用版本变化
  normalSubscribe(biz.CHANNEL_APP_VERSION_CHANGED, (params) => {
    dataCacheSrv.handleVersionChange(params.message);
  });

  // 监听员工字符串变化
  normalSubscribe(biz.CHANNEL_STAFF_STR_CHANGED, (params) => {
    dataCacheSrv.handleStaffChange(params.message);
  });
}
