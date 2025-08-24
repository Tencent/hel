/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoAppConf} IMonoAppConf */
const fs = require('fs');
const path = require('path');
const { APPS, PACKAGES, PKGS } = require('../consts');
const { getPort } = require('./port');
const { getMonoRootInfo } = require('./root-info');

exports.ensureAppConf = function (/** @type {IDevInfo} */ devInfo, /** @type {IMonoAppConf} */ conf, name) {
  const { alias, ...rest } = conf;

  if (!rest.hel) {
    rest.hel = {};
  }
  if (!rest.hel.appGroupName) {
    rest.hel.appGroupName = name;
  }
  if (!rest.hel.appNames) {
    rest.hel.appNames = {};
  }
  if (!rest.port) {
    rest.port = getPort(devInfo);
  }

  return rest;
};

exports.getDevInfoDirs = function (/** @type {IDevInfo} */ devInfo) {
  const { appsDirs = [APPS], subModDirs = [PACKAGES, PKGS] } = devInfo;
  const belongToDirs = appsDirs.concat(subModDirs);
  return { appsDirs, subModDirs, belongToDirs };
};

exports.inferDevInfo = function (allowNull) {
  const { monoRoot } = getMonoRootInfo();
  const dirNames = fs.readdirSync(monoRoot);
  let devInfo = null;

  try {
    for (dir of dirNames) {
      if (dir.startsWith('.') || dir === 'node_modules') {
        continue;
      }

      const dirPath = path.join(monoRoot, `./${dir}`);
      if (!fs.statSync(dirPath).isDirectory()) {
        continue;
      }

      const subDirNames = fs.readdirSync(dirPath);
      if (!subDirNames.includes('dev-info')) {
        continue;
      }

      const devInfoIndexJs = path.join(monoRoot, `./${dir}/dev-info/src/index.js`);
      devInfo = require(devInfoIndexJs);
      break;
    }

    if (!devInfo) {
      throw new Error(`can't find dev-info module, please ensure it exists in project`);
    }
  } catch (err) {
    if (err.message.includes('ensure')) {
      console.error(err);
    }
    if (allowNull) {
      return devInfo;
    }
    throw err;
  }

  return devInfo;
};
