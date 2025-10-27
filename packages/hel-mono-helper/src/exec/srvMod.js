const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const { getCWD, helMonoLog } = require('../util');
const { chooseBool } = require('../util/dict');
const { getRawMonoJson } = require('../util/monoJson');

/**
 * 使用 tsc 或 tsup 构建后台产物（默认tsc），并复制到 hel_dist/srv 目录下
 */
exports.buildSrvModToHelDist = function (isServerModOneBundle) {
  const projectDir = getCWD();
  const pkgJson = require(path.join(projectDir, './package.json'));
  const pkgName = pkgJson.name;

  let isOneBundle = isServerModOneBundle;
  if (typeof isOneBundle !== 'boolean') {
    const monoJson = getRawMonoJson() || {};
    const mods = monoJson.mods || {};
    const modConf = mods[pkgName] || {};
    isOneBundle = chooseBool([modConf.isServerModOneBundle, monoJson.isServerModOneBundle], true);
  }

  helMonoLog(`start build hel srv mod of ${pkgName}(with arg isServerModOneBundle=${isOneBundle})...`);

  if (isOneBundle) {
    shell.exec(`pnpm --filter ${pkgName} run build:npm`);
  } else {
    shell.exec(`pnpm --filter ${pkgName} run tsc`);
  }
  helMonoLog(`build ${pkgName} hel srv mod done`);

  const srvModCopyTo = path.join(projectDir, './hel_dist/srv');
  if (!fs.existsSync(srvModCopyTo)) {
    fs.mkdirSync(srvModCopyTo, { recursive: true });
  }
  shell.exec('start to copy hel srv mode build assets...');

  if (isOneBundle) {
    const srvModFileCopyFrom = path.join(projectDir, './dist/index.js');
    const srvModFileCopyTo = path.join(srvModCopyTo, './index.js');
    fs.copyFileSync(srvModFileCopyFrom, srvModFileCopyTo);
  } else {
    const srvModCopyFrom = path.join(projectDir, './hel_srv');
    // or use fs-extra copySync
    // fs.copySync(srvModCopyFrom, srvModCopyTo);
    fs.cpSync(srvModCopyFrom, srvModCopyTo, { recursive: true });
    // 复制完毕，删除 tsc 中间产物
    fs.rmSync(srvModCopyFrom, { recursive: true, force: true });
  }
};
