const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const { getCWD, helMonoLog } = require('../util');

/**
 * 使用 tsc 或 tsup 构建后台产物（默认tsc），并复制到 hel_dist/srv 目录下
 */
exports.buildSrvModToHelDist = function (isUseTsup = false) {
  const projectDir = getCWD();
  const projectJson = require(path.join(projectDir, './package.json'));
  const projectName = projectJson.name;
  helMonoLog(`start build hel srv mod of ${projectName}(with arg isUseTsup=${isUseTsup})...`);

  if (isUseTsup) {
    shell.exec(`pnpm --filter ${projectName} run build:npm`);
  } else {
    shell.exec(`pnpm --filter ${projectName} run tsc`);
  }
  helMonoLog(`build hel srv mod done`);

  const srvModCopyTo = path.join(projectDir, './hel_dist/srv');
  fs.mkdirSync(srvModCopyTo);
  shell.exec('start to copy hel srv mode build assets...');

  if (isUseTsup) {
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
