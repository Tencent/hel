import { noopAny } from '@tmicro/f-noop';
import { getServerEnv, isServerStarted } from 'at/utils/deploy';
import { noDupPush, purify, safeParse } from 'at/utils/obj';
import { WebSocketServer } from 'ws';
import { HEART_BEAT_PING, HEART_BEAT_PONG, MSG_TYPE, WS_EVENT } from './consts';
import type { ClientInfo, IClientSocket, IInitOptions } from './types';
import { isClientValid, newEnvInfo, toDataStr } from './util';

class SdkSocketServer {
  public clientMap = new Map<IClientSocket, ClientInfo>();

  public wsServer;

  /**
   * 连接关闭时需触发的上层定制逻辑
   */
  public onClientClosed = noopAny;

  /**
   * 连接打开时需触发的上层定制逻辑
   */
  public onClientOpen = noopAny;

  /**
   * 客户端初始化 hel 模块列表时触发的上层定制逻辑
   */
  public onHelModsInit = noopAny;

  constructor(options?: IInitOptions) {
    this.initServerIns(options);
  }

  /** 通知 hel-micro-node 某个 hel 模块元数据有变化 */
  public notifySDKMetaChanged(modName: string, data: object) {
    const { containerName, workerID } = getServerEnv();
    const targetList: { socket: IClientSocket; info: ClientInfo }[] = [];
    // 仅通知关心此模块变化的客户端
    this.clientMap.forEach((info, socket) => {
      if (info.helModNames.includes(modName)) {
        targetList.push({ info, socket });
      }
    });

    targetList.forEach(({ info, socket }) => {
      if (isClientValid(socket)) {
        const { id, remoteAddress } = info;
        this.sendMsgObj(socket, { id, remoteAddress, containerName, workerID, data });
      }
    });
  }

  private initServerIns(options?: IInitOptions) {
    const optionsVar = options || {};
    const { port = 8366, onClientClose, onClientOpen, onHelModsInit } = optionsVar;
    this.onClientClosed = onClientClose || noopAny;
    this.onClientOpen = onClientOpen || noopAny;
    this.onHelModsInit = onHelModsInit || noopAny;

    let wsServer;
    if (optionsVar.server) {
      wsServer = new WebSocketServer({ server: optionsVar.server });
    } else {
      wsServer = new WebSocketServer({ port });
    }
    this.wsServer = wsServer;

    // 有新的客户端连接时触发此回调
    wsServer.on(WS_EVENT.connection, (socket, req) => {
      if (isClientValid(socket)) {
        this.onClientOpen();
        this.saveWSClient(socket, req);
      }
      // 收到客户端消息
      socket.on(WS_EVENT.message, (message) => {
        const msgStr = message.toString();
        this.handleMsg(socket, msgStr);
      });
      // 客户端已断开连接
      socket.on(WS_EVENT.close, () => {
        this.handleClose(socket);
      });
    });
  }

  private handleClose(socket: IClientSocket) {
    const clientInfo = this.clientMap.get(socket);
    const id = clientInfo?.id || '';
    this.onClientClosed({ envInfo: clientInfo?.envInfo || newEnvInfo(), id });
    console.log(`客户端 ${id} 已断开连接`);
    this.clientMap.delete(socket);
  }

  private handleMsg(socket: IClientSocket, msgStr: string) {
    try {
      console.log('server 收到消息:', msgStr);
      if (HEART_BEAT_PING === msgStr) {
        this.sendMsgStr(socket, HEART_BEAT_PONG);
        return;
      }

      this.updateWSClientSocketInfo(socket, msgStr);
    } catch (err) {
      console.log('处理收到消息出错:', err);
    }
  }

  private sendMsgStr(socket: IClientSocket, msg: string) {
    socket.send(msg);
  }

  private sendMsgObj(socket: IClientSocket, msg: object) {
    socket.send(toDataStr(msg));
  }

  private saveWSClient(client: IClientSocket, req: any) {
    const { remoteAddress } = req.socket;
    const initialInfo: ClientInfo = { id: '', helModNames: [], remoteAddress, envInfo: newEnvInfo() };
    this.clientMap.set(client, initialInfo);
  }

  private updateWSClientSocketInfo(client: IClientSocket, message: string) {
    const defaultEnvInfo = newEnvInfo();
    const fallbackData = { msgType: '', helModNames: [], careAllModsChange: false, envInfo: defaultEnvInfo };
    const msgObj = safeParse(message, { id: '', data: fallbackData });
    const { id, data } = msgObj;
    const info = this.clientMap.get(client);
    if (!info) {
      return;
    }

    const { msgType, helModNames = [], envInfo = defaultEnvInfo } = data || {};
    if (!MSG_TYPE[msgType]) {
      return;
    }

    if (MSG_TYPE.initHelMods === msgType) {
      Object.assign(info, purify({ id, helModNames, envInfo }));
      this.onHelModsInit({ helModNames, envInfo });
      return;
    }

    if (MSG_TYPE.addHelMods === msgType) {
      helModNames.forEach((name) => noDupPush(info.helModNames, name));
      return;
    }
  }
}

let sdkSocketServer: SdkSocketServer;

export function initSocketServer(options?: IInitOptions) {
  sdkSocketServer = new SdkSocketServer(options);
}

export function notifySDKMetaChanged(modName: string, data: object) {
  if (isServerStarted() && !sdkSocketServer) {
    throw new Error('forget to init sdk socket server');
  }

  sdkSocketServer.notifySDKMetaChanged(modName, data);
}
