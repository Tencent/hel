import dao from 'at/dao';
import type { IStatDist } from 'at/types/domain';
import { isSimpleServer } from 'at/utils/deploy';
import { noDupPush, safeGet } from 'at/utils/obj';
import { lockByLabel } from 'controllers/share/lock';
import schedule from 'node-schedule';
import { runningLogSrv } from 'services/runningLog';
import { STAT_TYPE } from './consts';
import * as merge from './merge';
import type { IStatItem, IVisitHome } from './types';
import { getDefault, getDistEnvLabel, getEnvLabel, getTimeLabel } from './util';

const logType = 'Stat';

export { STAT_TYPE };

const saveInterval = 10 * 60 * 1000;

class Stat {
  private statCacheByTime: xc.Dict<xc.Dict<IStatItem>> = {};

  private statCacheByType: xc.Dict<xc.Dict<IStatItem>> = {};

  private statCacheByTimeSimple: xc.Dict<xc.Dict> = {};

  private statCacheByTypeSimple: xc.Dict<xc.Dict> = {};

  /** 初始化统计任务 */
  public init() {
    if (isSimpleServer()) {
      // 以简单服务模式启动，不做统计
      return;
    }

    setInterval(() => {
      this.saveCacheDataToDist();
    }, saveInterval);

    // 每天一点半执行
    schedule.scheduleJob('30 1 * * *', () => {
      this.saveCacheData(-1);
      this.clearCache(-3);
    });
  }

  public getStat(byTime: boolean, isSimple: boolean) {
    if (byTime) {
      return isSimple ? this.statCacheByTimeSimple : this.statCacheByTime;
    }
    return isSimple ? this.statCacheByTypeSimple : this.statCacheByType;
  }

  public incVisitHome(user: string) {
    if (!user) return;

    const statNode = this.getStatNode<IVisitHome>(STAT_TYPE.visitHome);
    const { data } = statNode;
    data.num += 1;
    noDupPush(data.users, user);
    data.totalUser = data.users.length;
  }

  public getStatNode<T = any>(type: string) {
    const timeLabel = getTimeLabel();
    const byTime = safeGet(this.statCacheByTime, timeLabel, {});
    const byType = safeGet(this.statCacheByType, type, {});
    const byTimeSimple = safeGet(this.statCacheByTimeSimple, timeLabel, {});
    const byTypeSimple = safeGet(this.statCacheByTypeSimple, type, {});

    if (!byTime[type] || !byType[timeLabel]) {
      const distEnvLabel = getDistEnvLabel();
      const envLabel = getEnvLabel();
      const data = getDefault(type);
      const dataNode: IStatItem = { type, data, timeLabel, envLabel, distEnvLabel };
      byTime[type] = dataNode;
      byType[timeLabel] = dataNode;
      byTimeSimple[type] = data;
      byTypeSimple[timeLabel] = data;
    }

    return byTime[type] as IStatItem<T>;
  }

  /**
   * 汇总某一天在所有实例所有worker的统计数据后，存入 t_stat 表
   */
  public async saveCacheData(offsetDay: number) {
    const subType = 'saveCacheData';
    try {
      await lockByLabel(subType, 16);
      const timeLabel = getTimeLabel(offsetDay);
      const envLabel = getEnvLabel();
      // 筛出某一天对应123某个环境值的所有统计数据并开始汇总
      const statDistList = await dao.statDist.get({ time_label: timeLabel, env_label: envLabel });
      const statDict: xc.Dict = {};
      statDistList.forEach((v) => {
        const { type, data } = v;
        const statData = safeGet(statDict, type, getDefault(type));
        this.mergeStat(type, statData, data);
      });

      const keys = Object.keys(statDict);
      for (let i = 0; i < keys.length; i++) {
        const type = keys[i];
        const data = statDict[type];
        const existStat = await dao.stat.getOne({ type, time_label: timeLabel, env_label: envLabel });
        const logData = { type, data };
        if (existStat) {
          await dao.stat.update({ id: existStat.id, data });
          runningLogSrv.pushLog(logType, { subType, loc: 'update stat success', data: logData });
        } else {
          await dao.stat.add({ type, time_label: timeLabel, env_label: envLabel, data });
          runningLogSrv.pushLog(logType, { subType, loc: 'add stat success', data: logData });
        }
      }
    } catch (err: any) {
      runningLogSrv.pushLog(logType, { subType, loc: 'catch err', data: { msg: err.message } });
    }
  }

  /**
   * 各个实例对应worker将自己的统计数据存入 t_stat_dist 表
   */
  private async saveCacheDataToDist() {
    const subType = 'saveCacheDataToDist';
    try {
      const statDict = this.statCacheByTime[getTimeLabel()] || {};
      const keys = Object.keys(statDict);
      for (let i = 0; i < keys.length; i++) {
        const type = keys[i];
        const stat = statDict[type];
        const { timeLabel, envLabel, distEnvLabel } = stat;
        const where = { type, time_label: timeLabel, dist_env_label: distEnvLabel };
        let result = await dao.statDist.getOne(where);
        if (!result) {
          await lockByLabel(subType);
          const addResult = await dao.statDist.add({ ...where, env_label: envLabel });
          runningLogSrv.pushLog(logType, { subType, loc: 'add statDist success' });
          result = addResult.objJson;
        }

        const ensuredResult = result as IStatDist;
        ensuredResult.data = stat.data;
        await dao.statDist.update(ensuredResult);
        runningLogSrv.pushLog(logType, { subType, loc: 'update statDist success', data: ensuredResult });
      }
    } catch (err: any) {
      runningLogSrv.pushLog(logType, { subType, loc: 'catch err', data: { msg: err.message } });
    }
  }

  private mergeStat(type: string, base: any, other: any) {
    if (type === STAT_TYPE.visitHome) {
      return merge.handleVisitHome(base, other);
    }
  }

  private clearCache(offsetDay: number) {
    const timeLabel = getTimeLabel(offsetDay);
    Reflect.deleteProperty(this.statCacheByTime, timeLabel);
    Reflect.deleteProperty(this.statCacheByTimeSimple, timeLabel);

    Object.keys(this.statCacheByType).forEach((type) => {
      const byType = this.statCacheByType[type];
      Reflect.deleteProperty(byType, timeLabel);
    });
    Object.keys(this.statCacheByTypeSimple).forEach((type) => {
      const byType = this.statCacheByTypeSimple[type];
      Reflect.deleteProperty(byType, timeLabel);
    });
  }
}

export const statSrv = new Stat();
