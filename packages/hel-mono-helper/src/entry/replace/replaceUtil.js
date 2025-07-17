const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

module.exports = function replaceUtil(
  /** @type {import('../../types').ICWDAppData} */ appData,
  /** @type {import('hel-mono-types').IMonoDevInfo} */ devInfo,
) {
  const { isSubMod, helDirPath, realAppPkgName } = appData;
  const utilFilePath = isSubMod ? path.join(helDirPath, './configs/util.ts') : path.join(helDirPath, './util.ts');
  helMonoLog(`replace content of util file(${utilFilePath})`);

  const inputDeployEnv = process.env.DEPLOY_ENV;
  const deployEnv = inputDeployEnv || 'prod';
  let deployEnvComment = '';
  if (!inputDeployEnv) {
    deployEnvComment = 'in build process, no process.env.DEPLOY_ENV found, use prod instead';
  } else if (inputDeployEnv !== 'prod') {
    const helConf = devInfo.appConfs[realAppPkgName].hel || {};
    const appNames = helConf.appNames || {};
    if (!appNames[inputDeployEnv]) {
      throw new Error(`deployEnv ${inputDeployEnv} is not declared in hel params for ${realAppPkgName}!`);
    }
    deployEnvComment = `in build process, found process.env.DEPLOY_ENV is ${inputDeployEnv}`;
  }
  helMonoLog(deployEnvComment);

  rewriteFileLine(utilFilePath, (line) => {
    let targetLine = line;
    if (line.includes('const deployEnv')) {
      targetLine = [`// replace result: ${deployEnvComment}`, `const deployEnv = '${deployEnv}';`];
    }
    return { line: targetLine };
  });
};
