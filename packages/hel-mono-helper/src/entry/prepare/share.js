/** @typedef {import('../../types').ICWDAppData} ICWDAppData */
/** @typedef {import('../../types').IMonoDevInfo} IDevInfo */
const fs = require('fs');
const path = require('path');
const { HEL_TPL_INNER_APP_PATH, MOD_TEMPLATE } = require('../../consts');
const { execCreate } = require('../../exec/create');
const { inferDevInfo } = require('../../util/devInfo');
const { getExProjDeps } = require('../../util/ex');
const { cpSync } = require('../../util/file');
const { helMonoLog, isHelExternalBuild } = require('../../util');
const r = require('../replace');

function replaceAppRelevantFiles(appData, devInfo, options = {}) {
  // 在项目自身内部生成 external 相关文件
  if (isHelExternalBuild()) {
    return r.replaceIndexEXFile(appData, devInfo, options);
  }

  const { forEX, masterAppData, exAppData } = options || {};
  if (forEX) {
    const exProjDeps = getExProjDeps(exAppData.appPkgName, devInfo, masterAppData);
    return r.replaceIndexEXFile(exAppData, devInfo, { ...options, exProjDeps });
  }

  r.replaceIndexFile(appData, devInfo);
  const injectedDevInfo = r.replaceDevInfo(appData, devInfo);
  r.replaceSubApp(appData);
  r.replaceDeployEnv(appData, devInfo);
  r.replaceUtil(appData, devInfo);

  return injectedDevInfo;
}

function prepareAppFiles(devInfo, appData, options = {}) {
  const { helDirPath } = appData;
  if (!fs.existsSync(helDirPath)) {
    helMonoLog('make .hel dir!');
    fs.mkdirSync(helDirPath);
  }

  helMonoLog(`copy hel template files to ${helDirPath}`);
  // 只需复制 src 目录下的文件即可
  const fromPath = path.join(HEL_TPL_INNER_APP_PATH, './src');
  if (options.forEX) {
    const indexEXFrom = path.join(fromPath, './indexEX.ts');
    const indexEXTo = path.join(helDirPath, './indexEX.ts');
    cpSync(indexEXFrom, indexEXTo);
  } else {
    cpSync(fromPath, helDirPath, { recursive: true });
  }

  const injectedDevInfo = replaceAppRelevantFiles(appData, devInfo, options);
  return injectedDevInfo;
}

function ensureExAppProject(devInfo, options) {
  /** @type {{masterAppData: ICWDAppData, exAppData:ICWDAppData}} */
  const { masterAppData, exAppData } = options;
  if (!fs.existsSync(exAppData.appDirPath)) {
    const options = {
      isSubMod: exAppData.isSubMod,
      keywords: [exAppData.appDir, '-n', exAppData.appPkgName, '-t', MOD_TEMPLATE.exProject],
    };
    execCreate(devInfo, options);
  }
  const exProjDeps = getExProjDeps(exAppData.appPkgName, devInfo, masterAppData);

  // TODO: 加注释, 这里为何要使用 newDevInfo?
  const newDevInfo = inferDevInfo(true);
  r.replaceExProjectPkgJson(exAppData, exProjDeps);
  prepareAppFiles(newDevInfo, exAppData, { forEX: true, masterAppData, exAppData });

  return { devInfo: newDevInfo, appData: exAppData };
}

module.exports = {
  ensureExAppProject,
  prepareAppFiles,
};
