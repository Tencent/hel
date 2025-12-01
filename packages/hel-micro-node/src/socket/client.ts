import { v7 } from '@helbase/uuid';
import { WebSocket } from 'ws';
import { purify } from '../base/util';
import {
  DEFAULT_URL,
  EWSEvent,
  HEART_BEAT_INTERVAL,
  HEART_BEAT_PING,
  HEART_BEAT_PONG,
  RECONNECT_BY_HTTP_PING_INTERVAL_MS,
  RECONNECT_BY_HTTP_PING_LIMIT_TIMES,
  RECONNECT_COUNT_DIVISOR,
  RECONNECT_DELAY_DELTA_MS,
  RECONNECT_DELAY_MAX_MS,
  RECONNECT_DELAY_MS,
} from './consts';
import { ICreateClientOptions, IInnerOptions } from './types';
import { toDataJson, toDataStr } from './util';

export function getSafeNext(input: number) {
  const num = input === Number.MAX_SAFE_INTEGER ? 1 : input + 1;
  return num;
}

export interface IClient {
  readyState: number;
  send: (msg: any) => void;
}

/**
 * 一个能保持自动重连的 ws 客户端
 * 网上有较多实现，但代码过于古老和复杂，
 * https://gist.github.com/trevordixon/7239401
 * https://github.com/pladaria/reconnecting-websocket/blob/master/reconnecting-websocket.ts
 *
 * 不适合 sdk 需要精简、易维护的诉求，且 sdk 有一些定制化逻辑，故内部独立实现一个
 * @example
 * ```
 *  new WSAutoReconnectClient({
 *    url: 'ws://your_host',
 *    onConnected() {
 *       return { tip: 'your data' };
 *    },
 *    onMessage(data) {
 *      console.log('receive data', data);
 *    },
 *  });
 * ```
 */
export class WSAutoReconnectClient {
  // @ts-ignore 调用时一定是已初始化的对象
  public client: IClient;

  /** 是否还处于活跃状态 */
  public isAlive = false;

  /** 心跳 timer */
  public heartBeatTimer: NodeJS.Timeout | null = null;

  /** 已重连成功的次数 */
  public reconnectSuccessCount = 0;

  /** 已尝试重连的次数 */
  public reconnectCount = 0;

  public reconnectLogicId = getSafeNext(0);

  /** 初始的延迟多少毫秒后开始重连值 */
  public reconnectDelayMs = RECONNECT_DELAY_MS;

  /** 随后即将开始重连的 timer */
  public reconnectTimer: any = null;

  public httpPingTimer: any = null;

  public httpPingReconnectCount = 0;

  public httpPingReconnectLogicId = 0;

  public isReconnectInsInitCalled = false;

  public options: IInnerOptions = {
    id: v7(),
    url: '',
    onConnected: () => '',
    onMessage: () => {},
    getUrlWhenReconnect: () => Promise.resolve(''),
  };

  public hasGetUrl = false;

  constructor(inputOptions: ICreateClientOptions) {
    if (!inputOptions.url) {
      throw new Error('missing url param');
    }

    const id = inputOptions.id || v7();
    const options = purify<ICreateClientOptions>({ ...inputOptions, id });
    if (typeof options.getUrlWhenReconnect === 'function') {
      this.hasGetUrl = true;
    }
    Object.assign(this.options, options);
    this.tryNewClientIns();
  }

  /**
   * 创建新的连接实例
   * @param isReconnect
   */
  private tryNewClientIns(isReconnect?: boolean) {
    const { url = DEFAULT_URL } = this.options;
    try {
      if (!isReconnect) {
        return this.initInsAndListenEvent(url, isReconnect);
      }

      if (this.isReconnectInsInitCalled) {
        return;
      }

      const connectByUrl = (url) => {
        // 此处做2次判断
        if (this.isReconnectInsInitCalled) {
          return;
        }
        this.isReconnectInsInitCalled = true;
        this.initInsAndListenEvent(url, isReconnect);
      };

      // 未配置 getUrlWhenReconnect 时就复用旧 url 去重建连接
      if (!this.hasGetUrl) {
        return connectByUrl(url);
      }

      this.options
        .getUrlWhenReconnect()
        .then((newUrl) => connectByUrl(newUrl))
        .catch((err: any) => {
          this.handleConnectionFail(err);
        });
    } catch (err: any) {
      this.handleConnectionFail(err);
    }
  }

  private initInsAndListenEvent(url: string, isReconnect?: boolean) {
    const client = new WebSocket(url);
    this.client = client;

    client.on(EWSEvent.open, () => {
      if (isReconnect) {
        this.reconnectSuccessCount += 1;
        // 自增 reconnectLogicId，给下一次 mayInitReconnectByHttpPing 判断之用
        this.reconnectLogicId = getSafeNext(this.reconnectLogicId);

        // 可能来着 httpPing 的重连，这里把 reconnectTimer 撤销掉
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
        }
      }
      this.isAlive = true;
      this.startHeartBeat();
      this.handleOpen();
    });

    client.on(EWSEvent.message, (data) => {
      this.handleMessage(data.toString());
    });

    client.on(EWSEvent.close, () => {
      this.handleConnectionFail(new Error('Server closed'));
    });

    // err may be:
    // Unexpected server response: 502
    client.on(EWSEvent.error, (err: any) => {
      this.handleConnectionFail(err);
    });
  }

  /**
   * 处理连接已打开事件
   */
  private handleOpen() {
    const data = this.options.onConnected();
    this.sendMsg({ id: this.options.id, data });
  }

  /**
   * 处理接受到的消息
   */
  private handleMessage(dataStr: string) {
    if (dataStr === HEART_BEAT_PONG) {
      // 是心跳的回包，不做任何处理
      return;
    }
    // 交给用户处理的消息对象
    const data = toDataJson(dataStr);
    this.options.onMessage(data);
  }

  /**
   * 处理连接失败
   */
  private handleConnectionFail(err: Error) {
    // TODO report err
    console.log(err);
    this.isAlive = false;
    this.stopHeartBeat();
    this.mayReconnectLater();
  }

  /**
   * 重试次数越多，稍后重连的时间越长，用旧的延迟时间加上增量得到新的延迟时间，
   * 每当满足 reconnectCount 是 RECONNECT_COUNT_DIVISOR 新的倍数时，就会触发 reconnectDelayMs 改变
   */
  private mayResetDelay() {
    if (this.reconnectDelayMs === RECONNECT_DELAY_MAX_MS) {
      return;
    }
    const timesValue = Math.floor(this.reconnectCount / RECONNECT_COUNT_DIVISOR);
    this.reconnectDelayMs = this.reconnectDelayMs + timesValue * RECONNECT_DELAY_DELTA_MS;
    if (this.reconnectDelayMs >= RECONNECT_DELAY_MAX_MS) {
      this.reconnectDelayMs = RECONNECT_DELAY_MAX_MS;
    }
  }

  /**
   * 尝试稍后重连服务端
   */
  private mayReconnectLater() {
    if (this.reconnectTimer) {
      // 已经要开始重连了，忽略本次调用
      return;
    }

    this.isReconnectInsInitCalled = false;
    this.mayResetDelay();
    // 创建新的连接实例失败，连接过程中服务器挂掉，发送消息过程中服务异常等原因则稍后重连
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectCount += 1;
      this.tryNewClientIns(true);
    }, this.reconnectDelayMs);

    this.mayInitReconnectByHttpPing();
  }

  /**
   * ping 成功时重建连接
   */
  private mayInitReconnectByHttpPing() {
    const { httpPingWhenTryReconnect } = this.options;
    if (!httpPingWhenTryReconnect || this.httpPingTimer || this.httpPingReconnectLogicId === this.reconnectLogicId) {
      return;
    }

    const timer = setInterval(() => {
      const clearup = () => {
        // 确保同一个 logicId，不会再次触发 ReconnectByHttpPing 逻辑
        this.httpPingReconnectLogicId = this.reconnectLogicId;
        this.httpPingReconnectCount = 0;
        clearInterval(timer);
        this.httpPingTimer = null;
      };

      if (this.httpPingReconnectCount >= RECONNECT_BY_HTTP_PING_LIMIT_TIMES) {
        return clearup();
      }

      this.httpPingReconnectCount += 1;
      httpPingWhenTryReconnect()
        .then((isPingSuccess) => {
          if (isPingSuccess) {
            clearup();
            this.tryNewClientIns(true);
          }
        })
        .catch(console.error);
    }, RECONNECT_BY_HTTP_PING_INTERVAL_MS);
    this.httpPingTimer = timer;
  }

  /**
   * 发送消息体
   */
  private sendMsg(msg: string | object) {
    try {
      this.client.send(toDataStr(msg));
    } catch (err: any) {
      this.mayReconnectLater();
    }
  }

  /**
   * 开始发送心跳包
   */
  private startHeartBeat() {
    this.heartBeatTimer = setInterval(() => {
      if (this.isAlive) {
        this.sendMsg(HEART_BEAT_PING);
      }
    }, HEART_BEAT_INTERVAL);
  }

  /**
   * 停止发送心跳包
   */
  private stopHeartBeat() {
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer);
    }
  }
}
