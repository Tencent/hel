const fs = require('fs');
const path = require('path');
const { helMonoLog } = require('../../util');

module.exports = function replacePkgJson(
  /** @type {import('../../types').ICWDAppData} */ appData,
  /** @type {import('../../types').IMonoAppDepData} */ depData,
) {
  const { belongTo, appDir, appDirPath, realAppPkgName, isForRootHelDir } = appData;
  if (!isForRootHelDir || !depData) {
    return;
  }

  const pkgFilePath = path.join(appDirPath, './package.json');
  const proxyPkgName = `@hel-${belongTo}/${appDir}`;
  helMonoLog(`replace name and dep of ${pkgFilePath}`);
  const pkgJson = require(pkgFilePath);
  pkgJson.name = proxyPkgName;
  pkgJson.dependencies = pkgJson.dependencies || {};
  const deps = pkgJson.dependencies;
  deps[realAppPkgName] = 'workspace:*';

  const { pkg2Deps } = depData;
  const appDeps = pkg2Deps[realAppPkgName] || {};
  Object.keys(appDeps).forEach((depName) => {
    if (depName === proxyPkgName) {
      return;
    }

    const depVer = appDeps[depName];
    if (depVer.startsWith('workspace:')) {
      deps[depName] = 'workspace:*';
    }
  });

  const str = JSON.stringify(pkgJson, null, 2);
  fs.writeFileSync(pkgFilePath, str);
};
