import { getServerEnv } from 'at/utils/deploy';
import dayjs from 'dayjs';
import { STAT_TYPE } from './consts';
import type { IVisitHome } from './types';

/**
 * 获取时间文案，传正数则加，负数则减
 */
export function getTimeLabel(offsetDay?: number) {
  let timeLabel = '';
  const fmt = 'YYYY-MM-DD';
  if (offsetDay) {
    timeLabel = dayjs().add(offsetDay, 'day').format(fmt);
  } else {
    timeLabel = dayjs().format(fmt);
  }
  return timeLabel;
}

/**
 * 获取分布环境文案
 */
export function getDistEnvLabel() {
  const { env, containerName, workerID } = getServerEnv();
  return `${env}-${containerName}-${workerID}`;
}

/**
 * 获取环境文案
 */
export function getEnvLabel() {
  const { env } = getServerEnv();
  return env;
}

/**
 * 获取统计对象默认值
 */
export function getDefault(type: string) {
  if (type === STAT_TYPE.visitHome) {
    const data: IVisitHome = { num: 0, totalUser: 0, users: [] };
    return data;
  }

  return {};
}
