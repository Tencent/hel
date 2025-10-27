import * as HMNStatDao from 'at/dao/HMNStat';
import * as HMNStatLogDao from 'at/dao/HMNStatLog';
import type { IHMNStat } from 'at/types/domain';
import { lockLogicBool } from 'controllers/share/lock';
import type { IEnvInfo, IOnClientCloseParams, IOnHelModsInitParams } from 'services/hel-micro-socket/types';
import { HMN_END_REASON, HMN_LOAD_MODE } from './consts';

export interface IReportData {
  modName: string;
  modVersion: string;
  /** 13 位时间戳 */
  loadAt: number;
  envInfo: IEnvInfo;
}

class HMNStat {
  /** 初始化统计任务 */
  public init() {}

  public async handleClientClose(params: IOnClientCloseParams) {
    const { envInfo } = params;
    const isLockSuccess = await lockLogicBool('handleClientClose', envInfo.containerName);
    if (!isLockSuccess) {
      return;
    }

    const items = await HMNStatDao.get({ container_name: envInfo.containerName });
    // 删除同一个容器里的多个hel模块统计
    for (const item of items) {
      const { id, create_at, update_at, ...rest } = item;
      await HMNStatDao.del({ id });
      await HMNStatLogDao.add({ ...rest, end_reason: HMN_END_REASON.clientClosed, end_at: new Date().toISOString() });
    }
  }

  public handleHelModsInit(params: IOnHelModsInitParams) {
    const { helModNames, envInfo } = params;
  }

  public async getStatList(where: xc.Dict, options?: xc.Dict) {
    const list = await HMNStatDao.get(where, options);
    return list;
  }

  public async reportHelModStat(data: IReportData) {
    const { modName, modVersion, loadAt, envInfo } = data;
    const { workerId, city, containerName, containerIP, podName, imgVersion, envName } = envInfo;
    const isLockSuccess = await lockLogicBool('reportHelModStat', containerName);
    if (!isLockSuccess) {
      return;
    }

    const dbStat = await HMNStatDao.getOne({ container_name: containerName, mod_name: modName });
    if (!dbStat) {
      const loadAtISO = this.getISOTime(loadAt);
      const toAdd: Partial<IHMNStat> = {
        env_name: envName,
        mod_name: modName,
        mod_version: modVersion,
        pod_name: podName,
        container_name: containerName,
        container_ip: containerIP,
        img_version: imgVersion,
        city,
        load_at: loadAtISO,
        load_mode: HMN_LOAD_MODE.onInit,
        extra: { workerId },
      };
      await HMNStatDao.add(toAdd);
      return;
    }

    if (dbStat.mod_version === modVersion) {
      // 可能是 helpack 服务重启，导致客户端重连报上来的版本号，这里不做任何处理
      return;
    }

    await this.updateStat(data, dbStat);
  }

  private async updateStat(data: IReportData, dbStat: IHMNStat) {
    const { modVersion, loadAt, envInfo } = data;
    const { workerId } = envInfo;
    const loadAtISO = this.getISOTime(loadAt);

    const toUpdate = {
      id: dbStat.id,
      mod_version: modVersion,
      load_at: loadAtISO,
      load_mode: HMN_LOAD_MODE.onRunning,
      extra: { workerId },
    };
    const { id, create_at, update_at, ...rest } = dbStat;
    try {
      await HMNStatDao.update(toUpdate);
      const logExtra = { ...(toUpdate.extra || {}), newVer: toUpdate.mod_version };
      const logData = { ...rest, end_reason: HMN_END_REASON.newVersion, end_at: new Date().toISOString(), extra: logExtra };
      await HMNStatLogDao.add(logData);
    } catch (err: any) {
      const toAdd = { ...rest, ...toUpdate, load_mode: HMN_LOAD_MODE.onInit };
      const { id, ...pureAdd } = toAdd;
      await HMNStatDao.add(pureAdd);
    }
  }

  private getISOTime(time: string | number) {
    if (typeof time === 'number') {
      const timestamp = time < 10000000000 ? time * 1000 : time;
      return new Date(timestamp).toISOString();
    }

    return time;
  }
}

export const HMNStatSrv = new HMNStat();
