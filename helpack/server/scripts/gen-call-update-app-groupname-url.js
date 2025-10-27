/**
 * 管理使用的测试脚本，用于生成 删除无版本的应用 的url
 */
const { testHost, prodHost } = require('./helpack-js-sdk/consts');
const util = require('./util');

function genNonce(name, groupname, timestamp) {
  const content = `${name}_${groupname}_${timestamp}_${util.getSignToken('UPDATE_APP_GROUP_NAME_TOKEN')}`;
  return util.sign(content);
}

// APP_NAME=xxx APP_GROUP_NAME=xxx node scripts/gen-call-update-app-groupname-url.js
// IS_TEST=1 APP_NAME=xxx APP_GROUP_NAME=xxx node scripts/gen-call-update-app-groupname-url.js
const name = process.env.APP_NAME;
const groupname = process.env.APP_GROUP_NAME;
const host = process.env.IS_TEST === '1' ? testHost : prodHost;
const timestamp = Date.now();
const nonce = genNonce(name, groupname, timestamp);

const url = `${host}/api/helper/updateSubAppGroupName?name=${name}&groupname=${groupname}&timestamp=${timestamp}&nonce=${nonce}`;
console.log('copy url below to call');
console.log(url);
