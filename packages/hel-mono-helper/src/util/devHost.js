const { HOST_NAME } = require('../consts');
const { getDirData } = require('./cwd');
const { getModMonoDataDict, getRawMonoJson } = require('./monoJson');

function getHelMonoHost(prefixedDir) {
  let targetDir = prefixedDir;
  if (!targetDir) {
    const data = getDirData();
    targetDir = data.prefixedDir;
  }

  const monoJson = getRawMonoJson();
  const { prefixedDirDict } = getModMonoDataDict(monoJson);
  const data = prefixedDirDict[targetDir];

  let devHostname = HOST_NAME;
  if (data) {
    const { pkgName } = data;
    const modConf = monoJson.mods[pkgName] || {};
    devHostname = modConf.devHostname || monoJson.devHostname || HOST_NAME;
  }

  return devHostname;
}

function getHost(options) {
  const { envHostKey = 'HOST', fallbackHost = '0.0.0.0', prefixedDir, isGetEnvVal = true } = options || {};
  let host = (isGetEnvVal ? process.env[envHostKey] : '') || getHelMonoHost(prefixedDir) || fallbackHost;

  // host 不应该带协议，这里特殊处理一下，避免用户配置错误导致 webpack 启动失败
  if (host.startsWith('http://')) {
    host = host.substring(7);
  } else if (host.startsWith('https://')) {
    host = host.substring(8);
  }

  return host;
}

module.exports = {
  getHelMonoHost,
  getHost,
};
