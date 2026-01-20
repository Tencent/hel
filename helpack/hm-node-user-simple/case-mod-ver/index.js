const { mapAndPreload } = require('hel-micro-node');

async function main() {
  // 映射 @hel-demo/mono-libs 为 hel 模块并预加载，然后其他文件的头部可静态导入并使用此模块
  // 注释掉此映射关系，则使用的模块来自 node_modules 目录
  await mapAndPreload({ '@hel-demo/mono-libs': true });
  require('./server');
}

main().catch(console.error);
