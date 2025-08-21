/** 获取描述 args 的对象 */
function getArgObject(args) {
  const argObj = {
    projectName: '',
    template: TEMPLATE,
    isTplRemote: false,
    isSeeHelp: false,
    isDebug: false,
    customTplUrl: '',
    isSeeVersion: false,
  };
  const skipIdx = {};
  const mayAssignObj = (argKeys, objKey, i, isBoolValue) => {
    if (skipIdx[i] || !argKeys.includes(args[i])) {
      return;
    }

    skipIdx[i] = true;
    if (isBoolValue) {
      // -x --xx 自身就表示设置布尔值为 true
      argObj[objKey] = true;
      return;
    }

    if (!args[i + 1]) {
      return;
    }

    skipIdx[i + 1] = true;
    argObj[objKey] = args[i + 1];
  };

  const maySetProjectName = (i) => {
    const name = args[i];
    if (name.startsWith('-') || skipIdx[i]) {
      return;
    }
    argObj.projectName = name;
  };

  for (let i = 0; i < args.length; i++) {
    mayAssignObj(['-h', '--help'], 'isSeeHelp', i, true);
    mayAssignObj(['-d', '--debug'], 'isDebug', i, true);
    mayAssignObj(['-v', '--version'], 'isSeeVersion', i, true);
    mayAssignObj(['-r', '--remote'], 'isTplRemote', i, true);
    mayAssignObj(['-t', '--template'], 'template', i);
    mayAssignObj(['-u', '--url'], 'customTplUrl', i);
    maySetProjectName(i);
  }

  if (argObj.isDebug) {
    setIsDebug(true);
  }

  return argObj;
}

module.exports = {
  getArgObject,
};
