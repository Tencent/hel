/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const fs = require('fs');
const path = require('path');

exports.rewritePkgJson = function rewritePkgJson(createOptions) {
  const { copyToPath, modName } = createOptions;
  // 重写应用的 package.json
  const pkgJsonFile = path.join(copyToPath, './package.json');
  const content = fs.readFileSync(pkgJsonFile, { encoding: 'utf8' });
  const json = JSON.parse(content);
  json.name = modName;
  json.appGroupName = modName;
  fs.writeFileSync(pkgJsonFile, JSON.stringify(json, null, 2));
};
