/**
 * 依据部署平台相关环境信息提出目标参数
 */
import envConf from 'at/configs/env';

// SUMERU_SERVER:cms_node_server
// SUMERU_ENV:test
const {
  SUMERU_SERVER = '',
  SUMERU_ENV,
  IS_LOCAL_MODE,
  IS_SIMPLE_SERVER,
  WORKER_ID,
  SUMERU_CONTAINER_NAME,
  NODE_APP_INSTANCE,
  // 用于辅助调用工蜂 git api
  GIT_PRIVATE_TOKEN,
  HEL_PLATFORM = 'hel',
} = process.env;

let isStarted = false;

export function changeIsStartedTrue() {
  isStarted = true;
}

export function isServerStarted() {
  return isStarted;
}

/**
 * 是否简单服务器模式
 * 简单服务器只提供 getSubAppVersion getSubAppAndItsVersion getSubAppAndItsFullVersion 基础 open api 功能
 */
export function isSimpleServer() {
  // 显示设置 IS_SIMPLE_SERVER=1 或者未设置都当做是简单服务器，如需要面向内外服务，可显式设置 IS_SIMPLE_SERVER=0
  return IS_SIMPLE_SERVER === '1' || IS_SIMPLE_SERVER === undefined;
}

export function isLocal() {
  return IS_LOCAL_MODE === 'true';
}

export function isProd() {
  return getEnv() === 'prod';
}

export function getHelPlatform() {
  return HEL_PLATFORM;
}

/**
 * 获取当前运行环境
 * @returns
 */
export function getEnv() {
  if (SUMERU_ENV === 'formal') {
    return 'prod';
  }
  return 'test';
}

/**
 * 是否是 helpack 公共服务（非私服）
 */
export function isHel() {
  return SUMERU_SERVER === 'hel';
}

/**
 * 获取hel首页对应的应用名（注：这些应用名已提前在 hel 注册好 ）
 * @returns
 */
export function getAppName() {
  return envConf.other.appName;
}

/** 获取当前 node 实例的 workerId（线上的 node 服务是以 cluster-worker 模式启动的） */
export function getWorkerId() {
  return WORKER_ID || '';
}

/** 返回执行请求的进程所在的123机器的容器id */
export function getContainerId() {
  return SUMERU_CONTAINER_NAME || '';
}

export function getGitPrivateToken() {
  return GIT_PRIVATE_TOKEN || '';
}

export function getServerEnv() {
  return {
    env: SUMERU_ENV || '',
    workerID: WORKER_ID || NODE_APP_INSTANCE || '',
    containerName: SUMERU_CONTAINER_NAME || '',
  };
}
