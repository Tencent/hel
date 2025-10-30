const path = require('path');
const shell = require('shelljs');

exports.getNodeVerMajor = function () {
  const nodeVer = process.version;
  const majorVer = parseInt(nodeVer.substring(1).split('.')[0], 10);
  return majorVer;
};

exports.isNodeVerGte18 = function () {
  return exports.getNodeVerMajor() >= 18;
};

exports.getScriptsDirPath = function () {
  return path.join(__dirname, '../');
};

exports.runScript = function (scriptName) {
  let prefix = '';
  if (exports.isNodeVerGte18()) {
    // 避免如下错误：
    // Error: error:0308010C:digital envelope routines::unsupported
    // at new Hash (node:internal/crypto/hash:69:19)
    // at Object.createHash (node:crypto:133:10)
    // ...
    prefix = 'NODE_OPTIONS=--openssl-legacy-provider ';
  }
  const dirPath = exports.getScriptsDirPath();
  const cmd = `cross-env ${prefix}IS_LOCAL_MODE=true node ${dirPath}${scriptName}`;

  shell.exec(cmd);
};
