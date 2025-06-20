/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const { getMonoNameMap } = require('./mono-name');

/**
 * keywordName 可以是带父目录名的目录名，目录名，包名，格式形如：apps/hub, hub, @xxx/hub
 * @return {import('../types').INameData}
 */
exports.getNameData = function (/** @type string */ mayPkgOrDir, /** @type {IMonoDevInfo} */ devInfo) {
  const { monoNameMap } = getMonoNameMap(devInfo);

  if (!mayPkgOrDir.startsWith('@') && mayPkgOrDir.includes('/')) {
    const [belongToDir, appDir] = mayPkgOrDir.split('/');
    const dirMonoMap = monoNameMap[belongToDir];
    if (!dirMonoMap) {
      throw new Error(`found no dir ${belongToDir} under hel-mono project`);
    }

    const { nameMap, isSubMod } = dirMonoMap;
    const { dirName2PkgName } = nameMap;
    const pkgName = dirName2PkgName[appDir];
    if (!pkgName) {
      throw new Error(`found no project for ${belongToDir}/${appDir}`);
    }

    return { pkgName, dirName: appDir, isSubMod, belongTo: belongToDir };
  }

  const dirs = Object.keys(monoNameMap);
  let result = null;
  for (let i = 0; i < dirs.length; i++) {
    const belongToDir = dirs[i];
    const { nameMap, isSubMod } = monoNameMap[belongToDir];
    const { dirName2PkgName, pkgName2DirName } = nameMap;

    // 把关键字优先作为包名处理
    const dirName = pkgName2DirName[mayPkgOrDir];
    if (dirName) {
      result = { pkgName: mayPkgOrDir, dirName, isSubMod, belongTo: belongToDir };
      break;
    }

    const pkgName = dirName2PkgName[mayPkgOrDir];
    if (pkgName) {
      result = { pkgName, dirName: mayPkgOrDir, isSubMod, belongTo: belongToDir };
      break;
    }
  }

  // TODO !result 尝试查找 .hel 下的项目，支持 npm start @hel-packages/mono-comps-in-one-v2 来显式启动代理项目

  if (!result) {
    throw new Error(`keyword ${mayPkgOrDir} match nothing under these dirs (${dirs.join(',')})`);
  }

  return result;
};
