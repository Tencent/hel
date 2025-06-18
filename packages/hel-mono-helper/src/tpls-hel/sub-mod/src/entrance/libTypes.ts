/**
 * [hel-tip] 此文件由 mono-helper 脚本自动生成，无需修改
 */
import { exposeLib } from 'hel-lib-proxy';
import type { LibProperties } from './libProperties';
import { APP_NAME } from '../configs/subApp';

export const lib = exposeLib<LibProperties>(APP_NAME);

export const {
  // {{EXPORT_MODULES}}
} = lib;

export type Lib = LibProperties;

export default lib;

