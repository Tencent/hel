import crypto from 'crypto-js';

export function signMD5(content) {
  const sign = crypto.MD5(content).toString();
  return sign;
}
