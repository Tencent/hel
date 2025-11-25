interface ILog {
    /** 日志类型 */
    type: string;
    /** 日志描述 */
    desc: string;
    /** 日志子类型 */
    subType: string;
    /** 对应数据 */
    data: any;
    /** 冗余记录的扩展字段1 */
    f1: string;
    /** 冗余记录的扩展字段2 */
    f2: string;
    /** 日志时间 */
    time: string;
}
export interface ILogOptions extends Partial<Omit<ILog, 'type'>> {
    /** 日志类型 */
    type: string;
}
export declare function recordLog(options: ILogOptions): void;
export declare function rawLog(...args: any): void;
export declare function getLogs(options?: {
    type?: string;
    subType?: string;
}): ILog[];
export {};
