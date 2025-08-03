/** @typedef {import('./types.d.ts').IArgObj} IArgObj */
const { fetchTemplateByUrl, fetchRemoteTemplate, fetchLocalTemplate } = require('./fetch-template');
const util = require('./util');

/**
 * 解析命令行参数，创建 hel-mono 模板项目
 */
exports.createTemplate = async function createTemplate(/** @type IArgObj */ argObj) {
  // 如果没有提供项目名，则交互式询问
  if (!argObj.projectName) {
    const inputProjectName = await util.getProjectNameByAsk();
    argObj.projectName = inputProjectName;
  }
  const dirPath = util.getProjectDirPath(argObj);

  if (argObj.customTplUrl) {
    // 拉取自定义路径的模板代码
    await fetchTemplateByUrl(argObj, dirPath);
    return;
  }

  if (argObj.isTplRemote) {
    // 拉取内置模板的对应远端最新代码
    await fetchRemoteTemplate(argObj, dirPath);
    return;
  }

  try {
    // 拉取内置模板的本地代码
    await fetchLocalTemplate(argObj, dirPath);
  } catch (e) {
    // 本地拉取报错则尝试拉远端
    await fetchRemoteTemplate(argObj, dirPath);
  }
};
