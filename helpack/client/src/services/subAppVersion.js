/** @typedef {import('types/domain').SubAppVersion} SubAppVersion */
import { SEC_STR } from 'configs/constant';
import http from 'services/http';
import { signMD5 } from 'utils/sign';

/**
 * @returns {Promise<SubAppVersion[]>}
 */
export async function getSubAppVersionList(name, page, size) {
  const timestamp = Date.now();
  const finalPage = page - 1; // 后台 page 起始值是 0
  let url = `/api/v1/app/version/getSubAppVersionListByName?timestamp=${timestamp}`;
  const content = `${name}_${SEC_STR}_${size}_${finalPage}_${timestamp}`;
  const nonce = signMD5(content);
  url = `${url}&nonce=${nonce}`;

  const subAppVersionList = await http.post(url, { name, page: finalPage, size });
  return subAppVersionList;
}

export async function countSubAppVersionList(name) {
  const countData = await http.post('/api/v1/app/version/countSubAppVersionListByName', { name });
  return countData;
}

export async function getSubAppVersionListByVers(name, verList) {
  const subAppVersionList = await http.post('/api/v1/app/version/getSubAppVersionListByVers', { name, verList });
  return subAppVersionList;
}

export async function resetVerCache(appName, versionId) {
  const timestamp = Date.now();
  let url = `/api/v1/app/version/resetVerCache?timestamp=${timestamp}`;
  const content = `${versionId}_${timestamp}_${SEC_STR}`;
  const nonce = signMD5(content);
  url = `${url}&nonce=${nonce}`;

  const result = await http.post(url, { versionId, appName });
  return result;
}
