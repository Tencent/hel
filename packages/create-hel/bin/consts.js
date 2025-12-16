const CMD_TYPE = {
  init: 'init',
  install: 'install',
  start: 'start',
  build: 'build',
  deps: 'deps',
  create: 'create',
  createMod: 'create-mod',
  test: 'test',
  testOnce: 'test-once',
  testWatch: 'test-watch',
  help: 'help',
};

const CMD_SHORT_TYPE = {
  it: 'init',
  i: 'install',
  s: 'start',
  b: 'build',
  d: 'deps',
  c: 'create',
  cm: 'create-mod',
  t: 'test',
  to: 'test-once',
  tw: 'test-watch',
};

/** hel-mono 大仓相关的内置命令 */
const HEL_MONO_CMD_TYPE_LIST = [
  CMD_TYPE.start,
  CMD_TYPE.build,
  CMD_TYPE.create,
  CMD_TYPE.createMod,
  CMD_TYPE.testOnce,
  CMD_TYPE.testWatch,
  CMD_TYPE.test,
  CMD_TYPE.deps,
];

const CMD_TYPE_LIST = Object.values(CMD_TYPE);

const ALL_CMD_TYPE_LIST = Object.keys(CMD_SHORT_TYPE).concat(Object.values(CMD_SHORT_TYPE));

module.exports = {
  TPL_REACT_MONO: 'react-mono',
  TPL_NODE_DEMO: 'node-demo',
  TPL_HELPACK: 'helpack',
  CLI_KEYWORD: 'hel',
  CLI_FULL_KEYWORD: 'create-hel',
  HEL_MONO_TEMPLATES: 'hel-mono-templates',
  REPO_URL_PREFIX: 'https://github.com/hel-eco/',
  CMD_TYPE,
  CMD_TYPE_LIST,
  CMD_SHORT_TYPE,
  ALL_CMD_TYPE_LIST,
  HEL_MONO_CMD_TYPE_LIST,
};
