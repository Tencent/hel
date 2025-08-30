const qpi = require('./api');
const { inferDevInfo, setEnsureHelConf, setHandleDevInfo } = require('./util/devInfo');
const { monoUtil, cst, buildSrvModToHelDist } = qpi;

function executeStart(options) {
  const devInfo = inferDevInfo();
  return qpi.executeStart(devInfo, options);
}

function executeBuild() {
  const devInfo = inferDevInfo();
  return qpi.executeBuild(devInfo);
}

function executeStartDeps() {
  const devInfo = inferDevInfo();
  return qpi.executeStartDeps(devInfo);
}

function prepareHelEntry(pkgOrDir) {
  const devInfo = inferDevInfo();
  return qpi.prepareHelEntry(devInfo, pkgOrDir);
}

function getMonoDevData(inputAppSrc) {
  const devInfo = inferDevInfo();
  return qpi.getMonoDevData(devInfo, inputAppSrc);
}

function getPkgMonoDepData(pkgName) {
  const devInfo = inferDevInfo();
  return qpi.getPkgMonoDepData(devInfo, pkgName);
}

function getMonoDepDict() {
  const devInfo = inferDevInfo();
  return qpi.getMonoDepDict(devInfo);
}

module.exports = {
  executeStart,
  executeBuild,
  executeStartDeps,
  prepareHelEntry,
  getMonoDevData,
  getPkgMonoDepData,
  getMonoDepDict,
  buildSrvModToHelDist,
  setEnsureHelConf,
  setHandleDevInfo,
  monoUtil,
  cst,
};
