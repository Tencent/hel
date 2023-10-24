/*
|--------------------------------------------------------------------------
| npm publush 前检查根目录下 package.json 的版本号是否和 hel_dist/hel-meta.json 一致
|--------------------------------------------------------------------------
*/

const chalk = require('react-dev-utils/chalk');
const pkg = require('../package.json');
const fs = require('fs');
const path = require('path');
const helDistPath = path.resolve(__dirname, '../hel_dist/hel-meta.json');
const existHelMeata = fs.existsSync(helDistPath);

// 检查是否执行npm run build 打包命令
if (!existHelMeata) {
  console.log(chalk.red("Run the 'npm run build' command first.\n"));
  process.exit(1);
}
const { app } = JSON.parse(fs.readFileSync(helDistPath, 'utf-8'));
// 检查根目录下 package.json 的版本号是否和 hel_dist/hel-meta.json 一致
if (app?.build_version !== pkg.version) {
  console.log(chalk.red('The package.json version number and the hel_dist/hel-meta.json version number must be the same.\n'));
  process.exit(1);
}
