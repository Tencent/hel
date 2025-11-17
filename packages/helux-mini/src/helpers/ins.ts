import { IS_SERVER, RENDER_END } from '../consts';
import { isSymbol, prefixValKey } from '../utils/index';
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
  const proxyedState = IS_SERVER
    ? state
    : createOb(
        state,
        // setter
        (target: any, key: any, val: any) => {
          // @ts-ignore
          target[key] = val;
          if (enableReactive) {
            internal.setState({ [key]: val });
          }
          return true;
        },
        // getter
        (target: any, key: any) => {
          if (isSymbol(key)) {
            return target[key];
          }
          const depKey = prefixValKey(key, internal.sharedKey);

          insCtx.readMap[depKey] = 1;
          if (insCtx.renderStatus !== RENDER_END) {
            internal.recordDep(depKey, insCtx.insKey);
          }
          return target[key];
        },
      );
  const updater = IS_SERVER ? setState : internal.setState;
  insCtx.updater = updater;
  insCtx.sharedState = proxyedState;
  return { updater, proxyedState };
}
