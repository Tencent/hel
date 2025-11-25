export declare function extractFnAndDictProps(source: object): {
    fnProps: Record<any, boolean>;
    dictProps: Record<any, boolean>;
};
export declare function wait(ms?: number): Promise<unknown>;
export declare function loadJson<T extends any>(jsonFilePath: string, defaultVal: T): T;
export declare function safeUnlinkFile(filePath: string): void;
export declare function noSlash(str: string): string;
