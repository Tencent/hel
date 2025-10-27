import { ICuteExpressCtx, TController } from 'at/types';
import { checkTimestamp } from 'at/utils/time-check';
import * as appShare from 'controllers/share/app';
import { checkHmnNonce, checkQueryNonce } from 'controllers/share/reqGuard';
import { HMNStatSrv, type IReportData } from 'services/hmn-stat';
import * as hmnParams from 'services/share/hmnParams';

function check(ctx: ICuteExpressCtx) {
  const { body, query } = ctx;
  const { timestamp, nonce } = query;
  const { name } = body;
  if (!name) {
    throw new Error('missing app name');
  }

  checkTimestamp(timestamp);
  const serverNonce = ctx.services.app.signReqListByName(body, timestamp);
  appShare.checkNonce(nonce, serverNonce);
}

export const ping: TController = () => {
  return 'pong';
};

export const getHmnApiParams: TController = async (ctx) => {
  checkQueryNonce(ctx.query, true);
  return hmnParams.getHmnApiParams();
};

export const reportHelModStat: TController<any, any, IReportData> = async (ctx) => {
  checkHmnNonce(ctx.query);
  const { body } = ctx;
  try {
    await HMNStatSrv.reportHelModStat(body);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getStatList: TController = async (ctx) => {
  check(ctx);
  const { name, page, size } = ctx.body;
  const { rows, count } = await ctx.dao.HMNStat.getAndCount({ mod_name: name }, { page, size });

  return { list: rows, count };
};

export const getStatLogList: TController = async (ctx) => {
  check(ctx);
  const { name, page, size } = ctx.body;
  const { rows, count } = await ctx.dao.HMNStatLog.getAndCount({ mod_name: name }, { page, size });

  return { list: rows, count };
};
