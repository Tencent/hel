/**
 * jest 接管了 require，对接一下 doMock，同时会调用 getProxyFile 尝试生成一份代理文件，
 * 还原真实的 sdk 运行行为，
 */
export declare function maySetToJestMock(platform: string, helModNameOrPath: string, mod: any): void;
