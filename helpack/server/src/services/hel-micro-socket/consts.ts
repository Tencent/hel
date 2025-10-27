export const MSG_TYPE = {
  initHelMods: 'initHelMods',
  addHelMods: 'addHelMods',
};

export const WS_EVENT = {
  connection: 'connection',
  message: 'message',
  close: 'close',
};

export const DEFAULT_URL = 'ws://localhost:8086';

/**
 * 没有任何消息发送的话，ws 客户端会在 60s 内断开连接，故这里设置 40s 的心跳检测时间
 */
export const HEART_BEAT_INTERVAL = 40000;

export const HEART_BEAT_PING = 'ping';

export const HEART_BEAT_PONG = 'pong';
