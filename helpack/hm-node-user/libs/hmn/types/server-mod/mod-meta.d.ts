import type { IFetchModMetaOptions, IMeta, IModInfo } from '../base/types';
export declare function fetchModMeta(helModName: string, options?: IFetchModMetaOptions | null): Promise<IMeta>;
export declare function fetchModInfo(helModName: string, options?: IFetchModMetaOptions | null): Promise<IModInfo>;
