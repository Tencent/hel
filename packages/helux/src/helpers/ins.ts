import { createOb } from './obj';

let insKeySeed = 0;
function getInsKey() {
  insKeySeed = insKeySeed === Number.MAX_SAFE_INTEGER ? 1 : insKeySeed + 1;
  return insKeySeed;
}

export function buildInsCtx(insCtx: any, options: any) {
  const { internal, setState, state, enableReactive } = options;
  const insKey = getInsKey();
  insCtx.insKey = insKey;
  internal.mapInsKeyUpdater(insKey, setState);
  const proxyedState = createOb(
    state,
    (target, key, val) => {
      // setter
      // @ts-ignore
      target[key] = val;
      if (enableReactive) {
        internal.setState({ [key]: val });
      }
      return true;
    },
    (target, key) => {
      // getter
      insCtx.readMap[key] = 1;
      internal.recordDep(key, insCtx.insKey);
      return target[key];
    },
  );
  const updater = internal.setState;
  insCtx.updater = updater;
  insCtx.sharedState = proxyedState;
  return { updater, proxyedState };
}
