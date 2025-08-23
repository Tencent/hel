/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const path = require('path');
const fs = require('fs');
const os = require('os');
const { helMonoLog, getMonoRootInfo } = require('../../util');
const { rewriteByLines } = require('../../util/rewrite');
const { getPort } = require('../../util/port');
const { jsonObj2Lines } = require('../../entry/replace/util');

exports.rewriteRootDevInfo = function rewriteRootDevInfo(/** @type {IMonoDevInfo} */ devInfo, createOptions) {
  const { monoRoot } = getMonoRootInfo();
  let devInfoPath = path.join(monoRoot, './packages/dev-info/src/index.js');
  if (!fs.existsSync(devInfoPath)) {
    devInfoPath = path.join(monoRoot, './base/dev-info/src/index.js');
  }

  if (!fs.existsSync(devInfoPath)) {
    const path1 = path.join(monoRoot, './packages');
    const path2 = path.join(monoRoot, './base');
    throw new Error(`no dev-info package found at ${path1} or ${path2}`);
  }

  helMonoLog(`found dev-info file at ${devInfoPath}`);
  const content = fs.readFileSync(devInfoPath, { encoding: 'utf8' });
  const rawLines = content.split(os.EOL);

  const headLines = [];
  const tailLines = [];
  let isStartFound = false;
  let isEndFound = false;
  rawLines.forEach((line) => {
    if (!isStartFound) {
      if (line.includes('module.exports')) {
        isStartFound = true;
      }
      headLines.push(line);
      return;
    }

    if (isStartFound && !isEndFound) {
      if (line.includes('};')) {
        isEndFound = true;
        tailLines.push('};');
      }
      return;
    }

    if (isEndFound) {
      tailLines.push(line);
    }
  });

  const mod = require(devInfoPath);
  const { modName } = createOptions;
  mod.appConfs[modName] = {
    port: getPort(devInfo),
  };

  const jsonLines = jsonObj2Lines(mod);
  const allLines = [...headLines, ...jsonLines, ...tailLines];
  rewriteByLines(devInfoPath, allLines);
};
