import biz from 'at/configs/biz';
import * as redisSrv from 'services/redis';

export async function getRemoteVersion(versionId: string) {
  const version = await redisSrv.getCache<nsModel.SubAppVersionParsed>(`${biz.CACHE_VERSION_PREFIX}${versionId}`, true);
  return version;
}

export async function setRemoteVersion(version: nsModel.SubAppVersionParsed | null) {
  if (version) {
    await redisSrv.saveCache(`${biz.CACHE_VERSION_PREFIX}${version.sub_app_version}`, version);
  }
}
