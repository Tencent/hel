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

exports.getCreateOptions = function getCreateOptions(/** @type {string[]} */ keywords, options = {}) {
  const { monoRoot } = getMonoRootInfo();
  const { isSubMod = false } = options;

  const tplsDemoDirPath = options.tplsDemoDirPath || HEL_TPL_INNER_DEMO_DIR;
  const tplsDemoModDirPath = options.tplsDemoModDirPath || HEL_TPL_INNER_DEMO_MOD_DIR;
  const tplsDirPath = isSubMod ? tplsDemoModDirPath : tplsDemoDirPath;
  const copyToBelongTo = isSubMod ? PACKAGES : APPS;
  const createKey = isSubMod ? '.create-mod' : '.create';
  const demoModTemplate = isSubMod ? MOD_TEMPLATE.libTs : MOD_TEMPLATE.reactApp;

  const createOptions = {
    modTemplate: demoModTemplate,
    modName: '',
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
        throw new Error(`missing target dir name for ${createKey}, you should put it after ${createKey}`);
      }
      createOptions.copyToDir = word;
      return;
    }

    if (!CREATE_SHORT_PARAM_KEY_NAMES.includes(word)) {
      const these = CREATE_SHORT_PARAM_KEY_NAMES.join(' ');
      throw new Error(`unknown short param key ${word}, it must be one of (${these})`);
    }

    // 指定了模板名
    if (CREATE_SHORT_PARAM_KEY.template === word) {
      const templateValue = keywords[idx + 1];
      helMonoLog(`trigger ${createKey} with template ${templateValue}`);
      ignoredIdx[idx + 1] = true;

      const list = getDirInfoList(tplsDirPath);
      const targetTpl = modTplAlas[templateValue] || templateValue;

      const info = list.find((v) => v.name === targetTpl);
      if (!info) {
        const these = list.map((v) => v.name).join(' ');
        throw new Error(`unknown -t(template) value ${templateValue}, it must be one of (${these.join(',')})`);
      }
      createOptions.modTemplate = targetTpl;
    }

    // 创建到某个 belongTo 目录
    if (CREATE_SHORT_PARAM_KEY.targetBelongToDir === word) {
      const value = keywords[idx + 1];
      ignoredIdx[idx + 1] = true;
      createOptions.copyToBelongTo = value;
    }

    // 指定了别名
    if (CREATE_SHORT_PARAM_KEY.alias === word) {
      const value = keywords[idx + 1];
      ignoredIdx[idx + 1] = true;
      const tip = 'Alias must start with @, and only accept 64 length str between 1~9,a~z,A~Z chars for rest part, for example: @mx.';
      if (!value.startsWith('@')) {
        throw new Error(tip);
      }
      const restValue = value.substring(1);
      if (!getNameReg(64).test(restValue)) {
        throw new Error(tip);
      }
      createOptions.alias = value;
    }

    // 指定了模块名（即包名）
    if (CREATE_SHORT_PARAM_KEY.modName === word) {
      const value = keywords[idx + 1];
      const modName = keywords[idx + 1] || '';
      const tip = '-n value (modName) invalid, valid modName example: @xx-scope/yy or yy';
      if (modName) {
        if (modName.includes('/')) {
          const strList = modName.split('/');
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
      } else {
        if (!getNameReg(64).test(name)) {
          throw new Error(tip);
        }
      }

      ignoredIdx[idx + 1] = true;
      createOptions.modName = value;
    }
  });

  const belongToDirPath = path.join(monoRoot, createOptions.copyToBelongTo);
  if (!fs.existsSync(belongToDirPath)) {
    fs.mkdirSync(belongToDirPath);
  }

  createOptions.modName = createOptions.modName || createOptions.copyToDir;
  // 从此模板复制
  createOptions.copyFromPath = path.join(tplsDirPath, createOptions.modTemplate);
  // 复制到指定位置
  createOptions.copyToPath = path.join(monoRoot, `./${createOptions.copyToBelongTo}/${createOptions.copyToDir}`);

  if (fs.existsSync(createOptions.copyToPath)) {
    throw new Error(`you can not create ${createOptions.modName} to an existed dir ${createOptions.copyToPath}`);
  }

  return createOptions;
};
