const path = require('path');
const fs = require('fs');
const { HEL_SCRIPT_HELPER_JSON_PAH } = require('../consts');
const { getCWD } = require('./base');

/** @type {import('../types').IMonoRootInfo} */
let curMonoRootInfo = null;

function getPath(list, lastIdx) {
  const tmpList = [];
  for (let i = 0; i <= lastIdx; i++) {
    tmpList.push(list[i]);
  }
  return tmpList.join(path.sep);
}

function getHelAssociatePath(monoRoot) {
  const monoRootHelDir = path.join(monoRoot, './.hel');
  const monoRootHelLog = path.join(monoRoot, './.hel/.all.log');
  const monoRootHelTmpLog = path.join(monoRoot, './.hel/.all-tmp.log');
  const monoDepJson = path.join(monoRoot, './.hel/.mono-dep.json');
  const monoDepForJson = path.join(monoRoot, './.hel/.mono-dep-for.json');
  const scriptHelperJson = path.join(monoRoot, './.hel/.script-helper.json');
  return { monoRootHelDir, monoRootHelLog, monoRootHelTmpLog, monoDepJson, monoDepForJson, scriptHelperJson };
}

function buildRootInfoAndEnsureFiles(monoRoot) {
  const result = getHelAssociatePath(monoRoot);
  const monoRootInfo = { monoRoot, ...result };

  const { monoRootHelDir, scriptHelperJson } = result;
  // 确定完毕 root 路径信息，确保一下 .hel 目录存在
  if (!fs.existsSync(monoRootHelDir)) {
    fs.mkdirSync(monoRootHelDir);
  }
  if (!fs.existsSync(scriptHelperJson)) {
    fs.cpSync(HEL_SCRIPT_HELPER_JSON_PAH, scriptHelperJson);
  }
  return monoRootInfo;
}

function guessMonoRootByPnpmWorkspace(cwd) {
  const list = cwd.split(path.sep);
  const len = list.length;
  const mayRootPaths = [
    cwd, // getPath(len - 1)
    getPath(list, len - 2),
    getPath(list, len - 3),
    // 最深可能是 /user/path/to/hel-mono/.hel/apps/hub，故至多 len-4 即可查到大仓根目录
    getPath(list, len - 4),
  ];

  let monoRoot = '';
  for (let i = 0; i < mayRootPaths.length; i++) {
    const mayRootPath = mayRootPaths[i];
    const pnpmWorkspacePath = path.join(mayRootPath, './pnpm-workspace.yaml');
    if (fs.existsSync(pnpmWorkspacePath)) {
      monoRoot = mayRootPath;
      break;
    }
  }

  return monoRoot;
}

function guessMonoRootByPresetPath(cwd, presetPath) {
  if (!fs.existsSync(presetPath)) {
    throw new Error(`can not decide mono root path for cwd(${cwd})`);
  }

  console.log(`infer monoRoot failed but found a valid preset path ${presetPath}, hel-mono-helper will use it!`);
  return presetPath;
}

exports.setMonoRoot = function (monoRoot) {
  console.log(`setMonoRoot is called with rootPath ${monoRoot}`);
  const monoRootInfo = buildRootInfoAndEnsureFiles(monoRoot);
  curMonoRootInfo = monoRootInfo;
  return monoRootInfo;
};

/**
 * 获取大仓根目录信息
 */
exports.getMonoRootInfo = function () {
  if (curMonoRootInfo) {
    return curMonoRootInfo;
  }
  const cwd = getCWD();
  let monoRoot = guessMonoRootByPnpmWorkspace(cwd);
  if (!monoRoot) {
    monoRoot = guessMonoRootByPresetPath(cwd, '/data/landun/workspace');
  }
  const monoRootInfo = buildRootInfoAndEnsureFiles(monoRoot);
  curMonoRootInfo = monoRootInfo;

  return curMonoRootInfo;
};
