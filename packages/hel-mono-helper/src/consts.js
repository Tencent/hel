const path = require('path');

const HEL_TPL_INNER_APP_PATH = path.join(__dirname, './tpls-hel/app');

const HEL_TPL_INNER_SUB_MOD_PATH = path.join(__dirname, './tpls-hel/sub-mod');

/**
 * 模板项目所在目录
 * TODO 将来支持网络下载
 */
const HEL_TPL_INNER_DEMO_DIR = path.join(__dirname, './tpls-demo');

const ACTION_NAMES = {
  build: 'build',
  start: 'start',
};

const INNER_ACTION = {
  create: '.create',
  createStart: '.create-start',
  createStartShort: '.cs',
  build: '.build',
  /**
   * 为宿主初始化微模块相关文件，
   * 首次执行 npm start xx-hub:hel 时需要先执行此命令
   */
  init: '.init',
  /**
   * 为代理宿主初始化微模块相关文件，
   * 首次执行 npm start xx-hub:proxy 时需要先执行此命令
   */
  initProxy: '.init-proxy',
  lint: '.lint',
  tsup: '.tsup',
  test: '.test',
  testAll: '.test:all',
};

const INNER_ACTION_NAMES = Object.keys(INNER_ACTION).map((key) => INNER_ACTION[key]);

/**
 * .create 命令能识别的短命令参数
 */
const CREATE_SHORT_PARAM_KEY = {
  template: '-t',
  targetBelongToDir: '-d',
};

const CREATE_SHORT_PARAM_KEY_NAMES = Object.keys(CREATE_SHORT_PARAM_KEY).map((key) => CREATE_SHORT_PARAM_KEY[key]);

/** 执行 xxx:cmdKey 时，cmdKey 在这些命令里则可直接命中并执行 */
const HITABLE_SCRIPT_KEYS = ['tsup', 'tsc', 'build', 'start', 'build:hel', 'build:helbs'];

module.exports = {
  VER: '0.3.1',
  HITABLE_SCRIPT_KEYS,
  INNER_ACTION,
  INNER_ACTION_NAMES,
  ACTION_NAMES,
  CREATE_SHORT_PARAM_KEY,
  CREATE_SHORT_PARAM_KEY_NAMES,
  HEL_MICRO_NAME: 'hel-micro',
  HEL_LIB_PROXY_NAME: 'hel-lib-proxy',
  DEFAULT_HUB: 'hub',
  /**
   * 默认放置 apps 项目（作为web项目构建）的目录名
   */
  APPS: 'apps',
  /**
   * 默认放置 apps 公共依赖的目录名
   */
  PACKAGES: 'packages',
  /**
   * 当应用以 hel 模式启动时，app/src 下 hel 的目录名称
   */
  HEL_DIR_NAME: '.hel',
  LOG_PREFIX: '[hel-mono]',
  LOG_PREFIX_TMP: '[mono-tmp]',
  HEL_TPL_INNER_APP_PATH,
  HEL_TPL_INNER_SUB_MOD_PATH,
  HEL_TPL_INNER_DEMO_DIR,
  /**
   * 模板文件复制到项目里后，某一行将被删除的标记
   */
  HEL_DEL_MARK: '[hel-del-after-copy]',
  /**
   * 内部子模块包组织名称
   */
  INNER_SUB_MOD_ORG: '@hel-packages',
  /**
   * 内部app包组织名称
   */
  INNER_APP_ORG: '@hel-apps',
  /** 默认调试域名 */
  HOST_NAME: 'http://localhost',
};
