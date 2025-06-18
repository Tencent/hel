const fs = require('fs');
const { helMonoLog } = require('../../util');

module.exports = function ensureBaseFiles(appData) {
  const { rootHelDirPath, belongTo, belongToDirPath, appDir, appDirPath } = appData;
  if (!fs.existsSync(rootHelDirPath)) {
    helMonoLog('make root .hel dir!');
    fs.mkdirSync(rootHelDirPath);
  }
  if (!fs.existsSync(belongToDirPath)) {
    helMonoLog(`make ${belongTo} dir under root .hel dir!`);
    fs.mkdirSync(belongToDirPath);
  }
  if (!fs.existsSync(appDirPath)) {
    helMonoLog(`make ${appDir} dir under ${belongToDirPath} dir!`);
    fs.mkdirSync(appDirPath);
  }
};
