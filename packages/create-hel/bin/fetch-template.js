/** @typedef {import('./types.d.ts').IArgObj} IArgObj */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const util = require('./util');
const { TEMPLATE_REACT_MONO } = require('./consts');
const { getConfig } = require('./config');

const fixFilesDirPath = path.join(__dirname, './fix-files');
const gitIgnoreFileTpl = path.join(fixFilesDirPath, './gitignore.txt');
const npmIgnoreFileTpl = path.join(fixFilesDirPath, './npmignore.txt');
const npmRCFileTpl = path.join(fixFilesDirPath, './npmrc.txt');
const npmRCTnpmFileTpl = path.join(fixFilesDirPath, './npmrc-tnpm.txt');

function ensureFiles(dirPath, template) {
  const { pkgManager } = getConfig();
  if (template === TEMPLATE_REACT_MONO) {
    const gitIgnoreFile = path.join(dirPath, './.gitignore');
    const npmIgnoreFile = path.join(dirPath, './.npmignore');
    const npmRcFile = path.join(dirPath, './.npmrc');
    const npmRcFileTplVar = pkgManager === 'tnpm' ? npmRCTnpmFileTpl : npmRCFileTpl;

    if (!fs.existsSync(gitIgnoreFile)) {
      fs.writeFileSync(gitIgnoreFile, fs.readFileSync(gitIgnoreFileTpl));
    }
    if (!fs.existsSync(npmIgnoreFile)) {
      fs.writeFileSync(npmIgnoreFile, fs.readFileSync(npmIgnoreFileTpl));
    }
    if (!fs.existsSync(npmRcFile)) {
      fs.writeFileSync(npmRcFile, fs.readFileSync(npmRcFileTplVar));
    }
  }
}

/**
 * 通过url拉取远端模板代码
 */
exports.fetchTemplateByUrl = async function (/** @type IArgObj */ argObj, dirPath, repoUrl) {
  const { projectName, customTplUrl, template } = argObj;
  const url = repoUrl || customTplUrl;

  try {
    execSync(`git clone --depth=1 ${url} ${projectName}`, { stdio: 'inherit' });
    // 清理 .git 目录
    fs.removeSync(path.join(dirPath, '.git'));
    // 修改根 package.json
    await util.modifyPkgInfo({ projectName, dirPath });
    // logs
    util.logCreateSuccess({ projectName, dirPath, template });
  } catch (e) {
    util.logError(`Pulling template by url error: ${e.message}`);
    throw e;
  }
};

/**
 * 拉取内置模板对应的远端仓库代码
 */
exports.fetchRemoteTemplate = async function (/** @type IArgObj */ argObj, dirPath) {
  util.logTip('Pulling template from remote repository...');
  const repoUrl = util.getTemplateRepoUrl(argObj.template);
  try {
    util.logDebug(`See var: repoUrl ${repoUrl}`);
    await exports.fetchTemplateByUrl(argObj, dirPath, repoUrl);
  } catch (e) {
    util.logError(`Pulling template by url error: ${e.message}`);
    throw e;
  }
};

/**
 * 拉取内置模板对应的本地仓库代码（来自 hel-mono-templates 包体）
 */
exports.fetchLocalTemplate = async function (/** @type IArgObj */ argObj, dirPath) {
  const { projectName, template } = argObj;
  util.logTip(`Pulling template [${template}] from local...`);
  try {
    const helMonoTemplatesPkgPath = util.ensureHelMonoTemplates();
    const { templateLocalDirDict } = getConfig();
    const localDir = templateLocalDirDict[template] || template;
    const templateDir = path.join(helMonoTemplatesPkgPath, localDir);
    util.logDebug(`See var: templateDir ${templateDir}`);

    if (!fs.existsSync(templateDir)) {
      throw new Error(`Template [${template}] not found at local`);
    }

    await fs.copy(templateDir, dirPath);
    // 修改根 package.json
    await util.modifyPkgInfo({ projectName, dirPath });
    // 补齐一些缺失的文件
    ensureFiles(dirPath, template);

    util.logCreateSuccess({ projectName, dirPath, template });
  } catch (e) {
    util.logError(`Pulling local template error: ${e.message}`);
    throw e;
  }
};
