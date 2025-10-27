export interface IEnvInfo {
  workerId: string;
  city: string;
  containerName: string;
  containerIP: string;
  podName: string;
  imgVersion: string;
  envName: string;
}

export interface IOnClientCloseParams {
  id: string;
  envInfo: IEnvInfo;
}

export interface IOnHelModsInitParams {
  helModNames: string[];
  envInfo: IEnvInfo;
}

export interface IInitOptions {
  port?: number;
  server?: any;
  /**
   * 客户端断开连接时触发
   */
  onClientClose?: (params: IOnClientCloseParams) => void;
  /**
   * 客户端连接时触发
   */
  onClientOpen?: xc.Fn;
  /**
   * 客户端初始化 hel 模块列表时触发
   */
  onHelModsInit?: xc.Fn;
}

export interface IClientSocket {
  readyState: number;
  send: (msg: any) => void;
}

export interface ClientInfo {
  /**
   * 客户端id, 由客户端生成并透传到服务端
   */
  id: string;
  envInfo: IEnvInfo;
  /**
   * 关心这些 hel 模块名变化
   */
  helModNames: string[];
  remoteAddress: string;
}
