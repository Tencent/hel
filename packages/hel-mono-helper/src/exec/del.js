/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const shell = require('shelljs');
const { helMonoLog } = require('../util');
const { checkPkgsLenNotGT1 } = require('../util/err');
const { getCmdKeywordName } = require('../util/keyword');
const { getMonoNameMap } = require('../util/monoName');
const { rewriteMonoJson } = require('./common/rewriteMonoJson');

function inferPkgData(devInfo, modDirOrName) {
  const { dir2Pkgs, prefixedDir2Pkg, pkg2Dir, pkg2BelongTo, pkg2AppDirPath, monoNameMap } = getMonoNameMap(devInfo);
  let pkgName = prefixedDir2Pkg[modDirOrName];

  if (!pkgName && pkg2Dir[modDirOrName]) {
    pkgName = modDirOrName;
  }

  if (!pkgName) {
    const pkgs = dir2Pkgs[modDirOrName] || [];
    checkPkgsLenNotGT1(pkgs);
    if (pkgs.length === 1) {
      pkgName = pkgs[0];
    }
  }

  let pkgPath = '';
  let isSubMod = false;
  if (pkgName) {
    pkgPath = pkg2AppDirPath[pkgName];
    const belongTo = pkg2BelongTo[pkgName];
    const nameMap = monoNameMap[belongTo];
    isSubMod = nameMap.isSubMod;
  }

  return { pkgName, pkgPath, isSubMod };
}

/**
 * 执行启 pnpm start .del xxx-mod 命令
 */
exports.delMod = function (/** @type {IMonoDevInfo} */ devInfo) {
  const modDirOrName = getCmdKeywordName(3);
  helMonoLog(`prepare del process for ${modDirOrName}`);
  if (!modDirOrName) {
    throw new Error('missing del mod dir or name');
  }

  const { pkgName, pkgPath, isSubMod } = inferPkgData(devInfo, modDirOrName);
  if (!pkgName) {
    throw new Error(`can not find package with dir or package name ${modDirOrName}`);
  }

  if (isSubMod) {
    // TODO，检查是否被大仓其他模块依赖
  }

  const label = modDirOrName !== pkgName ? `${modDirOrName}(${pkgName})` : pkgName;
  helMonoLog(`start to del ${label} dir files ...`);
  fs.rmdirSync(pkgPath, { recursive: true });

  helMonoLog(`start to del ${label} in hel-mono.json...`);
  delete devInfo.appConfs[pkgName];
  rewriteMonoJson(devInfo);

  // 安装依赖
  helMonoLog('start reinstall dependencies ...');
  shell.exec('pnpm install');
};
