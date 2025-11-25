/// <reference types="node" />
import { ICreateClientOptions, IInnerOptions } from './types';
export declare function getSafeNext(input: number): number;
export interface IClient {
    readyState: number;
    send: (msg: any) => void;
}
/**
 * 一个能保持自动重连的 ws 客户端
 * 网上有较多实现，但代码过于古老和复杂，不适合 sdk 需要精简、易维护的诉求，且 sdk 有一些定制化逻辑，故内部独立实现一个
 * https://gist.github.com/trevordixon/7239401
 * https://github.com/pladaria/reconnecting-websocket/blob/master/reconnecting-websocket.ts
 *
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
export declare class WSAutoReconnectClient {
    client: IClient;
    /** 是否还处于活跃状态 */
    isAlive: boolean;
    /** 心跳 timer */
    heartBeatTimer: NodeJS.Timeout | null;
    /** 已重连成功的次数 */
    reconnectSuccessCount: number;
    /** 已尝试重连的次数 */
    reconnectCount: number;
    reconnectLogicId: number;
    /** 初始的延迟多少毫秒后开始重连值 */
    reconnectDelayMs: number;
    /** 随后即将开始重连的 timer */
    reconnectTimer: any;
    httpPingTimer: any;
    httpPingReconnectCount: number;
    httpPingReconnectLogicId: number;
    isReconnectInsInitCalled: boolean;
    options: IInnerOptions;
    hasGetUrl: boolean;
    constructor(inputOptions: ICreateClientOptions);
    /**
     * 创建新的连接实例
     * @param isReconnect
     */
    private newClientIns;
    /**
     * 处理连接已打开事件
     */
    private handleOpen;
    /**
     * 处理接受到的消息
     */
    private handleMessage;
    /**
     * 处理连接失败
     */
    private handleConnectionFail;
    /**
     * 重试次数越多，稍后重连的时间越长，用旧的延迟时间加上增量得到新的延迟时间，
     * 每当满足 reconnectCount 是 RECONNECT_COUNT_DIVISOR 新的倍数时，就会触发 reconnectDelayMs 改变
     */
    private mayResetDelay;
    /**
     * 尝试稍后重连服务端
     */
    private mayReconnectLater;
    private mayInitReconnectByHttpPing;
    /**
     * 发送消息体
     */
    private sendMsg;
    /**
     * 开始发送心跳包
     */
    private startHeartBeat;
    /**
     * 停止发送心跳包
     */
    private stopHeartBeat;
}
