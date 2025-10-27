import { SEC_STR } from 'configs/constant';
import { signMD5 } from 'utils/sign';

export function signUrlByName(url, name, timestamp) {
  const content = `${name}_${timestamp}_${SEC_STR}`;
  const nonce = signMD5(content);
  const signedUrl = `${url}&nonce=${nonce}`;
  return signedUrl;
}

export function signUrl(/** @type string */ url, name, attachNameToUrl) {
  const timestamp = Date.now();
  const content = `${name}_${timestamp}_${SEC_STR}`;
  const nonce = signMD5(content);
  const concatSymbol = url.includes('?') ? '&' : '?';
  const seg = `${attachNameToUrl ? `name=${name}&` : ''}timestamp=${timestamp}&nonce=${nonce}`;

  return `${url}${concatSymbol}${seg}`;
}
