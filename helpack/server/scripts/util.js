/**
 * 这个脚本只服务于 fantasticsoul，用于生成 查看内充中的用户token 的url
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.getSignToken = function getSignToken(key) {
  const content = fs.readFileSync(path.join(__dirname, '../../.helpackenv'));
  const str = content.toString();
  const lines = str.split(os.EOL);
  const tokenLine =
    lines.find((line) => {
      if (line.startsWith('#')) return false;
      return line.includes(`${key}=`);
    }) || '';
  return tokenLine.split(`${key}=`)[1];
};

exports.sign = function sign(content) {
  const md5 = crypto.createHash('md5');
  md5.update(content);
  const sign = md5.digest('hex');
  return sign;
};
