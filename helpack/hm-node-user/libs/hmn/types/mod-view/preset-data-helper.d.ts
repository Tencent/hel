import { type ILogOptions } from '../base/mem-logger';
import type { IModInfo } from '../base/types';
export declare function log(options: Omit<ILogOptions, 'type'>): void;
export declare function hasServerModFile(modInfo: IModInfo): boolean;
export declare function checkServerModFile(modInfo: IModInfo, options: {
    mustBeServerMod?: boolean;
    label: string;
}): boolean;
