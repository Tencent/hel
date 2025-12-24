const fs = require('fs');
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

function getNmPkgJsonByJsonPath(pkgJsonPath) {
  const pkgJson = require(pkgJsonPath);
  return { pkgJson, pkgJsonPath };
}

function getNmPkgJson(nmPkgName, allowInvalidName = true) {
  try {
    const requestPkgMod = `${nmPkgName}/package.json`;
    const pkgJson = require(requestPkgMod);
    const pkgJsonPath = require.resolve(requestPkgMod);
    return { pkgJson, pkgJsonPath, isValid: true };
  } catch (err) {
    return getNmPkgJsonByErr(err, allowInvalidName);
  }
}

function getNmPkgJsonByPath(mayPkgIndexPath) {
  if (mayPkgIndexPath.endsWith('/package.json')) {
    return getNmPkgJsonByJsonPath(mayPkgIndexPath);
  }
  const getPkgJson = (relPkgPath) => {
    const p0Path = path.join(mayPkgIndexPath, relPkgPath);
    if (fs.existsSync(p0Path)) {
      return getNmPkgJsonByJsonPath(p0Path);
    }
    return null;
  };
  const relPaths = ['./package.json', '../package.json', '../../package.json', '../../../package.json'];
  let pkgJsonData = null;
  for (const relPath of relPaths) {
    pkgJsonData = getPkgJson(relPath);
    if (pkgJsonData) {
      break;
    }
  }
  if (!pkgJsonData) {
    throw new Error(`Cannot find package.json by path ${mayPkgIndexPath}`);
  }

  return pkgJsonData;
}

module.exports = {
  getNmPkgJson,
  getNmPkgJsonByPath,
};
