import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useSharedObject } from './hooks/useSharedObject';
import { createSharedObject, createReactiveSharedObject } from './helpers/createSharedObject';

export { useObject, useService, useForceUpdate, useSharedObject, createSharedObject, createReactiveSharedObject };

const toExport = {
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  createSharedObject,
  createReactiveSharedObject,
};

export default toExport;
