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
  // TODO: downgrade to defineProperty
  const proxyedState = new Proxy(state, {
    get(target, key) {
      insCtx.keyMap[key] = 1;
      internal.recordDep(key, insCtx.insKey);
      return target[key];
    },
    set(target, key, val) {
      // @ts-ignore
      target[key] = val;
      if (enableReactive) {
        internal.setState({ [key]: val });
      }
      return true;
    },
  });
  const updater = internal.setState;
  insCtx.reactiveUpdater = updater;
  insCtx.sharedState = proxyedState;
  return { updater, proxyedState };
}
