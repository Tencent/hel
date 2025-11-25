import type { HelModName, IMapModOptions, INodeModMapper, IStdNodeModMapper } from '../base/types';
export interface ICheckData {
    modVerDict: Record<HelModName, string>;
    modApiUrlDict: Record<HelModName, string>;
}
export declare function getModShape(nodeModName: string, options: IMapModOptions): {
    fnProps: Record<string, boolean>;
    dictProps: Record<string, boolean>;
    isShapeReady: boolean;
};
/**
 * 格式化 modMapper 为内部使用的标准对象，并做一些数据检查
 */
export declare function formatAndCheckModMapper(modMapper: INodeModMapper, checkData: ICheckData): IStdNodeModMapper;
