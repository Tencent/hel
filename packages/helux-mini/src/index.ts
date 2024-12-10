import { createReactiveSharedObject, createShared, createSharedObject } from './factory/createShared';
import { ensureHeluxRoot } from './factory/root';
import * as advance from './helpers/advance';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useShared, useSharedObject } from './hooks/useShared';

ensureHeluxRoot();

export {
  advance,
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useShared,
  useEffect,
  useLayoutEffect,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
};

const toExport = {
  advance,
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useShared,
  useEffect,
  useLayoutEffect,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
};

export default toExport;
