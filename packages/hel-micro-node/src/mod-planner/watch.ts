import { CHANNEL_APP_INFO_CHANGED, CHANNEL_APP_VERSION_CHANGED, HOOK_TYPE, SET_BY } from '../base/consts';
import { SOCKET_MSG_TYPE } from '../base/mod-consts';
import { recordMemLog, type ILogOptions } from '../base/mem-logger';
import { getSdkCtx } from '../context';
import { getCaredModNames, getMappedModFetchOptions } from '../context/facade';
import { setMetaCache } from '../context/meta-cache';
import { getGlobalConfig } from '../context/global-config';
import { triggerHook } from '../context/hooks';
import { fetchModInfo } from '../server-mod/mod-meta';
import { WSAutoReconnectClient } from '../socket/client';
import { isRunInJest } from '../test-util/jest-env';
import { getCanFetchNewVersionData } from './facade-helper';
import { mayUpdateModPresetData } from './facade';

interface IMsg {
  id: string;
  data: { modName: string; channel: string };
}

/** 长连接订阅变化逻辑是否已执行 */
const isSocketSubCalledMap: Record<string, boolean> = {};

function log(options: Omit<ILogOptions, 'type'>) {
  recordMemLog({ ...options, type: 'HelModWatch' });
}

/**
 * 订阅来自 helpack 平台的变化消息
 */
export async function subHelpackModChange(platform: string, changeCb: (params: { modName: string; type: string }) => void) {
  const isSocketSubCalled = isSocketSubCalledMap[platform];
  const sdkCtx = getSdkCtx(platform);
  try {
    if (isSocketSubCalled || isRunInJest() || !sdkCtx.helpackSocketUrl) {
      return;
    }

    isSocketSubCalledMap[platform] = true;
    new WSAutoReconnectClient({
      url: sdkCtx.helpackSocketUrl,
      getUrlWhenReconnect: sdkCtx.getSocketUrlWhenReconnect,
      httpPingWhenTryReconnect: sdkCtx.socketHttpPingWhenTryReconnect,
      onConnected: () => {
        const helModNames = getCaredModNames(platform);
        const { careAllModsChange } = sdkCtx;
        const envInfo = sdkCtx.getEnvInfo() || {};
        return { msgType: SOCKET_MSG_TYPE.initHelMods, helModNames, careAllModsChange, envInfo };
      },
      onMessage: (msg: IMsg) => {
        const { modName, channel } = msg.data;
        triggerHook(HOOK_TYPE.onMessageReceived, { platform, helModName: modName, msgType: channel }, platform);
        if ([CHANNEL_APP_INFO_CHANGED, CHANNEL_APP_VERSION_CHANGED].includes(channel)) {
          changeCb({ modName, type: CHANNEL_APP_INFO_CHANGED });
        }
      },
    });
  } catch (err: any) {
    // subscribe失败不会影响服务启动，仅影响 hel 模块的实时更新速度
    // 上面逻辑里的 WSAutoReconnectClient 内部做了 catch 并会按照一定的延迟时间策略去重试，理论上不会抛出错误到这里
    const desc = 'err-sub-helpack-mod-change';
    const msg = `[${desc}] ${err.message}`;
    getGlobalConfig().reporter.reportError({ message: msg, desc, data: platform });
  }
}


/**
 * 接收到了hel模块元数据变化的消息
 */
async function handleHelModChanged(platform: string, modName: string) {
  const sdkCtx = getSdkCtx(platform);
  try {
    const canFetchNew = getCanFetchNewVersionData(platform, modName);
    // 如用户在 mapNodeMods 时写死了版本号，则此处不再响应变化
    if (!canFetchNew) {
      return;
    }

    const fetchOptions = getMappedModFetchOptions(modName, platform);
    const modInfo = await fetchModInfo(modName, fetchOptions);
    if (!modInfo) {
      return;
    }
    // 如设置了 careAllModsChange=true ，内部会缓存此模块元数据，以便提速给用户使用的 fetchModMeta 接口响应
    if (sdkCtx.careAllModsChange) {
      setMetaCache(modInfo.fullMeta);
    }
    mayUpdateModPresetData(platform, SET_BY.watch, modName, modInfo);
  } catch (err: any) {
    const { reporter } = getGlobalConfig();
    reporter.reportError({ message: err.stack, desc: 'err-handle-hel-mod-changed', data: platform });
    const errMsg = err.message;
    log({ subType: 'handleHelModChanged', desc: 'err occurred', data: { modName, errMsg, platform } });
  }
}

/** 开启消息订阅，接收到模块变化信号时刷新内存里的数据 */
export function listenHelModChange(platform: string) {
  subHelpackModChange(platform, (params) => {
    log({ subType: 'listenHelModChange', desc: 'trigger updateModInfo', data: { params, platform } });
    handleHelModChanged(platform, params.modName);
  });
}
