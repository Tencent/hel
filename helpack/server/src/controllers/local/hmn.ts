import { TController } from 'at/types';
import { type IReportData } from 'services/hmn-stat';
import * as hmnParams from 'services/share/hmnParams';
import * as hmnService from './hmnService';

export const ping: TController = () => {
  return 'pong';
};

export const getHmnApiParams: TController = async () => {
  return hmnParams.getHmnApiParams();
};

export const reportHelModStat: TController<any, any, IReportData> = async (ctx) => {
  return hmnService.reportHelModStat(ctx);
};

export const getStatList: TController = async (ctx) => {
  return hmnService.getStatList(ctx);
};

export const getStatLogList: TController = async (ctx) => {
  return hmnService.getStatLogList(ctx);
};
