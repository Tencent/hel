import { VER, GLOBAL_REF, IS_SERVER } from '../consts';
import { getInternal, getInternalMap, getSharedKey } from '../helpers/feature';
import type { Dict } from '../typing';

function createRoot() {
  const root = {
    VER,
    rootState: {} as Dict,
    setState: (moduleName: string, partialState: Dict) => {
      const modData = root.help.mod[moduleName];
      if (!modData) {
        throw new Error(`moduleName ${moduleName} not found`);
      }
      modData.setState(partialState);
    },
    help: {
      mod: {} as Dict, // 与模块相关的辅助信息
      internalMap: getInternalMap(),
    },
  };
  return root;
}

function getHeluxRoot(): ReturnType<typeof createRoot> {
  // @ts-ignore
  return GLOBAL_REF.__HELUX__;
}

export function ensureHeluxRoot() {
  // @ts-ignore
  if (!GLOBAL_REF.__HELUX__) {
    // @ts-ignore
    GLOBAL_REF.__HELUX__ = createRoot();
  }
}

export function record(moduleName: string, sharedState: Dict) {
  if (IS_SERVER) {
    return;
  }

  const { rootState, help } = getHeluxRoot();
  const treeKey = moduleName || getSharedKey(sharedState);
  if (rootState[treeKey] && !GLOBAL_REF.location.port) {
    return console.error(`moduleName ${moduleName} duplicate!`);
  }
  // may hot replace for dev mode or add new mod
  rootState[treeKey] = sharedState;
  help.mod[treeKey] = { setState: getInternal(sharedState).setState };
}
