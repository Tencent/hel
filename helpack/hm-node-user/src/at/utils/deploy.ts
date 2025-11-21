/**
 * 依据部署平台相关环境信息提出目标参数
 */

// SUMERU_ENV SUMERU_SERVER 由 123 平台注入
const { SUMERU_ENV, IS_LOCAL_MODE, SUMERU_SERVER, SUMERU_POD_NAME, SUMERU_COA_POD, SUMERU_CONTAINER_NAME, RAINBOW_APP_ID, WORKER_ID } =
  process.env;

/** 仅返回部分关心的环境变量供前端验证 */
export function getProcessEnv() {
  return {
    SUMERU_ENV,
    SUMERU_SERVER,
    SUMERU_POD_NAME,
    SUMERU_COA_POD,
    SUMERU_CONTAINER_NAME,
  };
}

/** 返回执行请求的进程所在的123机器节点id */
export function getNodeId() {
  return SUMERU_POD_NAME || SUMERU_COA_POD || '';
}

/** 返回执行请求的进程所在的123机器的容器id */
export function getContainerId() {
  return SUMERU_CONTAINER_NAME || '';
}

export function isLocal() {
  return IS_LOCAL_MODE === 'true';
}

export function isProd() {
  const env = getEnv() || '';
  return env.indexOf('prod') !== -1;
}

export function isDev() {
  return getEnv() === 'dev';
}

/**
 * 获取当前运行环境
 * @returns
 */
export function getEnv() {
  // 运营老师使用的配置
  if (SUMERU_ENV === 'formal') {
    return 'prod';
  }
  if (SUMERU_SERVER === 'render') {
    return 'test';
  }
  return 'dev';
}

// 返回在基座的配置 key
export function getHubConfigKey() {
  const { XC_HUB_CONFIG_KEY } = process.env;
  if (XC_HUB_CONFIG_KEY) {
    return XC_HUB_CONFIG_KEY;
  }

  const env = getEnv();
  const env2HubConfigKey = {
    prod: 'hub.prod',
    test: 'hub.test',
    dev: 'hub.dev',
  };
  return env2HubConfigKey[env];
}

/** 返回基座应用名 */
export function getHubAppName() {
  const { XC_HUB_APP_NAME } = process.env;
  if (XC_HUB_APP_NAME) {
    return XC_HUB_APP_NAME;
  }

  const env = getEnv();
  const env2appName = {
    prod: 'xc-hub',
    test: 'xc-hub-test',
    dev: 'xc-hub-dev',
  };
  return env2appName[env];
}

/** 返回应用对应的七彩石配置 app-id，由123容器的环境变量注入，通过该配置id换到整个应用的其他配置 */
export function getAppRainbowId() {
  if (!RAINBOW_APP_ID) {
    // 用户未在123平台的「服务详情/环境变量」配置RAINBOW_APP_ID
    throw new Error('miss RAINBOW_APP_ID in 123 service detail env conf');
  }
  return RAINBOW_APP_ID;
}

/** 获取当前 node 实例的 workerId（线上的 node 服务是以 cluster-worker 模式启动的） */
export function getWorkerId() {
  return WORKER_ID || '';
}

export function getRainbowEnvGroupKey() {
  if (isProd()) {
    return 'server.env.prod';
  }
  return 'server.env.test';
}
