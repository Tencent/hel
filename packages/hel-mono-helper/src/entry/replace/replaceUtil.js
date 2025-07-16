const path = require('path');
const { rewriteFileLine } = require('../../util/rewrite');
const { helMonoLog } = require('../../util');

module.exports = function replaceUtil(/** @type {import('../../types').ICWDAppData} */ appData) {
  const { isSubMod, helDirPath } = appData;
  const utilFilePath = isSubMod ? path.join(helDirPath, './configs/util.ts') : path.join(helDirPath, './util.ts');
  helMonoLog(`replace content of util file(${utilFilePath})`);

  const inputDeployEnv = process.env.DEPLOY_ENV;
  const deployEnv = inputDeployEnv || 'prod';
  let deployEnvComment = '';
  if (!inputDeployEnv) {
    deployEnvComment = 'in build process, no process.env.DEPLOY_ENV found, use prod instead';
  } else {
    deployEnvComment = `in build process, found process.env.DEPLOY_ENV is ${inputDeployEnv}`;
  }
  helMonoLog(deployEnvComment);

  rewriteFileLine(utilFilePath, (line) => {
    let targetLine = line;
    if (line.includes('const deployEnv')) {
      targetLine = [
        `// ${deployEnvComment}`,
        `const deployEnv = '${deployEnv}';`,
      ];
    }
    return { line: targetLine };
  });
};
