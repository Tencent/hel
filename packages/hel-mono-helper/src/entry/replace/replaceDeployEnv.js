const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

module.exports = function replaceUtil(
  /** @type {import('../../types').ICWDAppData} */ appData,
  /** @type {import('../../types').IMonoDevInfo} */ devInfo,
) {
  const { isSubMod, helDirPath, realAppPkgName } = appData;
  const filePath = isSubMod ? path.join(helDirPath, './configs/deployEnv.ts') : path.join(helDirPath, './deployEnv.ts');
  helMonoLog(`replace content of ${filePath}`);

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

  rewriteFileLine(filePath, (line) => {
    let targetLine = line;
    if (line.includes('export const DEPLOY_ENV')) {
      targetLine = [`// replace result: ${deployEnvComment}`, `export const DEPLOY_ENV = '${deployEnv}';`];
    }
    return { line: targetLine };
  });
};
