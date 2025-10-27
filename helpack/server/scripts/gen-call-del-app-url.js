/**
 * 管理使用的测试脚本，用于生成删除无版本的应用 的url
 */
const { testHost, prodHost } = require('./helpack-js-sdk/consts');
const util = require('./util');

function genNonce(name, timestamp) {
  const content = `${name}_${timestamp}_${util.getSignToken('DEL_APP_TOKEN')}`;
  return util.sign(content);
}

// APP_NAME=xxx node scripts/gen-call-del-app-url.js
// IS_TEST=1 APP_NAME=xxx node scripts/gen-call-del-app-url.js
const name = process.env.APP_NAME;
const timestamp = Date.now();
const nonce = genNonce(name, timestamp);

const host = process.env.IS_TEST === '1' ? testHost : prodHost;
const url = `${host}/api/helper/delSubApp?name=${name}&timestamp=${timestamp}&nonce=${nonce}`;
console.log('copy url below to call\n');
console.log(url);
