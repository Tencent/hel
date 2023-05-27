import { createReactiveSharedObject, createShared, createSharedObject } from './factory/createShared';
import { ensureHeluxRoot } from './factory/root';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useShared, useSharedObject } from './hooks/useShared';

ensureHeluxRoot();

export { useObject, useService, useForceUpdate, useSharedObject, useShared, createShared, createSharedObject, createReactiveSharedObject };

const toExport = {
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useShared,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
};

export default toExport;
