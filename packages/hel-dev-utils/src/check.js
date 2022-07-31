/*
|--------------------------------------------------------------------------
|
| 此脚本在流水线上会被触发，用于校验组名是否和应用里的组名保持一致
|
|--------------------------------------------------------------------------
*/
const path = require('path');
const fs = require('fs');
const os = require('os');


/**
 * 
 * @param {Record<string, any>} pkg - 用户模块的 package.json 文件
 * @param {string} [fileFullPath] - 文件不带后缀的全路径名字
 * 不传递 fileFullPath 的话，会按照下面的路径去猜测：
 * <projectDir>/node_modules/hel-dev-utils/lib/index.js
 * 因通常 check 都是在 <projectDir>/scripts/check.js 里执行，如要传递可写为
 * ```js
 *  const fileFullPath = path.join(__dirname, '../src/configs/subApp');
 * ```
 */
export default function (pkg, fileFullPath) {
  /** 子应用组名 */
  let srcAppGroupName = '';
  let content = '';
  let fileFullPathVar = fileFullPath;
  if (!fileFullPathVar) {
    fileFullPathVar = path.join(__dirname, '../../../../../src/configs/subApp');
  }

  const fileFullPathJs = `${fileFullPathVar}.js`;
  const fileFullPathTs = `${fileFullPathVar}.ts`;
  console.log(`guess js subApp file: ${fileFullPathJs}`);
  console.log(`guess ts subApp file: ${fileFullPathTs}`);
  const isJsExist = fs.existsSync(fileFullPathJs);
  if (isJsExist) {
    content = fs.readFileSync(fileFullPathJs);
  } else {
    const isTsExist = fs.existsSync(fileFullPathTs);
    if (isTsExist) {
      content = fs.readFileSync(fileFullPathTs);
    } else {
      throw new Error('no src/configs/subApp file found')
    }
  }

  const fileStr = content.toString();
  const strList = fileStr.split(os.EOL);
  strList.forEach(item => {
    // export const HEL_APP_GROUP_NAME = 'your-app';
    // or
    // export const LIB_NAME = 'your-app';
    if (item.includes('export') && item.includes('const')
      && (item.includes('LIB_NAME') || item.includes('HEL_APP_GROUP_NAME'))
    ) {
      const noBlankStr = item.replace(/ /gi, '');
      let [, appNameStr] = noBlankStr.split('=');
      appNameStr = appNameStr.replace(/'/gi, '');
      appNameStr = appNameStr.replace(/"/gi, '');
      appNameStr = appNameStr.replace(/;/gi, '');
      srcAppGroupName = appNameStr;
    }
  });
  if (!srcAppGroupName) {
    throw new Error(`
    HEL_APP_GROUP_NAME or LIB_NAME not found in src/configs/subApp.js(ts) file,
    your should expose it like below:
    export const HEL_APP_GROUP_NAME = 'your-app';
    or
    export const LIB_NAME = 'your-app';
  `);
  }

  const pgkAppGroupName = pkg.appGroupName || pkg.name;
  if (pgkAppGroupName !== srcAppGroupName) {
    throw new Error(`package.json name [${pgkAppGroupName}] should be equal to src/configs/subApp LIB_NAME(or HEL_APP_GROUP_NAME) [${srcAppGroupName}]`);
  }

  // 以下常量由蓝盾流水线注入（由流水线变量或bash脚本注入）
  const {
    HEL_APP_GROUP_NAME,
  } = process.env;

  if (pgkAppGroupName !== HEL_APP_GROUP_NAME) {
    throw new Error(`package.json name [${pgkAppGroupName}] should be equal to pipeline var HEL_APP_GROUP_NAME [${HEL_APP_GROUP_NAME}]`);
  }
}
