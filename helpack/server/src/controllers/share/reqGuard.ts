import envConf from 'at/configs/env';
import errCode from 'at/configs/errCode';
import { signByMd5 } from 'at/utils/sign';
import { checkTimestamp } from 'at/utils/time-check';
import { signStrCommon } from 'services/app';

const { HEL_ERR_NONCE_INVALID } = errCode;

export function checkQueryNonce(query: xc.Dict, isStaticSec?: boolean) {
  const { timestamp, nonce, name } = query;
  checkTimestamp(timestamp);
  const serverNonce = signStrCommon(name, timestamp, isStaticSec);
  compareNonce(nonce, serverNonce);
}

export function compareNonce(nonce: any, serverNonce: any) {
  if (nonce !== serverNonce) {
    throw new HelError('nonce invalid', HEL_ERR_NONCE_INVALID);
  }
}

/**
 * 为 hmn 请求计算签名
 */
export function signHmnApi(name: string, timestamp: number | string) {
  const { hmnApiSecForReq } = envConf.other;
  const content = `${name}_${timestamp}_${hmnApiSecForReq}`;
  return signByMd5(content);
}

export function checkHmnNonce(query) {
  const { name, timestamp, nonce } = query;
  checkTimestamp(timestamp);
  const serverNonce = signHmnApi(name, timestamp);
  compareNonce(nonce, serverNonce);
}
