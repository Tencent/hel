/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
/** @typedef {import('../../types').ICreateModOptions} ICreateModOptions*/
const fs = require('fs');
const path = require('path');

exports.rewritePkgJson = function rewritePkgJson(/** @type {ICreateModOptions} */createOptions, userOptions) {
  const { copyToPath, modName } = createOptions;
  // 重写应用的 package.json
  const pkgJsonFile = path.join(copyToPath, './package.json');
  const content = fs.readFileSync(pkgJsonFile, { encoding: 'utf8' });
  const pkgJson = JSON.parse(content);
  pkgJson.name = modName;
  pkgJson.appGroupName = modName;

  if (userOptions.beforeWritePkgJson) {
    userOptions.beforeWritePkgJson({ createOptions, pkgJson });
  }
  fs.writeFileSync(pkgJsonFile, JSON.stringify(pkgJson, null, 2));
};
