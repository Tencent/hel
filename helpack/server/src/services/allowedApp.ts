import biz from 'at/configs/biz';
import { default as dao, default as daoV2 } from 'at/dao';
import { isLocal } from 'at/utils/deploy';
import { delay } from 'at/utils/timer';
import { lockByLabel, lockLogicBool } from 'controllers/share/lock';
import * as loggerSrv from 'services/logger';
import * as redisSrv from 'services/redis';
import { runningLogSrv } from 'services/runningLog';

const daoVar = (isLocal() ? dao : daoV2) as typeof daoV2;

class AllowedApp {
  public list: string[] = [];

  private updateId: number | string = 0;

  public async init() {
    this.subChanged();
    await this.initList();
  }

  public isAppAllowed(appName: string) {
    return this.list.includes(appName);
  }

  /** 供管理员调用，当在数据里修改时，调用此接口刷新各个节点的缓存数据 */
  public async refreshList() {
    await lockByLabel('refreshList', 6);
    this.pushLog({ subType: 'refreshList', loc: 'trigger refresh' });
    await this.initList();
    redisSrv.pub(biz.CHANNEL_ALLOWED_APPS_INIT, '');
    const list = this.getAllowedList();
    return list;
  }

  public getAllowedList() {
    return this.list;
  }

  public async addAllowed(appName: string, rtxName: string) {
    if (this.list.includes(appName)) {
      return true;
    }
    await this.lockUpdate();
    await this.update(appName, rtxName, true);
    redisSrv.pub(biz.CHANNEL_ALLOWED_APPS_ADD, appName).catch((err: any) => {
      loggerSrv.error({ source: 'AllowedApp/addAllowed', msg: err.message });
    });
    return true;
  }

  public async delAllowed(appName: string, rtxName: string) {
    if (!this.list.includes(appName)) {
      return true;
    }
    await this.lockUpdate();
    await this.update(appName, rtxName, false);
    redisSrv.pub(biz.CHANNEL_ALLOWED_APPS_DEL, appName).catch((err: any) => {
      loggerSrv.error({ source: 'AllowedApp/delAllowed', msg: err.message });
    });
    return true;
  }

  private async lockUpdate() {
    await lockByLabel('updateAllowedApp');
  }

  private subChanged() {
    const subType = 'subChanged';
    if (isLocal()) {
      return;
    }

    redisSrv.subscribe(biz.CHANNEL_ALLOWED_APPS_ADD, {
      msgReceiveCb: (params) => {
        this.pushLog({ subType, loc: biz.CHANNEL_ALLOWED_APPS_ADD, data: params });
        this.addLocal(params.message);
      },
    });

    redisSrv.subscribe(biz.CHANNEL_ALLOWED_APPS_DEL, {
      msgReceiveCb: (params) => {
        this.pushLog({ subType, loc: biz.CHANNEL_ALLOWED_APPS_DEL, data: params });
        this.delLocal(params.message);
      },
    });

    redisSrv.subscribe(biz.CHANNEL_ALLOWED_APPS_INIT, {
      msgReceiveCb: (params) => {
        this.pushLog({ subType, loc: biz.CHANNEL_ALLOWED_APPS_INIT, data: params });
        this.initList();
      },
    });
  }

  private async initList() {
    let oneData = await daoVar.allowedApp.getOne({});
    if (!oneData) {
      const isLockSuccess = await lockLogicBool('AllowedApp', 'initList');
      if (isLockSuccess) {
        const result = await daoVar.allowedApp.add({ create_by: biz.HEL_OWNER });
        this.pushLog({ subType: 'initList', loc: 'add data to db automatically' });
        oneData = result.objJson;
      } else {
        // 别的节点正在插入中，这里等待并获取
        while (!oneData) {
          await delay(500);
          this.pushLog({ subType: 'initList', loc: 'wait data added' });
          oneData = await daoVar.allowedApp.getOne({});
        }
      }
    }

    this.list = oneData.data.apps;
    this.updateId = oneData.id;
  }

  private pushLog(log: { subType?: string; loc?: string; data?: xc.Dict }) {
    runningLogSrv.pushLog('AllowedApp', log);
  }

  private addLocal(appName: string) {
    if (this.list.includes(appName)) {
      return false;
    }
    this.list.push(appName);
    return true;
  }

  private delLocal(appName: string) {
    const idx = this.list.indexOf(appName);
    if (idx < 0) {
      return false;
    }
    this.list.splice(idx, 1);
    return true;
  }

  private async update(appName: string, rtxName: string, isAllowed: boolean) {
    let action = '';
    if (isAllowed) {
      action = 'add allowed';
      this.addLocal(appName);
    } else {
      action = 'del allowed';
      this.delLocal(appName);
    }

    try {
      const res = await daoVar.allowedApp.update({ id: this.updateId, data: { apps: this.list }, update_by: rtxName });
      daoV2.track
        .add({
          operator: rtxName || '',
          update_json: JSON.stringify({ appName, user: rtxName, action }),
          schema_id: 't_allowed_app',
          from: 'hel',
        })
        .catch((err) => console.error(err)); // 这个错误可以静默掉
      return res;
    } catch (err: any) {
      // 还原 local cache
      if (isAllowed) {
        this.delLocal(appName);
      } else {
        this.addLocal(appName);
      }
      throw err;
    }
  }
}

export const allowedAppSrv = new AllowedApp();
