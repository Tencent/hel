import dao from 'at/dao';
import { TController } from 'at/types';
import { checkTimestamp } from 'at/utils/time-check';
import * as appShare from 'controllers/share/app';
import { toVersionIndex } from 'controllers/share/version';
import { Op } from 'sequelize';

/**
 * 获取子应用的版本详情信息，前端不需要记录的 html_content 内容，故这里排除掉
 */
export const getSubAppVersionListByName: TController = async (ctx) => {
  const { midData, body, query } = ctx;
  const { timestamp, nonce } = query;
  const { name, page, size } = body;
  if (!name) {
    throw new Error('missing app name');
  }

  let serverNonce = '';
  if (midData.forSdk) {
    const app = await appShare.checkApp(name);
    serverNonce = await appShare.getSDKRequestNonce(app, timestamp);
  } else {
    checkTimestamp(timestamp);
    serverNonce = ctx.services.app.signReqListByName(body, timestamp);
  }
  appShare.checkNonce(nonce, serverNonce);

  const subAppVersionList = await ctx.services.appVersion.querySubAppVersionListByName(name, { page, size });
  return subAppVersionList;
};

/**
 * 统计指定app名字的版本号总数
 */
export const countSubAppVersionListByName: TController = async (ctx) => {
  const { name } = ctx.body;
  if (!name) {
    throw new Error('miss app name');
  }
  const total = await ctx.services.appVersion.countSubAppVersionListByName(name);
  return { total };
};

/**
 * 通过版本列表获取具体的版本数据
 */
export const getSubAppVersionListByVers: TController = async (ctx) => {
  const { name, verList } = ctx.body;
  const { timestamp, nonce } = ctx.query;
  appShare.checkCommon(name, nonce, timestamp);

  const versionIndexList = verList.map((verTag) => toVersionIndex(name, verTag));
  const verDataList = await ctx.dao.subAppVersion.get(
    {
      sub_app_version: {
        [Op.in]: versionIndexList,
      },
    },
    {
      size: 100,
    },
  );
  return verDataList;
};

/**
 * 重置数据库的应用版本到缓存里
 */
export const resetVerCache: TController = async (ctx) => {
  const { versionId, appName } = ctx.body;
  const { timestamp, nonce } = ctx.query;
  appShare.checkCommon(versionId, nonce, timestamp);

  const versionIndex = toVersionIndex(appName, versionId);
  const list = await dao.subAppVersion.get({ sub_app_version: versionIndex });
  const version = list[0];

  if (!version) {
    throw new Error(`version(${versionIndex}) not exist`);
  }

  await ctx.services.app.querySubAppVersionByVerId(versionIndex, { skipLocalCache: true, skipRemoteCache: true });
  return true;
};
