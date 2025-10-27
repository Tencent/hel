/** @typedef {import('types/domain').IServerModStat} IServerModStat */
/** @typedef {import('types/domain').IServerModStatLog} IServerModStatLog */
import { SEC_STR } from 'configs/constant';
import http from 'services/http';
import { signMD5 } from 'utils/sign';

function getSignedUrl(apiKey, options) {
  const { name, size, page } = options;
  const timestamp = Date.now();
  let url = `/api/v1/hmn/${apiKey}?timestamp=${timestamp}`;
  const content = `${name}_${SEC_STR}_${size}_${page}_${timestamp}`;
  const nonce = signMD5(content);
  url = `${url}&nonce=${nonce}`;

  return url;
}

/**
 * @returns {Promise<IServerModStat[]>}
 */
export async function getServerModStatList(name, page, size) {
  const finalPage = page - 1; // 后台 page 起始值是 0
  const url = getSignedUrl('statList', { name, size, page: finalPage });
  const { list, count } = await http.post(url, { name, page: finalPage, size });

  return { list, count };
}

/**
 * @returns {Promise<IServerModStatLog[]>}
 */
export async function getServerModStatLogList(name, page, size) {
  const finalPage = page - 1; // 后台 page 起始值是 0
  const url = getSignedUrl('statLogList', { name, size, page: finalPage });
  const { list, count } = await http.post(url, { name, page: finalPage, size });

  return { list, count };
}
