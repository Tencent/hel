import * as path from 'path';
import { SDK_NAME } from './consts';

export const PREFIX_HEL = 'hel';

export const PREFIX_NPM = 'npm';

export const HEL_META_JSON = 'hel-meta.json';

export const SOCKET_MSG_TYPE = {
  initHelMods: 'initHelMods',
  addHelMods: 'addHelMods',
};

export const HEL_MDO_PROXY = Symbol('HelModProxy');

export const IS_HEL_MOD_PROXY = 1;

/**
 * nodejs 的模块安装目录名
 */
export const NODE_MODULES = 'node_modules';

/**
 * 本地开发时，内部放置hel真实模块的目录名，次目录仅服务于jest测试（此时还处于源码运行状态），
 * 真实的实际存储位置是 sdk 自身路径往上查找的过程中遇到的第一个 nodule_modules下的 .hel_modules
 */
export const MOD_FILES_DIR_NAME = 'mod-files';

/**
 * 在 nodule_modules下放置hel真实模块的目录名称
 */
export const DOT_HEL_MODULES = '.hel_modules';

/**
 * 在 hel 模块目录下的代理文件目录名
 */
export const DOT_PROXY_DIR = '.proxy';

/**
 * 在 hel 模块目录下的运行日志文件目录名
 */
export const DOT_HEL_LOG_DIR = '.log';

/**
 * 本地开发时，内部放置hel代理模块的目录名，服务于jest测试，
 */
export const PROXY_MOD_DIR_NAME = 'proxy-mod';

/**
 * server 模块根目录位置
 */
export const MOD_FILES_PATH = path.join(__dirname, `../${MOD_FILES_DIR_NAME}`);

/**
 * 模块对应的本地存储的最大版本数量
 */
export const LIMIT_VER_COUNT = 10000;

/**
 * hel 的前后台产物目录名
 */
export const HEL_DIST = 'hel_dist';

/**
 * 本地模块初始版本标识前缀
 */
export const MOD_INIT_VER = 'MOD_INIT_VER';

/**
 * 默认的入口文件名（含格式后缀）
 */
export const INDEX_JS = 'index.js';

/**
 * default 属性
 */
export const KEY_DEFAULT = 'default';

/**
 * 代理模块模板文件位置
 */
export const MOD_TPL = path.join(__dirname, './mod-tpl.js');

/**
 * hel模块支持的子路径上限，暂最多只支持20个子路径
 */
export const FILE_SUBPATH_LIMIT = 20;

/**
 * server-mod 目录下的 mod-manager 模块名
 */
export const MOD_MGR_DIR_NAME = 'mod-manager';

/**
 * server-mod 目录下的 map-node-mods 模块名
 */
export const MAP_NODE_MOD_DIR_NAME = 'map-node-mods';

/**
 * 代理文件模板关键字：hel模块名
 */
export const KW_NODE_MOD_NAME = '{{NODE_MOD_NAME}}';

/**
 * 因cdn服务问题导致下载失败后的重试次数，暂定 3 次
 */
export const DOWNLOAD_RETRY_LIMIT = 3;

/**
 * 对象 toString 描述
 */
export const OBJ_DESC = '[object Object]';

/**
 * 模块对象 toString 描述
 */
export const MODULE_DESC = '[object Module]';

/**
 * 多实例运行时，其他实例检查文件锁是否释放的间隔毫秒数
 */
export const WAIT_INTERVAL_MS = 100;

/**
 * 下载服务端各个版本的文件时，在多worker模式下，有一个会创建锁文件并开始下载文件列表，
 * 其他 worker 会等待下载完毕再执行解析模块动作，lock 文件里会写入创建的时间戳，
 * 其他 worker 发现 lock 文件时也会检查一下 lock 文件是否创建时间太过久远，太久远的话则视为无效的锁文件
 */
export const HEL_LOCK_FILE_NAME = 'hel-download-lock.json';

/**
 * 锁文件有效时间（单位：ms），暂定为 60 秒时间，服务于多实例运行模式
 * 有效时间检查时机：
 * 1 新启动服务，本机无文件缓存时， worker1 创建锁文件并开始下载文件，其他多个 worker_n 检查文件锁发现锁文件存在则等待
 * worker1 下载完毕就删除锁文件，其他 worker_n 发现锁文件删除则继续执行自己的从文件解析模块逻辑，
 * 正常情况下，文件下载应该在1到3s内完成，这里给一个非常大的冗余值，同时也会记录个版本下载耗时提供给用户查看
 *
 * 2 服务重启，本机有文件缓存时，检查锁文件是否过期，过期了则 sdk 会继续检测文件列表是否与meta描述一致，如完全一致则跳过下载过程，
 * 正常情况下，这个锁文件不应该存在了，仅当 worker1 创建锁文件并开始下载文件过程中，服务死机了，导致锁文件未能被 worker1 删除，
 * 故重启服务时，需要检查一下锁文件的有效时间
 */
export const HEL_LOCK_FILE_VALID_TIME_MS = 60 * 1000;

/**
 * 编译后的代理文件内容，
 * 注：jest 环境中载入 hel 模块不走此文件，走 jest.doMock 替换
 */
export const COMPILED_PROXY_FILE_TPL = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hmn = require("${SDK_NAME}");
const proxyMod = hmn.requireNodeMod('{{NODE_MOD_NAME}}');
module.exports = proxyMod;
`;
