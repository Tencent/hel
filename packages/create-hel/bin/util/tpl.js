const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const { getConfig } = require('../config');
const { getDepPathStat } = require('./dep');
const { logDebug } = require('./log');

/**
 * 推导 hel-mono-templates 包位置，如不存在则尝试安装
 */
function ensureHelMonoTemplates() {
  const { helMonoTemplates } = getConfig();
  /**
   * 不同版本 npx 安装的 hel-mono-templates 包路径不一样，可能为
   * 1 /Users/soul/.npm/_npx/ace083ee75254b22/node_modules/chalk/source/index.js
   * 2 /Users/soul/.npm/_npx/32399/lib/node_modules/create-hel-mono/node_modules/chalk/source/index.js
   */
  const createHelMonoPkgPath = path.join(__dirname, '../');

  let nodeModulesPath = path.join(createHelMonoPkgPath, './node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    nodeModulesPath = path.join(createHelMonoPkgPath, '../../node_modules');
  }

  let helMonoTemplatesPkgPath = path.join(nodeModulesPath, helMonoTemplates);
  if (!fs.existsSync(helMonoTemplatesPkgPath)) {
    helMonoTemplatesPkgPath = path.join(createHelMonoPkgPath, '../../node_modules');
  }

  if (!fs.existsSync(helMonoTemplatesPkgPath)) {
    logTip(`First time to use create-hel-mono, try install inner templates to local`);
    logDebug(`Execute cmd: cd ${createHelMonoPkgPath}`);
    execSync(`cd ${createHelMonoPkgPath}`);

    const argv = process.argv;
    logDebug(`See var: argv ${argv}`);

    let npmKey = argv.some((v) => v.includes('.npm')) ? 'npm' : 'pnpm';

    if (argv[0].includes('/bin/node') && npmKey !== 'pnpm') {
      npmKey = argv[0].replace('/bin/node', '/bin/npm');
      logDebug(`Use new var: npmKey ${npmKey}`);
    }

    logDebug(`Execute cmd: ${npmKey} --version`);
    execSync(`${npmKey} --version`);

    logDebug(`Execute cmd: ${npmKey} install`);
    execSync(`${npmKey} install ${helMonoTemplates}`);
  } else {
    // TODO 支持 hel-mono --update 来更新模板
    logDebug(`Reuse template store ${helMonoTemplatesPkgPath}`);
  }

  return helMonoTemplatesPkgPath;
}

function getHelMonoTemplatesVerByPath(mayModIndexPath, clearCache) {
  let modPath = mayModIndexPath;
  if (modPath.endsWith('/index.js')) {
    // 去掉末尾的 /index.js
    modPath = modPath.substring(0, modPath.length - 9);
  }

  const pkgJsonPath = path.join(modPath, './package.json');
  if (clearCache) {
    delete require.cache[mayModIndexPath];
    delete require.cache[pkgJsonPath];
  }

  const ver = require(pkgJsonPath).version;
  return ver;
}

function getHelMonoTemplatesVer() {
  const { helMonoTemplates } = getConfig();
  const { modPath, isSuccess, err } = getDepPathStat(helMonoTemplates);
  let ver = '';
  if (isSuccess) {
    ver = getHelMonoTemplatesVerByPath(modPath);
  } else {
    console.error(err);
  }

  return ver;
}

function viewTplStoreVerByPkgManager() {
  const { pkgManager, helMonoTemplates } = getConfig();
  shell.exec(`${pkgManager} view ${helMonoTemplates}`);
}

module.exports = {
  ensureHelMonoTemplates,
  getHelMonoTemplatesVer,
  viewTplStoreVerByPkgManager,
};
