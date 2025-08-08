/** @typedef {import('./types.d.ts').IArgObj} IArgObj */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const util = require('./util');

/**
 * 通过url拉取远端模板代码
 */
exports.fetchTemplateByUrl = async function (/** @type IArgObj */ argObj, dirPath, repoUrl) {
  const { projectName, template, customTplUrl } = argObj;
  const url = repoUrl || customTplUrl;

  try {
    execSync(`git clone --depth=1 ${url} ${projectName}`, { stdio: 'inherit' });
    // 清理 .git 目录
    fs.removeSync(path.join(dirPath, '.git'));
    // 修改根 package.json
    await util.modifyPkgInfo({ projectName, dirPath });
    // logs
    util.logCreateSuccess({ projectName, dirPath });
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
    const templateDir = path.join(helMonoTemplatesPkgPath, `hel-mono-${template}`);
    util.logDebug(`See var: templateDir ${templateDir}`);

    if (!fs.existsSync(templateDir)) {
      throw new Error(`Template [${template}] not found at local`);
    }

    await fs.copy(templateDir, dirPath);
    // 修改根 package.json
    await util.modifyPkgInfo({ projectName, dirPath });
    // 递归处理 packages 下所有 package.json
    const packagesDir = path.join(dirPath, 'packages');
    if (fs.existsSync(packagesDir)) {
      const subDirs = await fs.readdir(packagesDir);
      for (const sub of subDirs) {
        const subPkgPath = path.join(packagesDir, sub, 'package.json');
        if (fs.existsSync(subPkgPath)) {
          const subPkg = await fs.readJson(subPkgPath);
          // 只保留原有 name 字段或可加前缀
          await fs.writeJson(subPkgPath, subPkg, { spaces: 2 });
        }
      }
    }
    util.logCreateSuccess({ projectName, dirPath });
  } catch (e) {
    util.logError(`Pulling local template error: ${e.message}`);
    throw e;
  }
};
