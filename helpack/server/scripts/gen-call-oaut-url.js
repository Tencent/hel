/**
 * 管理使用的测试脚本，用于生成 查看内存中的用户token 的url
 */
const { testHost, prodHost } = require('./helpack-js-sdk/consts');
const util = require('./util');

function genCallOAUTNonce(rtx, timestamp) {
  const content = `${rtx}_${timestamp}_${util.getSignToken('SEE_OAUT_TOKEN')}`;
  return util.sign(content);
}

// node scripts/gen-call-oaut-url.js
const host = process.env.IS_TEST === '1' ? testHost : prodHost;
const timestamp = Date.now();
const nonce = genCallOAUTNonce('fantasticsoul', timestamp);
const url = `${host}/api/helper/openApiUserTokens?rtx=fantasticsoul&timestamp=${timestamp}&nonce=${nonce}`;
console.log('copy url below to call');
console.log(url);
