const { mapAndPreload } = require('hel-micro-node');

async function main() {
  await mapAndPreload({ '@hel-demo/mono-libs': true });
  require('./server');
}

main().catch(console.error);
