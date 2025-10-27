import { TController } from 'at/types';
import { appVersionCtrl } from 'at/types/ctrl';
import { SubAppVersion } from 'at/types/domain';
import { asType } from 'at/utils/type';
import appVersionJson from './appVersion.json';

/**
 * 获取版本列表
 */
export const getSubAppVersionListByName: appVersionCtrl.getSubAppVersionListByName = async (ctx) => {
  const { name } = ctx.body;
  if (!name) {
    throw new Error('missing app name');
  }

  const list = appVersionJson.data.filter((v) => v.sub_app_name === name);
  return asType<SubAppVersion[]>(list);
};

/**
 * 统计指定app名字的版本号总数
 */
export const countSubAppVersionListByName: TController<any, any, any> = async (ctx) => {
  const list = await getSubAppVersionListByName(ctx);
  return { total: list.length };
};

/**
 * 通过版本列表获取具体的版本数据
 */
export const getSubAppVersionListByVers: TController = async () => {
  return [];
};

export const resetVerCache: TController = async () => {
  return false;
};
