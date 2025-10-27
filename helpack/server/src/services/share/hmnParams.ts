import envConf from 'at/configs/env';
import { encryptAES, genRandomStr } from 'at/utils/sign';

/**
 * 注：内网使用，此加密仅防混沌猴子，请瑞雪
 */
export function getHmnApiParams() {
  const { hmnApiSecForBackend, hmnApiSecForReq } = envConf.other;

  const { iv: i1, encryptedData: nonce } = encryptAES(hmnApiSecForReq, hmnApiSecForBackend);
  const nonce2 = genRandomStr(32);
  const { iv: i2, encryptedData: nonce3 } = encryptAES(hmnApiSecForBackend, nonce2);

  // 前端需以下2步反推出 hmnApiSecForReq
  // const midSec = decryptAES(nonce3, i2, nonce2);
  // const hmnApiSecForReq = decryptAES(nonce, i1, midSec);
  return { nonce, nonce2, nonce3, i1, i2 };
}
