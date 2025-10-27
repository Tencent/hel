import envConf from 'at/configs/env';
import { encryptAES, genRandomStr } from 'at/utils/sign';

/**
 * 注：内网使用，此加密仅防混沌猴子，请瑞雪
 */
export function getTcosParams() {
  const { tcosEncryptSecretKey, enableReplyTcosParams } = envConf.other;
  const { appId, access, secretId, secretKey } = envConf.tcos;
  if (!enableReplyTcosParams) {
    return { appId: '', access, secretId: '', nonce: '', nonce2: '', nonce3: '' };
  }

  const { iv: i1, encryptedData: nonce } = encryptAES(secretKey, tcosEncryptSecretKey);
  const nonce2 = genRandomStr(32);
  const { iv: i2, encryptedData: nonce3 } = encryptAES(tcosEncryptSecretKey, nonce2);

  // 前端需以下2步反推出 secretKey
  // const midSec = decryptAES(nonce3, i2, nonce2);
  // const secretKey = decryptAES(nonce, i1, midSec);
  return { appId, access, secretId, nonce, nonce2, nonce3, i1, i2 };
}
