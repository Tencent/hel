/**
 * 订阅来着 helpack 平台的变化消息
 */
export declare function subHelpackModChange(platform: string, changeCb: (params: {
    modName: string;
    type: string;
}) => void): Promise<void>;
