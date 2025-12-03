const { mapAndPreload } = require('hel-micro-node');

async function main() {
  await mapAndPreload({ '@hel-demo/mono-libs': true });
  require('./my-http');
}

main().catch(console.error);
