const qpi = require('./api');
const { prepareExProjHelEntry } = require('./entry');
const { inferDevInfo, setEnsurePkgHel, setHandleDevInfo } = require('./util/devInfo');
const cwdUtil = require('./util/cwd');
const { isEXProject } = require('./util/monoPkg');
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

function prepareHelEntry(options) {
  const devInfo = inferDevInfo();
  const { pkgOrDir, forEX } = options || {};
  let targetForEX = forEX;
  const cwdInfo = monoUtil.getCWDInfo();

  // 自身是 ex 项目，则无效再准备相关入口文件
  if (isEXProject(cwdInfo.curCwd)) {
    console.log('****************************** *************** ************** prepareExProjHelEntry');
    const exDirData = cwdUtil.getDirData(cwdInfo.curCwd);
    prepareExProjHelEntry(devInfo, exDirData.prefixedDir);
    return;
  }

  console.log('*********not ex *****', cwdInfo);

  if (forEX === undefined && cwdInfo.forEX) {
    targetForEX = true;
  }
  let targetPkgOrDir = pkgOrDir;
  if (!targetPkgOrDir) {
    const { prefixedDir } = cwdUtil.getDirData(cwdInfo.curCwd);
    targetPkgOrDir = prefixedDir;
  }

  return qpi.prepareHelEntry(devInfo, targetPkgOrDir, targetForEX);
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
