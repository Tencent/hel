import { createReactiveSharedObject, createShared, createSharedObject, createKeyedShared } from './factory/createShared';
import { ensureHeluxRoot } from './factory/root';
import * as advance from './helpers/advance';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useShared, useSharedObject } from './hooks/useShared';
import { useKeyedShared } from './hooks/useKeyedShared';

ensureHeluxRoot();

export {
  advance,
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useShared,
  useKeyedShared,
  useEffect,
  useLayoutEffect,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
  createKeyedShared,
};

const toExport = {
  advance,
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useShared,
  useKeyedShared,
  useEffect,
  useLayoutEffect,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
  createKeyedShared,
};

export default toExport;
