/** @typedef {import('../types.d.ts').IArgObj} IArgObj */
const fs = require('fs-extra');
const path = require('path');
const { getConfig } = require('../config');
const { logDebug } = require('./log');

function getProjectDirPath(/** @type IArgObj */ argObj) {
  const cwd = process.cwd();
  const { projectName } = argObj;
  logDebug(`See Var: cwd ${cwd}`);
  const targetDirPath = path.resolve(cwd, projectName);
  if (fs.existsSync(targetDirPath)) {
    throw new Error(`Project [${projectName}] already exists at ${cwd}`);
  }

  return targetDirPath;
}

function getTemplateRepoUrl(templateType) {
  const { repoUrlDict, repoUrlPrefix } = getConfig();
  let repoUrl = repoUrlDict[templateType];
  if (!repoUrl) {
    repoUrl = `${repoUrlPrefix}${templateType}.git`;
  }
  return repoUrl;
}

module.exports = {
  getProjectDirPath,
  getTemplateRepoUrl,
};
