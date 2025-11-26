const { getArgObject, getRestArgsStr } = require('./arg');
const { askQuestion } = require('./ask');
const { getIsDebug, setIsDebug } = require('./debug');
const { ensureHelMonoTemplates, viewTplStoreVerByPkgManager } = require('./tpl');
const { getProjectNameByAsk } = require('./interaction');
const { getProjectDirPath, getTemplateRepoUrl } = require('./get');
const { modifyPkgInfo } = require('./pkg');
const { logError, logPurple, logDebug, logTip } = require('./log');
const { logCliInfo, logCreateSuccess, logHelpInfo, logDepPath, logKeyParams, logCliVersion, logFinalError } = require('./log-info');
const { bumpTplStore } = require('./bump');
const { execInstall } = require('./exec');

module.exports = {
  getIsDebug,
  setIsDebug,
  askQuestion,
  ensureHelMonoTemplates,
  getProjectNameByAsk,
  getProjectDirPath,
  getTemplateRepoUrl,
  modifyPkgInfo,
  logCliInfo,
  logCreateSuccess,
  getArgObject,
  getRestArgsStr,
  logError,
  logPurple,
  logDebug,
  logHelpInfo,
  logTip,
  logDepPath,
  logKeyParams,
  logCliVersion,
  logFinalError,
  bumpTplStore,
  viewTplStoreVerByPkgManager,
  execInstall,
};
