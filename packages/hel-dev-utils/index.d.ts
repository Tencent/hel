/**
 * hel-dev-utils@5.4.3
 */
import { IMeta } from 'hel-types';
import type { IUserExtractOptions } from 'hel-dev-utils-base';

export type {
  ICheckOptions,
  ICreateSubAppOptions,
  ISubAppBuildDesc,
  IUserExtractOptions,
} from 'hel-dev-utils-base';
export {
  cst,
  baseUtils,
  check,
  createReactSubApp,
  createVue2SubApp,
  createVue3SubApp,
  createVueSubApp,
  createLibSubApp,
} from 'hel-dev-utils-base';

/**
 * 提取 hel-meta.json 元数据，形如：
 * https://app.unpkg.com/@hel-demo/lib1@0.2.1/files/hel_dist/hel-meta.json
 */
export declare function extractHelMetaJson(options: IUserExtractOptions): IMeta;
