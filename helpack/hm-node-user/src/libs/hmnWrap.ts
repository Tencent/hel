import axios from 'axios';
import hmn from 'hel-micro-node';

const isConnectLocalHelpack = process.env.CONNECT_LOCAL_HELPACK === '1';

function getHost() {
  return isConnectLocalHelpack
    ? {
        apiHost: 'http://localhost:7777',
        wsHost: 'ws://localhost:7777',
      }
    : {
        apiHost: 'https://helmicro.com',
        wsHost: '',
      };
}

/**
 * 随机生成符合逻辑的容器环境信息
 */
const generateRandomEnvInfo = () => {
  // 常见的环境名称
  const envNames = ['prod', 'dev', 'test', 'staging', 'pre'];

  // 常见的城市列表
  const cities = ['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'hangzhou', 'tianjing', 'chengdu', 'wuhan'];

  // 常见的镜像版本号模式
  const imgVersions = ['1.0.0', '1.2.3', '2.0.1', '2.1.0', '3.0.0', '1.5.2'];

  // 随机选择环境名称
  const envName = envNames[Math.floor(Math.random() * envNames.length)];

  // 随机选择城市
  const city = cities[Math.floor(Math.random() * cities.length)];

  // 随机生成IP地址(10.x.x.x私有地址段)
  const ipPart2 = Math.floor(Math.random() * 255);
  const ipPart3 = Math.floor(Math.random() * 255);
  const ipPart4 = Math.floor(Math.random() * 255);
  const containerIp = `10.${ipPart2}.${ipPart3}.${ipPart4}`;

  // 随机生成容器名称和Pod名称(模拟真实命名规则)
  const randomHash1 = Math.random().toString(36).substring(2, 10);
  const randomHash2 = Math.random().toString(36).substring(2, 10);

  const containerName = `${randomHash1}.someContainer.ti${Math.floor(Math.random() * 100000000)}`;
  const podName = `${randomHash2}.someContainer.ti${Math.floor(Math.random() * 100000000)}`;

  // 随机选择镜像版本
  const imgVersion = imgVersions[Math.floor(Math.random() * imgVersions.length)];

  return {
    containerName: containerName,
    container_ip: containerIp,
    pod_name: podName,
    img_version: imgVersion,
    env_name: envName,
    city: city,
  };
};

// 以下所有代码仅是一个实例，可按需改写
const {
  DEPLOY_CONTAINER_NAME = generateRandomEnvInfo().containerName, // 容器名
  DEPLOY_ENV = generateRandomEnvInfo().env_name, // 环境值，线上为 formal
  DEPLOY_IMAGE_VERSION = generateRandomEnvInfo().img_version, // 镜像版本
  DEPLOY_COA_POD = generateRandomEnvInfo().pod_name, // 节点名
  WORKER_ID,
  HOST_IP = generateRandomEnvInfo().container_ip, // 容器IP
  DEPLOY_CITY = generateRandomEnvInfo().city, // 容器主机所在城市
  NODE_APP_INSTANCE,
} = process.env;

const hostData = getHost();
const HELPACK_PROTOCOLED_HOST = hostData.apiHost;
const HELPACK_WS_HOST = hostData.wsHost;
const REPORT_API_URL = `${HELPACK_PROTOCOLED_HOST}/openapi/v1/hmn/reportHelModStat`;

function getEnvInfo() {
  return {
    workerId: WORKER_ID || NODE_APP_INSTANCE || '0',
    city: DEPLOY_CITY || '',
    containerName: DEPLOY_CONTAINER_NAME || '',
    containerIP: HOST_IP || '',
    podName: DEPLOY_COA_POD || '',
    imgVersion: DEPLOY_IMAGE_VERSION || '',
    envName: DEPLOY_ENV || '',
  };
}

async function reportHelModStat(modName: string, modVersion: string) {
  try {
    const envInfo = getEnvInfo();
    const toReport = {
      modName,
      modVersion,
      loadAt: Date.now(),
      envInfo,
    };
    await axios.post(REPORT_API_URL, toReport);
  } catch (err: any) {
    console.error(err);
  }
}

const wrappedApi = hmn.registerPlatform({
  platform: 'hel',
  registrationSource: '@tencent/hel-micro-node',
  helpackApiUrl: `${HELPACK_PROTOCOLED_HOST}/openapi/meta`,
  beforePreloadOnce: async () => {
    return { helpackSocketUrl: HELPACK_WS_HOST };
  },
  getSocketUrlWhenReconnect: async () => {
    return HELPACK_WS_HOST;
  },
  socketHttpPingWhenTryReconnect: async () => {
    // ping your helpack server, return true if successfully pinged
    try {
      const result = await axios.get(`${HELPACK_PROTOCOLED_HOST}/openapi/v1/hmn/ping`);
      return result.data.data === 'pong';
    } catch (err) {
      return false;
    }
  },
  getEnvInfo,
  hooks: {
    onHelModLoaded(params) {
      if (!isConnectLocalHelpack) {
        return;
      }
      const { helModName, version } = params;
      // 上报 hel 模块的运行环境
      reportHelModStat(helModName, version);
    },
  },
});

const api = { ...wrappedApi, registerPlatform: hmn.registerPlatform };

export const {
  mapNodeMods,
  mapAndPreload,
  preloadMappedData,
  initMiddleware,
  preloadMiddleware,
  setGlobalConfig,
  setPlatformConfig,
  recordMemLog,
  getMemLogs,
  downloadFile,
  getHelModMeta,
  getHelModulesPath,
  getNodeModDesc,
  getNodeModVer,
  importNodeMod,
  importNodeModByMeta,
  importNodeModByMetaSync,
  importNodeModByPath,
  downloadNodeModFiles,
  requireNodeMod,
  resolveNodeMod,
  getFallbackMod,
  importHelMod,
  importHelModByMeta,
  importHelModByMetaSync,
  importHelModByPath,
  downloadHelModFiles,
  mockAutoDownload,
  mockUtil,
  registerPlatform,
} = api;

export default api;
