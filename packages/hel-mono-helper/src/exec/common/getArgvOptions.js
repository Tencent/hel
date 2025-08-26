const path = require('path');
const fs = require('fs');
const {
  HEL_TPL_INNER_DEMO_DIR,
  HEL_TPL_INNER_DEMO_MOD_DIR,
  CREATE_SHORT_PARAM_KEY,
  CREATE_SHORT_PARAM_KEY_NAMES,
  PACKAGES,
  APPS,
  MOD_TEMPLATE,
  INNER_ACTION,
} = require('../../consts');
const { getDirInfoList } = require('../../util/file');
const { helMonoLog, getMonoRootInfo } = require('../../util');

const modTplAlas = {
  [MOD_TEMPLATE.lib]: MOD_TEMPLATE.libTs,
  [MOD_TEMPLATE.tsLib]: MOD_TEMPLATE.libTs,
};

function getNameReg(max = 32) {
  return new RegExp(`^[A-Za-z0-9|_|-]{1,${max}}$`);
}

exports.getArgvOptions = function (options, topOptions = {}) {
  /** @type {{keywords:string[], actionKey: string}} */
  const { keywords, actionKey, belongTo, pkgName } = options
  const { monoRoot } = getMonoRootInfo();
  const { isSubMod = false } = topOptions;

  const tplsDemoDirPath = topOptions.tplsDemoDirPath || HEL_TPL_INNER_DEMO_DIR;
  const tplsDemoModDirPath = topOptions.tplsDemoModDirPath || HEL_TPL_INNER_DEMO_MOD_DIR;
  const tplsDirPath = isSubMod ? tplsDemoModDirPath : tplsDemoDirPath;
  const copyToBelongTo = belongTo || (isSubMod ? PACKAGES : APPS);
  const demoModTemplate = isSubMod ? MOD_TEMPLATE.libTs : MOD_TEMPLATE.reactApp;

  const argvOptions = {
    modTemplate: demoModTemplate,
    pkgName: pkgName || '',
    copyToBelongTo,
    copyToDir: '',
    alias: '',
    copyFromPath: '',
    copyToPath: '',
  };

  const ignoredIdx = {};
  keywords.forEach((word, idx) => {
    if (ignoredIdx[idx]) {
      return;
    }

    if (idx === 0) {
      // TODO 优化为正则，只允许字母 a~z 开头的目录名
      if (word.startsWith('-') || word.startsWith('.')) {
        throw new Error(`missing target dir name for ${actionKey}, you should put it after ${actionKey}`);
      }
      argvOptions.copyToDir = word;
      return;
    }

    if (!CREATE_SHORT_PARAM_KEY_NAMES.includes(word)) {
      const these = CREATE_SHORT_PARAM_KEY_NAMES.join(' ');
      throw new Error(`unknown short param key ${word}, it must be one of (${these})`);
    }

    // 指定了模板名
    if (CREATE_SHORT_PARAM_KEY.template === word) {
      const templateValue = keywords[idx + 1];
      helMonoLog(`trigger ${actionKey} with template ${templateValue}`);
      ignoredIdx[idx + 1] = true;

      const list = getDirInfoList(tplsDirPath);
      const targetTpl = modTplAlas[templateValue] || templateValue;

      const info = list.find((v) => v.name === targetTpl);
      if (!info) {
        const these = list.map((v) => v.name).join(' ');
        throw new Error(`unknown -t(template) value ${templateValue}, it must be one of (${these.join(',')})`);
      }
      argvOptions.modTemplate = targetTpl;
    }

    // 创建到某个 belongTo 目录
    if (CREATE_SHORT_PARAM_KEY.targetBelongToDir === word) {
      const value = keywords[idx + 1];
      ignoredIdx[idx + 1] = true;
      argvOptions.copyToBelongTo = value;
    }

    // 指定了别名
    if (CREATE_SHORT_PARAM_KEY.alias === word) {
      const value = keywords[idx + 1];
      ignoredIdx[idx + 1] = true;
      const tip = 'Alias must start with @, and only accept 64 length str between 1~9,a~z,A~Z chars for rest part, for example: @mx';
      if (!value.startsWith('@')) {
        throw new Error(tip);
      }
      const restValue = value.substring(1);
      if (!getNameReg(64).test(restValue)) {
        throw new Error(tip);
      }
      argvOptions.alias = value;
    }

    // 指定了模块名（即包名）
    if (CREATE_SHORT_PARAM_KEY.pkgName === word) {
      const pkgName = keywords[idx + 1] || '';
      if (!pkgName) {
        throw new Error('missing -n value');
      }

      const tip = `-n value (${pkgName}) invalid, valid package name example: @xx-scope/yy or yy`;
      if (pkgName.includes('/')) {
        const strList = pkgName.split('/');
        if (strList.length > 2) {
          throw new Error(tip);
        } else {
          const [scope, name] = strList;
          if (!scope.startsWith('@') || scope.length === '1') {
            throw new Error(tip);
          }
          const scopeRest = scope.substring(1);
          if (!getNameReg(32).test(scopeRest)) {
            throw new Error(tip);
          }
          if (!getNameReg(64).test(name)) {
            throw new Error(tip);
          }
        }
      }

      ignoredIdx[idx + 1] = true;
      argvOptions.pkgName = pkgName;
    }
  });

  const isCreateAction = [INNER_ACTION.create, INNER_ACTION.createMod].includes(actionKey);

  const belongToDirPath = path.join(monoRoot, argvOptions.copyToBelongTo);
  if (isCreateAction && !fs.existsSync(belongToDirPath)) {
    fs.mkdirSync(belongToDirPath);
  }

  argvOptions.pkgName = argvOptions.pkgName || argvOptions.copyToDir;
  // 从此模板复制
  argvOptions.copyFromPath = path.join(tplsDirPath, argvOptions.modTemplate);
  // 复制到指定位置
  argvOptions.copyToPath = path.join(monoRoot, `./${argvOptions.copyToBelongTo}/${argvOptions.copyToDir}`);

  if (isCreateAction && fs.existsSync(argvOptions.copyToPath)) {
    throw new Error(`you can not create ${argvOptions.pkgName} to an existed dir ${argvOptions.copyToPath}`);
  }

  return argvOptions;
};
