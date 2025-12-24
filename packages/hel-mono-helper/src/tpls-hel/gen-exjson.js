const helper = require('@tencent/hel-mono-helper');
const fs = require('fs');
const path = require('path');

const exJson = { vers: {}, pkgJsonPaths: {} };
const { vers, pkgJsonPaths } = exJson;
const pkgNames = [];
for (const name of pkgNames) {
  const { pkgJson, pkgJsonPath } = helper.monoUtil.getNmPkgJsonByPath(require.resolve(name));
  vers[name] = pkgJson.version;
  pkgJsonPaths[name] = pkgJsonPath;
}

fs.writeFileSync(path.join(__dirname, './ex.json'), JSON.stringify(exJson, null, 2));
