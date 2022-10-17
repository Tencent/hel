/*
|--------------------------------------------------------------------------
|
| 此脚本在流水线上会被触发，用于校验组名是否和应用里的组名保持一致
|
|--------------------------------------------------------------------------
*/
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { verbose } from './inner-utils/index';
import { DEFAULT_GUESS_SUB_APP_CONF_PATH } from './_diff/index';

/**
 *
 * @param {Record<string, any>} pkg - 用户模块的 package.json 文件
 * @param {string | {fileFullPath?:string, checkEnv?:boolean}} [fileFullPathOrOptions] - 文件全路径名字，可带或不带后缀（.ts, .js）
 * 不传递 fileFullPath 的话，会按照下面的路径去猜测：
 * 内，执行的代码位于：<projectDir>/node_modules/@tencent/hel-dev-utils/lib/index.js
 * 推测路径：path.join(__dirname, '../../../../src/configs/subApp')
 *
 * 外，执行的代码位于：<projectDir>/node_modules/hel-dev-utils/lib/index.js
 * 推测路径：path.join(__dirname, '../../../src/configs/subApp')
 *
 * 因通常 check 都是在 <projectDir>/scripts/check.js 里执行，如要传递可写为
 * ```js
 *  const fileFullPath = path.join(__dirname, '../src/configs/subApp');
 * ```
 *
 * checkEnv（ default: true ）, 是否检查 process.env.HEL_APP_GROUP_NAME 和 代码里的定义是否对应
 */
export default function (pkg, fileFullPathOrOptions) {
  let fileFullPath = path.join(__dirname, DEFAULT_GUESS_SUB_APP_CONF_PATH);
  let checkEnv = true;
  if (fileFullPathOrOptions) {
    if (typeof fileFullPathOrOptions === 'string') {
      fileFullPath = fileFullPathOrOptions;
    } else {
      fileFullPath = fileFullPathOrOptions.fileFullPath;
      if (fileFullPathOrOptions.checkEnv !== undefined) {
        checkEnv = fileFullPathOrOptions.checkEnv;
      }
    }
  }

  /** 子应用组名 */
  let srcAppGroupName = '';
  let content = '';
  if (fileFullPath.endsWith('.js') || fileFullPath.endsWith('.ts')) {
    content = fs.readFileSync(fileFullPath);
  } else {
    const fileFullPathJs = `${fileFullPath}.js`;
    const fileFullPathTs = `${fileFullPath}.ts`;
    const isJsExist = fs.existsSync(fileFullPathJs);
    if (isJsExist) {
      verbose(`guess js subApp file: ${fileFullPathJs}`);
      content = fs.readFileSync(fileFullPathJs);
    } else {
      verbose(`guess ts subApp file: ${fileFullPathTs}`);
      const isTsExist = fs.existsSync(fileFullPathTs);
      if (isTsExist) {
        content = fs.readFileSync(fileFullPathTs);
      } else {
        throw new Error('no src/configs/subApp.(js|ts) file found');
      }
    }
  }

  const fileStr = content.toString();
  const strList = fileStr.split(os.EOL);
  for (let i = 0; i < strList.length; i++) {
    const item = strList[i];
    // export const HEL_APP_GROUP_NAME = 'your-app';
    // or
    // export const LIB_NAME = 'your-app';
    if (item.includes('export') && item.includes('const') && (item.includes('LIB_NAME') || item.includes('HEL_APP_GROUP_NAME'))) {
      const noBlankStr = item.replace(/ /gi, '');
      let [, appNameStr] = noBlankStr.split('=');
      appNameStr = appNameStr.replace(/'/gi, '');
      appNameStr = appNameStr.replace(/"/gi, '');
      appNameStr = appNameStr.replace(/;/gi, '');
      appNameStr = appNameStr.replace(/\r/gi, '');
      srcAppGroupName = appNameStr;
      break;
    }
  }
  if (!srcAppGroupName) {
    throw new Error(`
    HEL_APP_GROUP_NAME or LIB_NAME not found in src/configs/subApp.(js|ts) file,
    your should expose it like below:
    export const HEL_APP_GROUP_NAME = 'your-app';
    or
    export const LIB_NAME = 'your-app';
  `);
  }

  const pgkAppGroupName = pkg.appGroupName || pkg.name;
  if (pgkAppGroupName !== srcAppGroupName) {
    throw new Error(
      `package.json name [${pgkAppGroupName}] should be equal to src/configs/subApp LIB_NAME(or HEL_APP_GROUP_NAME) [${srcAppGroupName}]`,
    );
  }

  if (checkEnv) {
    // 以下常量由ci&cd系统注入（通常由流水线变量或bash脚本注入）
    const { HEL_APP_GROUP_NAME } = process.env;

    if (pgkAppGroupName !== HEL_APP_GROUP_NAME) {
      throw new Error(`package.json name [${pgkAppGroupName}] should be equal to pipeline var HEL_APP_GROUP_NAME [${HEL_APP_GROUP_NAME}]`);
    }
  }
}
