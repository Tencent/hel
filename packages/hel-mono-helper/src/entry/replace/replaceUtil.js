const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

module.exports = function replaceUtil(/** @type {import('../../types').ICWDAppData} */ appData) {
  const { isSubMod, helDirPath } = appData;
  const utilFilePath = isSubMod ? path.join(helDirPath, './configs/util.ts') : path.join(helDirPath, './util.ts');
  helMonoLog(`replace content of util file(${utilFilePath})`);

  const inputDeployEnv = process.env.DEPLOY_ENV;
  const deployEnv = inputDeployEnv || 'prod';
  if (!inputDeployEnv) {
    helMonoLog('no process.env.DEPLOY_ENV found, use prod instead');
  } else {
    helMonoLog(`found process.env.DEPLOY_ENV is ${inputDeployEnv}`);
  }

  rewriteFileLine(subAppFilePath, (line) => {
    let targetLine = line;
    if (line.includes('const deployEnv')) {
      targetLine = `const deployEnv = '${deployEnv}';`;
    }
    return { line: targetLine };
  });
};
