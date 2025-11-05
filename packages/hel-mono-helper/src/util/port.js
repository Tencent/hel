/** @typedef {import('../types').IMonoDevInfo} IDevInfo */
const { getDirData } = require('./cwd');
const { isHelExternalBuild } = require('./is');
const { getModMonoDataDict, getRawMonoJson } = require('./monoJson');

const defaultAppPort = 3000;
const defaultSubModPort = 3100;
let lastAppPort = 0;
let lastSubModPort = 0;

function computeNewPort(maxPort, isSubMod) {
  let newPort = maxPort;
  const lastPort = isSubMod ? lastSubModPort : lastAppPort;
  if (newPort <= lastPort) {
    newPort = lastPort + 1;
  }

  if (isSubMod) {
    lastSubModPort = newPort;
  } else {
    lastAppPort = newPort;
  }

  return newPort;
}

function getPortByDevInfo(/** @type {IDevInfo} */ devInfo, isSubMod) {
  const mods = devInfo.mods || devInfo.appConfs;
  const { monoDict } = getModMonoDataDict(devInfo);

  let appMaxPort = 0;
  let subModMaxPort = 0;
  Object.keys(mods).forEach((pkgName) => {
    const port = mods[pkgName].port || 0;
    const { isSubMod = false } = monoDict[pkgName] || {};
    if (isSubMod) {
      if (port > subModMaxPort) {
        subModMaxPort = port;
      }
      return;
    }

    if (port > appMaxPort) {
      appMaxPort = port;
    }
  });

  let maxPort = isSubMod ? subModMaxPort : appMaxPort;
  if (maxPort) {
    maxPort = maxPort + 1;
  } else {
    maxPort = isSubMod ? lastSubModPort || defaultSubModPort : lastAppPort || defaultAppPort;
  }

  return computeNewPort(maxPort, isSubMod);
}

function mayAddPort(port) {
  // start:helex 触发应用的 external 启动，自动偏移 1000
  if (isHelExternalBuild()) {
    return port + 1000;
  }

  return port;
}

function getPortByPrefixedDir(prefixedDir) {
  const monoJson = getRawMonoJson();
  const { prefixedDirDict } = getModMonoDataDict(monoJson);
  const data = prefixedDirDict[prefixedDir];
  let port = 3000;

  if (data) {
    const { pkgName } = data;
    const modConf = monoJson.mods[pkgName] || {};
    port = modConf.port || 3000;
  }

  return mayAddPort(port);
}

function getHelMonoPort(prefixedDir) {
  let targetDir = prefixedDir;
  if (!targetDir) {
    const data = getDirData();
    targetDir = data.prefixedDir;
  }
  return getPortByPrefixedDir(targetDir);
}

function getPort(options) {
  let optionsVar = options || {};
  // 兼容旧版本
  if (typeof optionsVar === 'string') {
    optionsVar = { prefixedDir: optionsVar };
  }

  const { envPortKey = 'PORT', fallbackPort = 3000, prefixedDir, isGetEnvVal = true } = optionsVar;
  const envPort = process.env[envPortKey];
  if (isGetEnvVal && envPort) {
    return parseInt(envPort, 10);
  }

  return getHelMonoPort(prefixedDir) || fallbackPort;
}

module.exports = {
  getPortByDevInfo,
  getPortByPrefixedDir,
  getPort,
  getHelMonoPort,
  mayAddPort,
};
