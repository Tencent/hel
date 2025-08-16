/** @typedef {import('hel-mono-types').IMonoDevInfo} IDevInfo */
/** @typedef {import('hel-mono-types').IMonoAppConf} IMonoAppConf */
const { HOST_NAME } = require('../consts');
const { getPort } = require('./port');

exports.ensureAppConf = function (/** @type {IDevInfo} */devInfo, /** @type {IMonoAppConf} */conf) {
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
  if (!rest.devHostname) {
    rest.devHostname = conf.devHostname || devInfo.devHostname || HOST_NAME;
  }

  return rest;
}
