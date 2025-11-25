export declare const EWSEvent: {
    open: string;
    message: string;
    close: string;
    error: string;
};
export declare const DEFAULT_URL = "ws://localhost:8086";
/**
 * 没有任何消息发送的话，ws 客户端会在 60s 内断开连接，故这里设置 40s 的心跳检测时间
 */
export declare const HEART_BEAT_INTERVAL = 40000;
/**
 * 创建连接失败后，多少秒后再次重连的初始值
 */
export declare const RECONNECT_DELAY_MS = 10000;
/**
 * 创建连接失败后，增加到此值时固定使用此延迟时间
 */
export declare const RECONNECT_DELAY_MAX_MS: number;
/**
 * 创建连接失败后，基于 http ping 的轮询间隔时间
 */
export declare const RECONNECT_BY_HTTP_PING_INTERVAL_MS = 2000;
export declare const RECONNECT_BY_HTTP_PING_LIMIT_TIMES = 60;
/**
 * 达到一定的重连次数后，需要延长【多少秒后再连值】的增量
 */
export declare const RECONNECT_DELAY_DELTA_MS = 10000;
/**
 * 计算当前重连次数是几倍了的除数配置，暂定 5
 */
export declare const RECONNECT_COUNT_DIVISOR = 5;
export declare const HEART_BEAT_PING = "ping";
export declare const HEART_BEAT_PONG = "pong";
