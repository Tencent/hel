export interface IInnerOptionsBase {
  id: string;
  /**
   * 连接成功后，向服务器发送的消息
   */
  onConnected: () => string | object;
  /**
   * 处理服务器发送过来的消息
   */
  onMessage: (data: any) => void;
  /**
   * 当出现重连时，尝试获取新的连接 ws url，如未设置此函数，会复用 options.url
   * 通常存在名字服务时需设置此函数，通过名字服务获取新的连接 ws url，因为旧的机器可能已经销毁，
   * 此时 options.url 将永远也连接不上
   */
  getUrlWhenReconnect: () => Promise<string>;
  httpPingWhenTryReconnect?: () => Promise<boolean>;
}

/**
 * 'ws://localhost:8086'
 * 'ws://your-helpack-ip-or-host'
 */
export type Url = string;

export interface IInnerOptions extends IInnerOptionsBase {
  url: Url;
}

export interface ICreateClientOptions extends Partial<IInnerOptionsBase> {
  url: Url;
}

export interface ICreateOptions {
  port?: number;
  server?: any;
}

export interface IClient {
  readyState: number;
  send: (msg: any) => void;
  sendJson: (msg: object) => void;
}

export interface ClientInfo {
  id: string;
  containerName: string;
  worderID: string;
  /**
   * 关心这些 hel 模块名变化
   */
  helModNames: string[];
  remoteAddress: string;
}
