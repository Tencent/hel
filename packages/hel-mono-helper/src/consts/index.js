const path = require('path');
const devUtils = require('hel-dev-utils');

const srcPath = path.join(__dirname, '../');

const VER = '1.5.4';

const HEL_EXTERNAL_HTML_PAH = path.join(srcPath, './tpls-hel/empty-index.html');

const HEL_README_PATH = path.join(srcPath, './tpls-hel/hel-read-me.md');

/** react 应用 hel 胶水代码模板 */
const HEL_TPL_INNER_APP_PATH = path.join(srcPath, './tpls-hel/app');

/** 子模块 hel 胶水代码模板 */
const HEL_TPL_INNER_SUB_MOD_PATH = path.join(srcPath, './tpls-hel/sub-mod');

/**
 * 模板项目所在目录
 * TODO 将来支持网络下载其他模板
 */
const HEL_TPL_INNER_DEMO_DIR = path.join(srcPath, './tpls-demo');

const HEL_TPL_INNER_DEMO_MOD_DIR = path.join(srcPath, './tpls-demo-mod');

/**
 * 这些目录不能用来命名为项目目录
 */
const FORBIDDEN_DIR_NAMES = ['test'];

const ACTION_NAME = {
  build: 'build',
  buildHel: 'build:hel',
  start: 'start',
  startRaw: 'start:raw',
  startHel: 'start:hel',
};

const INNER_ACTION = {
  /**
   * 修改模块对应的包名
   */
  change: '.change',
  /**
   * 创建宿主项目
   */
  create: '.create',
  /**
   * 创建宿主项目
   */
  createShort: '.c',
  /**
   * 创建子模块项目
   */
  createMod: '.create-mod',
  /**
   * 创建子模块项目
   */
  createModShort: '.cm',
  /**
   * 创建宿主项目并启动
   */
  createStart: '.create-start',
  createStartShort: '.cs',
  build: '.build',
  /**
   * 删除模块
   */
  del: '.del',
  /**
   * 为宿主初始化微模块相关文件，
   * 首次执行 npm start xx-hub:hel 时需要先执行此命令
   */
  init: '.init',
  /**
   * 重新生成 hel-mono.json 文件
   */
  initMono: '.init-mono',
  /**
   * 启动数组对应的所以子依赖
   */
  startHelDeps: '.deps',
  /**
   * 为代理宿主初始化微模块相关文件，
   * 首次执行 npm start xx-hub:proxy 时需要先执行此命令
   * proxy 此模式仅用于探索，目前暂不支持了，因它的产物需要二次复制，提高了复杂度，
   * 同时和现有的 hel-conf 配置运行模式也完全不兼容
   */
  initProxy: '.init-proxy',
  lint: '.lint',
  tsup: '.tsup',
  test: '.test',
};

const INNER_ACTION_NAMES = Object.keys(INNER_ACTION).map((key) => INNER_ACTION[key]);

// 这些模式被 start xx:mode 直接命中时，需要转为 start:mode 去运行
const START_CMD_MODES = ['hel', 'hwl', 'hwr', 'all', 'deps'];

/**
 * .create 命令能识别的短命令参数
 */
const CREATE_SHORT_PARAM_KEY = {
  template: '-t',
  alias: '-a',
  targetBelongToDir: '-d',
  pkgName: '-n',
};

const CREATE_SHORT_PARAM_KEY_NAMES = Object.keys(CREATE_SHORT_PARAM_KEY).map((key) => CREATE_SHORT_PARAM_KEY[key]);

const MOD_TEMPLATE = {
  exProject: 'ex-project',
  reactApp: 'react-app',
  reactLib: 'react-lib',
  tsLib: 'ts-lib',
  lib: 'lib',
  libTs: 'lib-ts',
};

module.exports = {
  HEL_DIST: devUtils.cst.HEL_DIST_DIR,
  HEL_DIST_EX: 'hel_dist_ex',
  VER,
  MOD_TEMPLATE,
  INNER_ACTION,
  INNER_ACTION_NAMES,
  ACTION_NAME,
  START_CMD_MODES,
  FORBIDDEN_DIR_NAMES,
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
  HEL_TPL_INNER_DEMO_MOD_DIR,
  HEL_EXTERNAL_HTML_PAH,
  HEL_README_PATH,
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
  HOST_NAME: 'localhost',
  /**
   * 本地启动 hel 应用时，仅启动宿主，子模块需要用户主动调用 npm start .deps xx-hub 启动
   */
  HEL_START_AND_WAIT_LOCAL_DEPS: '1',
  /**
   * 本地启动 hel 应用时，自动启动对应的依赖 hel子模块
   */
  HEL_START_WITH_LOCAL_RUNNING_DEPS: '2',
  /**
   * 本地启动 hel 应用时，拉取对应的依赖hel子模块的远程已构建版本
   */
  HEL_START_WITH_REMOTE_DEPS: '3',
  /**
   * 赋值给 process.env.HEL_BUILD ，表示使用微模块模式构建
   */
  HEL_MICRO_BUILD: '1',
  /**
   * 赋值给 process.env.HEL_BUILD ，表示使用微模块模式构建，同时构建 hel 前后端（浏览器端、node端）模块
   */
  HEL_MICRO_BUILD_BS: '2',
  /**
   * 赋值给 process.env.HEL_BUILD ，表示使用传统的整体模式构建
   */
  HEL_ALL_BUILD: '3',
  /**
   * 赋值给 process.env.HEL_BUILD ，表示构建外部external资源
   */
  HEL_EXTERNAL_BUILD: '4',
  /**
   * 赋值给 process.env.HEL_BUILD ，表示构建是在提取 external 资源后放置到宿主内部
   */
  HEL_EXTERNAL_BUILD_INNER: '5',
};
