const qpi = require('./api');
const { inferDevInfo, setEnsurePkgHel, setHandleDevInfo } = require('./util/devInfo');
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

module.exports = {
  executeStart,
  executeBuild,
  executeStartDeps,
  prepareHelEntry,
  getMonoDevData,
  getPkgMonoDepData: qpi.getPkgMonoDepData,
  getPkgMonoDepDataDict: qpi.getPkgMonoDepDataDict,
  buildSrvModToHelDist,
  setEnsurePkgHel,
  setHandleDevInfo,
  monoUtil,
  cst,
};
