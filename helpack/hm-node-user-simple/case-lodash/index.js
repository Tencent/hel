const path = require('path');
const { mapAndPreload } = require('hel-micro-node');
const myLodashBetter = require('./my-lodash-better');

async function main() {
  await mapAndPreload({
    lodash: {
      fallback: {
        force: true,
        path: 'lodash',
        pathModOverride: {
          uniq: () => {
            return 'uniq function from fallback';
          },
        },
      },
    },
  });
  require('./server');
}

async function main2() {
  await mapAndPreload({
    lodash: {
      fallback: {
        force: true,
        path: path.join(__dirname, './my-lodash.js'),
      },
    },
  });
  require('./server');
}

async function main3() {
  await mapAndPreload({
    lodash: {
      fallback: {
        force: true,
        mod: myLodashBetter,
      },
    },
  });
  require('./server');
}

// main 是对原模块做部分重新，实现里仅覆盖 lodash 的 uniq 方法
main().catch(console.error);

// main2 和 main3 时对模块做整体替换，会导致 lodash 的 omit 方法变成 undefined，因为 my-lodash.js 中没有 omit 方法
// main2().catch(console.error);
// main3().catch(console.error);
