/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
/** @typedef {import('../../types').ICreateModOptions} ICreateModOptions*/
const path = require('path');
const fs = require('fs');
const os = require('os');
const { helMonoLog, getMonoRootInfo } = require('../../util');
const { rewriteByLines } = require('../../util/rewrite');
const { getPort } = require('../../util/port');
const { jsonObj2Lines, ensureTailComma } = require('../../entry/replace/util');

function rewriteImpl(/** @type {IMonoDevInfo} */ devInfo, options) {
  const { beforeRewrite } = options;
  const { monoRoot } = getMonoRootInfo();

  let devInfoPath = path.join(monoRoot, './base/dev-info/src/index.js');
  if (!fs.existsSync(devInfoPath)) {
    devInfoPath = path.join(monoRoot, './packages/dev-info/src/index.js');
  }
  if (!fs.existsSync(devInfoPath)) {
    devInfoPath = path.join(monoRoot, './pkgs/dev-info/src/index.js');
  }

  if (!fs.existsSync(devInfoPath)) {
    const path1 = path.join(monoRoot, './packages');
    const path2 = path.join(monoRoot, './pkgs');
    const path3 = path.join(monoRoot, './base');
    throw new Error(`No dev-info package found at one of ${[path1, path2, path3]}`);
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

  const rawMod = require(devInfoPath);
  if (beforeRewrite) {
    beforeRewrite(rawMod);
  }

  const jsonLines = jsonObj2Lines(rawMod, {
    handleLine: ({ line, isArrPartial, arrStartLine, isArrStartLine, isArrEndLine }) => {
      if (!isArrPartial) {
        return;
      }
      if (!arrStartLine.includes('subModDirs')) {
        return;
      }
      if (isArrStartLine && !isArrEndLine) {
        return line.replaceAll('"', '');
      }
      if (!isArrStartLine && !isArrEndLine) {
        return ensureTailComma(line.replaceAll('"', "'"));
      }

      if (isArrStartLine && isArrEndLine) {
        let [left, right] = line.split(':');
        return `${left.replaceAll('"', '')}:${right.replaceAll('"', "'")}`;
      }
    },
  });
  const allLines = [...headLines, ...jsonLines, ...tailLines];
  rewriteByLines(devInfoPath, allLines);
}

function rewriteRootDevInfo(/** @type {IMonoDevInfo} */ devInfo, /** @type {ICreateModOptions} */ createOptions) {
  rewriteImpl(devInfo, {
    beforeRewrite: (rawDevInfoJson) => {
      const { modName, alias } = createOptions;
      rawDevInfoJson.appConfs[modName] = {
        port: getPort(devInfo),
      };
      if (alias) {
        rawDevInfoJson.appConfs[modName].alias = alias;
      }
    },
  });
}

module.exports = {
  rewriteRootDevInfo,
  rewriteImpl,
};
