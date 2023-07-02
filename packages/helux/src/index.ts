import './factory/root';
import { createReactiveSharedObject, createShared, createSharedObject } from './factory/createShared';
import { createComputed } from './factory/createComputed';
import { createWatch } from './factory/createWatch';
import * as advance from './helpers/advance';
import { useEffect, useLayoutEffect } from './hooks/useEffect';
import { useForceUpdate } from './hooks/useForceUpdate';
import { useObject } from './hooks/useObject';
import { useService } from './hooks/useService';
import { useShared, useSharedObject } from './hooks/useShared';
import { useComputed } from './hooks/useComputed';
import { useWatch } from './hooks/useWatch';

export {
  advance,
  useShared,
  useComputed,
  useWatch,
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useEffect,
  useLayoutEffect,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
  createComputed,
  createWatch,
};

const toExport = {
  advance,
  useShared,
  useComputed,
  useWatch,
  useObject,
  useService,
  useForceUpdate,
  useSharedObject,
  useEffect,
  useLayoutEffect,
  createShared,
  createSharedObject,
  createReactiveSharedObject,
  createComputed,
  createWatch,
};

export default toExport;
