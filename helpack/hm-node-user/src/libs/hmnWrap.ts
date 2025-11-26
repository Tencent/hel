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

// 以下所有代码仅是一个实例，可按需改写
const {
  DEPLOY_CONTAINER_NAME, // 容器名
  DEPLOY_ENV, // 环境值，线上为 formal
  DEPLOY_IMAGE_VERSION, // 镜像版本
  DEPLOY_COA_POD, // 节点名
  WORKER_ID,
  HOST_IP, // 容器IP
  DEPLOY_CITY, // 容器主机所在城市
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
    return true;
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
