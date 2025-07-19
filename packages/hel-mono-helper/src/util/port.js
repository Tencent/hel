/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/

exports.getPort = function (/** @type {IMonoDevInfo} */ devInfo) {
  const { appConfs } = devInfo;
  let maxPort = 0;
  Object.keys(appConfs).forEach((key) => {
    const port = appConfs[key].port || 0;
    if (port > maxPort) {
      maxPort = port;
    }
  });

  if (!maxPort) {
    return 3000;
  }

  return maxPort + 1;
};
