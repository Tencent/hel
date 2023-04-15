import { createReactiveSharedObject, createShared, createSharedObject } from './helpers/createSharedObject';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useSharedObject } from './hooks/useSharedObject';

export { useObject, useService, useForceUpdate, useSharedObject, createSharedObject, createReactiveSharedObject, createShared };

const toExport = {
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  createSharedObject,
  createReactiveSharedObject,
  createShared,
};

export default toExport;
