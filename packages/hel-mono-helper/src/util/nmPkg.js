const path = require('path');

function getNmPkgJsonByErr(err, allowInvalidName = true) {
  const mayThrowErr = () => {
    if (!allowInvalidName) {
      throw err;
    }
    return { pkgJson: {}, pkgJsonPath: '', isValid: false };
  };

  const msg = err.message;
  // Package subpath './package.json' is not defined by "exports" in {this_is_pkg_path}
  if (msg.includes('./package.json') && msg.includes('exports')) {
    try {
      const [, pkgJsonPath] = msg.split(' in ');
      const pkgJson = require(pkgJsonPath);
      return { pkgJson, pkgJsonPath, isValid: true };
    } catch (err) {
      return mayThrowErr(err);
    }
  }

  return mayThrowErr(err);
}

function getNmPkgJson(nmPkgName, allowInvalidName = true) {
  try {
    const pkgJson = require(`${nmPkgName}/package.json`);
    const modPath = require.resolve(nmPkgName);
    const pkgJsonPath = path.join(modPath, 'package.json');
    return { pkgJson, pkgJsonPath, isValid: true };
  } catch (err) {
    return getNmPkgJsonByErr(err, allowInvalidName);
  }
}

module.exports = {
  getNmPkgJson,
};
