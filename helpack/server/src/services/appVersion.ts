import dao from 'at/dao';
import * as redisSrv from 'services/redis';

/**
 * @param sub_app_name - 版本号id，对应 sub_app_version 表的 sub_app_name 字段
 */
export async function querySubAppVersionListByName(sub_app_name: string, options?: any) {
  const list = await dao.subAppVersion.get({ sub_app_name }, options);
  return list;
}

export async function countSubAppVersionListByName(sub_app_name: string) {
  const countData = await dao.subAppVersion.count({ sub_app_name });
  return countData;
}

export async function addAppVersion(toAdd) {
  await dao.subAppVersion.add(toAdd);
  const appVersion = await dao.subAppVersion.getOne({ sub_app_version: toAdd.sub_app_version });
  redisSrv.saveCache(`SubAppVer_${toAdd.sub_app_version}`, appVersion);
  return appVersion;
}

export async function getAppVersion(versionIndex: string) {
  const appVersion = await dao.subAppVersion.getOne({ sub_app_version: versionIndex });
  return appVersion;
}
