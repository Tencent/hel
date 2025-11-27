import { CHANNEL_APP_INFO_CHANGED, CHANNEL_APP_VERSION_CHANGED, HOOK_TYPE } from '../base/consts';
import { SOCKET_MSG_TYPE } from '../base/mod-consts';
import { getSdkCtx } from '../context';
import { getCaredModNames } from '../context/facade';
import { triggerHook } from '../context/hooks';
import { getGlobalConfig } from '../context/global-config';
import { WSAutoReconnectClient } from '../socket/client';
import { isRunInJest } from '../test-util/jest-env';

interface IMsg {
  id: string;
  data: { modName: string; channel: string };
}

/** 长连接订阅变化逻辑是否已执行 */
const isSocketSubCalledMap: Record<string, boolean> = {};

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
    getGlobalConfig().reporter.reportError({ message: msg, desc, platform });
  }
}
