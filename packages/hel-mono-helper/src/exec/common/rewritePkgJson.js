/** @typedef {import('../../types').IArgvOptions} IArgvOptions */
const fs = require('fs');
const path = require('path');

exports.rewritePkgJson = function (/** @type {IArgvOptions} */ argvOptions, userOptions = {}) {
  const { copyToPath, pkgName } = argvOptions;
  // 重写应用的 package.json
  const pkgJsonFile = path.join(copyToPath, './package.json');
  const content = fs.readFileSync(pkgJsonFile, { encoding: 'utf8' });
  const pkgJson = JSON.parse(content);
  pkgJson.name = pkgName;

  if (userOptions.beforeWritePkgJson) {
    userOptions.beforeWritePkgJson({ createOptions: argvOptions, pkgJson });
  }
  fs.writeFileSync(pkgJsonFile, JSON.stringify(pkgJson, null, 2));
};
