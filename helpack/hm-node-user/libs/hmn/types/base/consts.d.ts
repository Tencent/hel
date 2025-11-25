export declare const PLATFORM = "unpkg";
export declare const PLATFORM_HEL = "hel";
export declare const HEL_API_URL = "https://unpkg.com";
export declare const HELPACK_API_URL = "https://helmicro.com/openapi/meta";
export declare const SDK_NAME = "@tencent/hmn-proto";
/** 应用自身数据变化 */
export declare const CHANNEL_APP_INFO_CHANGED = "appInfoChanged";
/** 应用版本数据变化 */
export declare const CHANNEL_APP_VERSION_CHANGED = "appVersionChanged";
/**
 * hel-micro-node 所在的的 node_modules 的位置
 */
export declare const SDK_PKG_ROOT: string;
/** hel 基础包 cdn 地址，用户在 initMiddleware 时可覆盖此值 */
export declare const HEL_SDK_SRC = "https://tnfe.gtimg.com/hel-runtime/level1/hel-base-v28.js";
export declare const SERVER_INFO: {
    containerName: string;
    workerId: string | number;
    env: string;
};
/** 内部维护的环境变量，可能会被 init-middleware 时调用 setCtxEnv 重写部分用户自定义值 */
export declare const CTX_ENV: {
    isProd: boolean;
};
export declare function setCtxEnv(options: Partial<typeof CTX_ENV>): void;
export declare const CODE: {
    success: number;
};
export declare const AS_TRUE = "1";
export declare const AS_FALSE = "0";
export declare const HOOK_TYPE: {
    readonly onInitialHelMetaFetched: "onInitialHelMetaFetched";
    readonly onHelModLoaded: "onHelModLoaded";
    readonly onMessageReceived: "onMessageReceived";
};
