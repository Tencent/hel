/*
|--------------------------------------------------------------------------
|
| 生成meta
|
|--------------------------------------------------------------------------
*/
const path = require('path');
const helDevUtils = require('hel-dev-utils');
const packageJson = require('../package.json');

helDevUtils.extractHelMetaJson({
  /** 形如 https://xxxxx.yy.com/<zoneName>/<relativeDirName> */
  buildDirFullPath: path.join(__dirname, '../hel_dist'),
  packageJson,
});
