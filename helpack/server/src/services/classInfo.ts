import * as classInfoDao from 'at/dao/classInfo';
import * as dataCacheSrv from 'services/dataCache';

export async function getList(where: any, options?: any) {
  const list = await classInfoDao.get(where, options);
  list.forEach((item) => (item.class_token = '')); // 屏蔽敏感信息
  return list;
}

export async function getFullClassInfoById(id: any) {
  const list = await classInfoDao.get({ id: Number(id) }, { page: 0, size: 1 });
  return list[0] || null;
}

export async function getClassInfo(key) {
  const cacheData = dataCacheSrv.getClassInfo(key);
  if (cacheData) {
    return cacheData;
  }

  const list = await classInfoDao.get({ class_key: key }, { page: 0, size: 1 });
  const info = list[0];
  if (info) {
    dataCacheSrv.setClassInfo(key, info);
  }

  return info || null;
}

export async function getByKey(key, hiddenToken = true) {
  let classInfo = await getClassInfo(key);
  if (hiddenToken && classInfo) {
    classInfo = { ...classInfo };
    classInfo.class_token = '';
  }

  return classInfo;
}
