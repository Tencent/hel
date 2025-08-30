/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const { getModMonoDataDict, getMonoJson } = require('./monoJson');

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

function getPortByDevInfo(/** @type {IMonoDevInfo} */ devInfo, isSubMod) {
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

function getPortByPrefixedDir(prefixedDir) {
  const monoJson = getMonoJson();
  const { prefixedDirDict } = getModMonoDataDict(monoJson);
  const data = prefixedDirDict[prefixedDir];
  let port = 3000;

  if (data) {
    const { pkgName } = data;
    const modConf = monoJson.mods[pkgName] || {};
    port = modConf.port || 3000;
  }

  return port;
}

function getPort(prefixedDir) {
  let targetDir = prefixedDir;
  if (!targetDir) {
    const cwd = process.cwd();
    const delimiter = cwd.startsWith('/') ? '/' : '\\';
    const list = cwd.split(delimiter);
    const appDirName = list[list.length - 1];
    const appBelongTo = list[list.length - 2];
    const targetDir = `${appBelongTo}/${appDirName}`;
  }
  const port = getPortByPrefixedDir(targetDir);
  return port;
}

module.exports = {
  getPortByDevInfo,
  getPortByPrefixedDir,
  getPort,
};
