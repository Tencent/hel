import bizConst from 'at/configs/biz';
import { getAllowApps, getApiHelperToken, getOAUTToken, getOpenApiUserTokens } from 'at/configs/rainbowConf';
import { ICuteExpressCtx, TController } from 'at/types';
import { getServerEnv } from 'at/utils/deploy';
import { signByMd5 } from 'at/utils/sign';
import { checkTimestamp } from 'at/utils/time-check';
import { lockLogic } from 'controllers/share/lock';
import { allowedAppSrv } from 'services/allowedApp';
import * as loggerSrv from 'services/logger';
import * as redisSrv from 'services/redis';
import { runningLogSrv } from 'services/runningLog';
import { statSrv, STAT_TYPE } from 'services/stat';

const { HEL_OWNER } = bizConst;
const serverEnv = getServerEnv();

export const inner = {
  wrapDeployInfo(msg) {
    return {
      msg,
      ...serverEnv,
    };
  },
  getCallOAUTNonce(rtx, timestamp) {
    const content = `${rtx}_${timestamp}_${getOAUTToken()}`;
    return signByMd5(content);
  },
  checkapiHelperToken(ctx: ICuteExpressCtx) {
    const { nonce } = ctx.query;
    if (nonce !== getApiHelperToken()) {
      throw new Error('hey dude, who are you');
    }
  },
};

export const allowApps: TController = async (ctx: ICuteExpressCtx) => {
  const allowApps = getAllowApps();
  return allowApps;
};

export const allowAppsV2: TController = async (ctx: ICuteExpressCtx) => {
  const { nonce } = ctx.query;
  if (nonce !== getApiHelperToken()) {
    throw new Error('hey dude, who are you');
  }
  const allowApps = allowedAppSrv.list;
  return allowApps;
};

export const runningLogs: TController = async (ctx: ICuteExpressCtx) => {
  inner.checkapiHelperToken(ctx);
  const { type = '' } = ctx.query;
  const logs = runningLogSrv.getLogs(type);
  return { ...serverEnv, logs };
};

export const getStat: TController = async (ctx: ICuteExpressCtx) => {
  inner.checkapiHelperToken(ctx);
  // action: node all
  const { action = 'node', key = '0', simple = '0' } = ctx.query;
  let data;
  if (action === 'node') {
    const node = statSrv.getStatNode(key || STAT_TYPE.visitHome);
    data = node.data;
  } else {
    data = statSrv.getStat(key === '0', simple === '0');
  }

  return { ...serverEnv, action, data };
};

export const saveStatData: TController = async (ctx: ICuteExpressCtx) => {
  inner.checkapiHelperToken(ctx);
  const { offset = '0' } = ctx.query;
  const result = await statSrv.saveCacheData(Number(offset));
  return result;
};

export const openApiUserTokens: TController = async (ctx: ICuteExpressCtx) => {
  const { timestamp, nonce, rtx } = ctx.query;
  checkTimestamp(timestamp);

  const serverNonce = inner.getCallOAUTNonce(rtx, timestamp);
  if (nonce !== serverNonce) {
    throw new Error('nonce invalid');
  }
  const tokens = getOpenApiUserTokens();
  return tokens;
};

export const syncStaff: TController = async (ctx: ICuteExpressCtx) => {
  const rtxName = ctx.pipes.getRtxName();
  const { staffStr, syncType } = ctx.body;
  const { timestamp, nonce } = ctx.query;

  if (rtxName !== HEL_OWNER) {
    throw new Error('forbidden');
  }

  // 校验时间戳应当未超时
  checkTimestamp(timestamp);
  await lockLogic('syncStaff', rtxName);

  const serverNonce = ctx.services.app.signCommon(timestamp);
  if (nonce !== serverNonce) {
    throw new Error('nonce invalid');
  }

  const staffStrKey = `STAFF_STR_${syncType}`;
  const ret = await redisSrv.saveCache(staffStrKey, staffStr);
  // 通知其他示例更新本地内存
  redisSrv.pub(bizConst.CHANNEL_STAFF_STR_CHANGED, staffStrKey).catch((err: any) => {
    loggerSrv.error({ source: 'syncStaff/pub', msg: err.message });
  });
  return ret;
};
