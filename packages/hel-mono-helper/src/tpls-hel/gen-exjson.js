const helper = require('hel-mono-helper');
const fs = require('fs');
const path = require('path');

exports.genExJson = function (shouldWrite) {
  const pkgNames = [];
  const semVers = {};
  const exJson = { vers: {}, pkgJsonPaths: {}, semVers };
  const { vers, pkgJsonPaths } = exJson;
  for (const name of pkgNames) {
    const { pkgJson, pkgJsonPath } = helper.monoUtil.getNmPkgJsonByPath(require.resolve(name));
    vers[name] = pkgJson.version;
    pkgJsonPaths[name] = pkgJsonPath;
  }

  if (shouldWrite) {
    fs.writeFileSync(path.join(__dirname, './ex.json'), JSON.stringify(exJson, null, 2));
  }

  return exJson;
}
