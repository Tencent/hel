import type { Dict, SharedObject } from '../typing';
import { buildSharedObject } from './creator';

export function createSharedObject<T extends Dict = Dict>(rawState: T | (() => T)): T {
  const [sharedState] = buildSharedObject(rawState, false);
  return sharedState;
}

export function createReactiveSharedObject<T extends Dict = Dict>(rawState: T | (() => T)): [T, (partialState: Partial<T>) => void] {
  const [reactiveSharedState, reactiveSetState] = buildSharedObject(rawState, true);
  return [reactiveSharedState, reactiveSetState];
}

export function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  enableReactive?: boolean,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
} {
  const [state, setState] = buildSharedObject(rawState, enableReactive);
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
