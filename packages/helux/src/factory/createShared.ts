import type { Dict, ICreateOptionsType, SharedObject } from '../typing';
import { buildSharedObject } from './creator';

export function createSharedObject<T extends Dict = Dict>(rawState: T | (() => T), moduleName?: string): T {
  const [sharedState] = buildSharedObject(rawState, { moduleName, enableReactive: false });
  return sharedState;
}

export function createReactiveSharedObject<T extends Dict = Dict>(
  rawState: T | (() => T),
  moduleName?: string,
): [T, (partialState: Partial<T>) => void] {
  const [reactiveSharedState, reactiveSetState] = buildSharedObject(rawState, { moduleName, enableReactive: true });
  return [reactiveSharedState, reactiveSetState];
}

export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
} {
  const [state, setState] = buildSharedObject(rawState, strBoolOrCreateOptions);
  return {
    state,
    call: (srvFn, ...args) => {
      Promise.resolve(srvFn({ state, setState, args })).then((partialState) => {
        partialState && setState(partialState);
      });
    },
    setState,
  };
}
