import { useRef, useEffect } from 'react';
import { useObject } from './useObject';
import { getInternal, getRawState } from '../helpers/createSharedObject';
import { Dict } from '../typing';

let insKey = 0;

export function useSharedObject<T extends Dict = Dict>(sharedObject: T, enableReactive?: boolean): [
  T,
  (partialState: Partial<T>) => void,
] {
  const [state, setState] = useObject(getRawState(sharedObject), true);
  const insCtxRef = useRef({
    keyMap: {} as any,
    compreKeyMap: {} as any,
    prevKeyMap: {} as any,
    insKey: 0,
    sharedState: state,
    reactiveUpdater: null as unknown as (partialState: Partial<T>) => void,
  });
  let sharedState = insCtxRef.current.sharedState;
  let reactiveUpdater = insCtxRef.current.reactiveUpdater;
  const internal = getInternal(sharedObject);

  if (!internal) {
    throw new Error(`input sharedObject is not a result returned by createSharedObj!`);
  }

  const keyMap = insCtxRef.current.keyMap;
  insCtxRef.current.prevKeyMap = keyMap;
  insCtxRef.current.keyMap = {}; // reset dep map

  if (!reactiveUpdater) {
    insKey += 1;
    insCtxRef.current.insKey = insKey;
    internal.mapInsKeyUpdater(insKey, setState);
    // TODO: downgrade to defineProperty
    sharedState = new Proxy(state, {
      get(target, key) {
        insCtxRef.current.keyMap[key] = 1;
        internal.recordDep(key, insCtxRef.current.insKey);
        return target[key];
      },
      set(target, key, val) {
        // @ts-ignore
        target[key] = val;
        if (enableReactive) {
          internal.setState({ [key]: val });
        }
        return true;
      }
    });
    reactiveUpdater = internal.setState;
    insCtxRef.current.reactiveUpdater = reactiveUpdater;
    insCtxRef.current.sharedState = sharedState;
  }

  // start re compute dep in every render period
  useEffect(() => {
    const { keyMap, prevKeyMap } = insCtxRef.current;
    Object.keys(prevKeyMap).forEach(prevKey => {
      if (!keyMap[prevKey]) { // lost dep
        internal.delDep(prevKey, insCtxRef.current.insKey);
      }
    });
  });

  useEffect(() => {
    return () => {
      // del dep before unmount
      const { keyMap, insKey } = insCtxRef.current;
      Object.keys(keyMap).forEach(key => {
        internal.delDep(key, insKey);
      });
    };
  }, []);

  return [sharedState, reactiveUpdater];
}
