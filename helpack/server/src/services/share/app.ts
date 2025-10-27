import biz from 'at/configs/biz';
import * as redisSrv from 'services/redis';

export async function getRemoteApp(appName: string) {
  const app = await redisSrv.getCache<nsModel.SubAppInfoParsed>(`${biz.CACHE_APP_PREFIX}${appName}`, true);
  return app;
}

export async function setRemoteApp(app: nsModel.SubAppInfoParsed | null) {
  if (app) {
    await redisSrv.saveCache(`${biz.CACHE_APP_PREFIX}${app.name}`, app);
  }
}

export async function delRemoteApp(appName: string) {
  const res = await redisSrv.delCache(`${biz.CACHE_APP_PREFIX}${appName}`);
  return res;
}
