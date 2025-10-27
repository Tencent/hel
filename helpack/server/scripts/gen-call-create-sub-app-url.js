/**
 * 管理使用的测试脚本，用于生成创建应用的 的url
 */
const { testHost, prodHost } = require('./helpack-js-sdk/consts');
const util = require('./util');

// APP_NAME=xxx node scripts/gen-call-create-sub-app-url.js

function genCreateSubAppUrl(name, options) {
  const appName = name; // 应用名
  const rtx = 'fantasticsoul'; // 替换为你自己的 rtx
  const timestamp = Date.now(); // 13 位长度的时间戳
  const token = util.getSignToken('CREATE_APP_TOKEN'); // 你的 rtx 对应的用户授权 token 值
  const nonce = util.sign(`${rtx}_${appName}_${timestamp}_${token}`); // 调用签名函数得到随机字符串

  const host = options.isCallTest === '1' ? testHost : prodHost;
  const apiPath = `${host}/openapi/v1/app/info/createSubApp`;
  let reqUrl = `${apiPath}?rtx=${rtx}&timestamp=${timestamp}&nonce=${nonce}&name=${appName}`;

  let appGroupName = options.appGroupName; // 应用组名（可选，不设置的话，后台默认和 appName 保持一样）
  if (appGroupName) {
    reqUrl = `${reqUrl}&app_group_name=${appGroupName}`;
  }

  let desc = options.desc; // 应用描述（可选）
  if (desc) {
    reqUrl = `${reqUrl}&desc=${encodeURIComponent(desc)}`;
  }
  return reqUrl;
}

const reqUrl = genCreateSubAppUrl(process.env.APP_NAME, {
  appGroupName: process.env.APP_GROUP_NAME,
  desc: process.env.APP_DESC,
  isCallTest: process.env.IS_CALL_TEST,
});

console.log('copy createSubApp url below to call by fetch or axios');
console.log(reqUrl);
