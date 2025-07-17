/** @typedef {import('hel-mono-types').IMonoDevInfo} IMonoDevInfo*/
const path = require('path');
const fs = require('fs');
const os = require('os');
const shell = require('shelljs');
const { HEL_TPL_INNER_DEMO_DIR, CREATE_SHORT_PARAM_KEY, CREATE_SHORT_PARAM_KEY_NAMES } = require('../consts');
const { getDirInfoList } = require('../util/file');
const { helMonoLog, getCmdKeywords, getMonoRootInfo } = require('../util');
const { rewriteByLines } = require('../util/rewrite');
const { jsonObj2Lines } = require('../entry/replace/util');

function getCreateOptions(/** @type {string[]} */ keywords) {
  const createOptions = {
    targetDirName: '',
    demoDirName: 'react-cra',
    targetBelongToDirName: 'apps',
  };

  const ignoredIdx = {};
  keywords.forEach((word, idx) => {
    if (ignoredIdx[idx]) {
      return;
    }

    if (idx === 0) {
      // TODO 优化为正则，只允许字母 a~z 开头的目录名
      if (word.startsWith('-') || word.startsWith('.')) {
        throw new Error('missing target dir name for .create, you should put it after .create');
      }
      createOptions.targetDirName = word;
      return;
    }

    if (!CREATE_SHORT_PARAM_KEY_NAMES.includes(word)) {
      const these = CREATE_SHORT_PARAM_KEY_NAMES.join(' ');
      throw new Error(`unknown short param key ${word}, it must be one of (${these})`);
    }

    if (CREATE_SHORT_PARAM_KEY.template === word) {
      const templateValue = keywords[idx + 1];
      ignoredIdx[idx + 1] = true;

      const list = getDirInfoList();
      const info = list.find((v) => v.name === templateValue);
      if (!info) {
        const these = list.map((v) => v.name).join(' ');
        throw new Error(`unknown -t(template) value ${templateValue}, it must be one of (${these})`);
      }
      createOptions.demoDirName = templateValue;
    }

    if (CREATE_SHORT_PARAM_KEY.targetBelongToDir === word) {
      const value = keywords[idx + 1];
      ignoredIdx[idx + 1] = true;
      createOptions.targetBelongToDirName = value;
    }
  });

  return createOptions;
}

function getNewPort(/** @type {IMonoDevInfo} */ devInfo) {
  const { appConfs } = devInfo;
  let maxPort = 0;
  Object.keys(appConfs).forEach((key) => {
    const port = appConfs[key].port || 0;
    if (port > maxPort) {
      maxPort = port;
    }
  });
  return maxPort + 1;
}

function rewriteRootDevInfo(/** @type {IMonoDevInfo} */ devInfo, createOptions) {
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
  const { targetDirName } = createOptions;
  mod.appConfs[targetDirName] = {
    port: getNewPort(devInfo),
  };

  const jsonLines = jsonObj2Lines(mod);
  const allLines = [...headLines, ...jsonLines, ...tailLines];
  rewriteByLines(devInfoPath, allLines);
}

function rewritePkgJson(pkgJsonFile, appName) {
  const content = fs.readFileSync(pkgJsonFile, { encoding: 'utf8' });
  const json = JSON.parse(content);
  json.name = appName;
  json.appGroupName = appName;
  fs.writeFileSync(pkgJsonFile, JSON.stringify(json, null, 2));
}

/**
 * 执行 npm start .create hub 命令
 * ```
 * # 创建 react-cra 到 hub 目录到 apps
 * npm start .create hub
 *
 * # 创建 other-demo 到 hub 目录到 apps
 * npm start .create hub -t other-demo
 *
 * # 创建 other-demo 到 hub 目录到 my-apps 目录
 * npm start .create hub -t other-demo -d my-apps
 * ```
 */
exports.execCreate = function (/** @type {IMonoDevInfo} */ devInfo, autoStart = false) {
  const keywords = getCmdKeywords(3);
  helMonoLog(`.create keywords (${keywords.join(' ')})`);
  const createOptions = getCreateOptions(keywords);
  const { monoRoot } = getMonoRootInfo();
  const { targetBelongToDirName, targetDirName, demoDirName } = createOptions;
  const belongToDir = path.join(monoRoot, targetBelongToDirName);

  if (!fs.existsSync(belongToDir)) {
    fs.mkdirSync(belongToDir);
  }

  const appDir = path.join(belongToDir, targetDirName);
  if (fs.existsSync(appDir)) {
    throw new Error(`you can not create app to an existed dir ${appDir}`);
  }
  // 复制模板项目文件
  const demoAppDir = path.join(HEL_TPL_INNER_DEMO_DIR, demoDirName);
  helMonoLog(`start create app to ${appDir}`);
  fs.cpSync(demoAppDir, appDir, { recursive: true });
  helMonoLog(`create app ${demoDirName} done`);

  // 重写根目录的dev-info
  rewriteRootDevInfo(devInfo, createOptions);
  // 重写应用的 package.json
  const pkgJsonFile = path.join(appDir, './package.json');
  rewritePkgJson(pkgJsonFile, targetDirName);
  // 安装依赖
  helMonoLog('pnpm install start');
  shell.exec('pnpm install');
  helMonoLog('pnpm install done');

  if (autoStart) {
    shell.exec(`pnpm start ${targetDirName}`);
  }
};

exports.execCreateStart = function (/** @type {IMonoDevInfo} */ devInfo) {
  exports.execCreate(devInfo, true);
};

/**
 * 执行 npm start .create-mod hub 命令
 */
exports.execCreateMod = function (/** @type {IMonoDevInfo} */ devInfo) {
  // TODO  将来支持
  helMonoLog('TODO, create mod');
};
