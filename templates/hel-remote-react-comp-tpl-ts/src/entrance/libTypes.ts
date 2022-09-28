import { LIB_NAME } from 'configs/subApp';
import { exposeLib } from 'hel-lib-proxy';
import type { LibProperties } from './libProperties';

export const lib = exposeLib<LibProperties>(LIB_NAME);

export type Lib = LibProperties;

export default lib;
