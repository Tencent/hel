import libProperties from './libProperties';
import { exposeLib } from 'hel-lib-proxy';
import { LIB_NAME } from '../configs/subApp';

type LibProperties = typeof libProperties;

export const lib = exposeLib<LibProperties>(LIB_NAME);

export type Lib = LibProperties;

export default lib;
