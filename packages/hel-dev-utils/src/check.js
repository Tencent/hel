/*
|--------------------------------------------------------------------------
|
| 此脚本在流水线上会被触发，用于校验组名是否和应用里的组名保持一致
|
|--------------------------------------------------------------------------
*/
/** @typedef {import('./types').ICheckOptions} ICheckOptions */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import cst from './configs/consts';
import { verbose } from './inner-utils/index';
import { pfstr } from './inner-utils/str';

/**
 * @param {Record<string, any>} pkg - 用户模块的 package.json 文件
 * @param {ICheckOptions['fileFullPath'] | ICheckOptions} [subAppFilePathOrOptions] - 文件全路径名字，可带或不带后缀（.ts, .js）
 */
export default function (pkg, subAppFilePathOrOptions) {
  let fileFullPath = path.join(__dirname, cst.DEFAULT_GUESS_SUB_APP_CONF_PATH);
  let checkEnv = true;
  if (subAppFilePathOrOptions) {
    if (typeof subAppFilePathOrOptions === 'string') {
      fileFullPath = subAppFilePathOrOptions;
    } else {
      fileFullPath = subAppFilePathOrOptions.fileFullPath;
      if (subAppFilePathOrOptions.checkEnv !== undefined) {
        checkEnv = subAppFilePathOrOptions.checkEnv;
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
  for (const item of strList) {
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
      appNameStr = appNameStr.replace(/\n/gi, '');
      srcAppGroupName = appNameStr;
      break;
    }
  }
  if (!srcAppGroupName) {
    throw new Error(
      pfstr(`
      HEL_APP_GROUP_NAME or LIB_NAME not found in src/configs/subApp.(js|ts) file,
      your should expose it like below:
      export const HEL_APP_GROUP_NAME = 'your-app';
      or
      export const LIB_NAME = 'your-app';
  `),
    );
  }

  const pgkAppGroupName = pkg.appGroupName || pkg.name;
  if (pgkAppGroupName !== srcAppGroupName) {
    throw new Error(
      `package.json name [${pgkAppGroupName}] should be equal to src/configs/subApp LIB_NAME(or HEL_APP_GROUP_NAME) [${srcAppGroupName}]`,
    );
  }

  if (checkEnv) {
    // 以下常量由 ci&cd 系统注入（通常由流水线变量或 bash 脚本注入）
    const { HEL_APP_GROUP_NAME } = process.env;

    if (pgkAppGroupName !== HEL_APP_GROUP_NAME) {
      throw new Error(`package.json name [${pgkAppGroupName}] should be equal to pipeline var HEL_APP_GROUP_NAME [${HEL_APP_GROUP_NAME}]`);
    }
  }
}
