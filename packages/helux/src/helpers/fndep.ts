import { EXPIRE_MS, FN_KEY, NOT_MOUNT, PROTO_KEY, RENDER_START, SHARED_KEY } from '../consts';
import { injectHeluxProto } from '../helpers/obj';
import type { IUnmountInfo } from '../typing';
import { Dict, Fn, FnType, IFnCtx, ScopeType } from '../typing';
import { dedupList, isFn, nodupPush, safeMapGet } from '../utils';

const noop = () => {};

function buildApi(scopeType: ScopeType) {
  let cuFnKeySeed = 0;
  let currentRunningFnKey: any = null;
  const FNKEY_CTX_MAP = new Map<number, IFnCtx>();
  const VALKEY_FNKEYS_MAP = new Map<string, number[]>();
  const UNMOUNT_INFO_MAP = new Map<number, IUnmountInfo>();

  // @ts-ignore
  window[`${scopeType}_data`] = {
    FNKEY_CTX_MAP,
    UNMOUNT_INFO_MAP,
    VALKEY_FNKEYS_MAP,
  };

  const api = {
    markFnKey(fnOrObj: Dict, fnKey?: number) {
      let fnKeyVar = fnKey;
      if (!fnKeyVar) {
        cuFnKeySeed = cuFnKeySeed === Number.MAX_SAFE_INTEGER ? 1 : cuFnKeySeed + 1;
        fnKeyVar = cuFnKeySeed;
      }

      if (isFn(fnOrObj)) {
        // @ts-ignore
        fnOrObj[FN_KEY] = fnKeyVar;
      } else {
        fnOrObj.__proto__[FN_KEY] = fnKeyVar;
      }
      return fnKeyVar;
    },

    getFnKey(fnOrObj: Dict) {
      if (!fnOrObj) return 0;
      if (isFn(fnOrObj)) {
        // @ts-ignore
        return fnOrObj[FN_KEY];
      }
      // @ts-ignore
      return fnOrObj.__proto__[FN_KEY];
    },

    buildFnCtx(options?: { fn?: Fn; fnType?: FnType; fnKey?: number; updater?: any }): IFnCtx {
      const { fn = noop, fnKey = 0, fnType = 'watch', updater } = options || {};
      return {
        fn,
        fnKey,
        downstreamFnKeys: [],
        mountStatus: NOT_MOUNT,
        depKeys: [],
        result: {}, // works for type='computed', always ref to first time returned result by computed fn
        fnType,
        isResultReaded: false,
        isUpstreamResult: false,
        scopeType,
        renderStatus: RENDER_START,
        proxyResult: {},
        updater,
        createTime: Date.now(),
      };
    },

    mapFn(fn: Fn, fnType: FnType, fnCtxBase?: IFnCtx) {
      injectHeluxProto(fn);
      const fnKey = api.markFnKey(fn);
      currentRunningFnKey = fnKey;
      const params = { fn, fnType, fnKey };
      let fnCtx = api.buildFnCtx(params);
      if (fnCtxBase) {
        // 指向用户透传的 fnCtxBase
        fnCtx = Object.assign(fnCtxBase, params);
      }
      FNKEY_CTX_MAP.set(fnKey, fnCtx);

      return fnCtx;
    },

    delFn(fn: Fn) {
      const fnKey = api.getFnKey(fn);
      if (!fnKey) return;

      const fnCtx = FNKEY_CTX_MAP.get(fnKey);
      fnCtx && api.delFnCtx(fnCtx);
    },

    delFnCtx(fnCtx: IFnCtx) {
      const { depKeys, fnKey } = fnCtx;
      depKeys.forEach((key) => {
        const fnKeys = VALKEY_FNKEYS_MAP.get(key) || [];
        const idx = fnKeys.indexOf(fnKey);
        if (idx >= 0) {
          fnKeys.splice(idx, 1);
        }
      });
      FNKEY_CTX_MAP.delete(fnKey);
    },

    getFnCtx(fnKey: number) {
      return FNKEY_CTX_MAP.get(fnKey);
    },

    getFnCtxByObj(obj: Dict) {
      const fnKey = api.getFnKey(obj);
      return FNKEY_CTX_MAP.get(fnKey);
    },

    delRunninFnKey() {
      currentRunningFnKey = null;
    },

    getRunninFnCtx() {
      if (!currentRunningFnKey) {
        return null;
      }
      return api.getFnCtx(currentRunningFnKey);
    },

    /**
     * 自动记录当前正在运行的函数对 valKey 的依赖
     * 以及 valKey 对应的函数记录
     */
    recordFnDep(valKey: string | string[], specifiedCtx?: IFnCtx) {
      const fnCtx: IFnCtx | null | undefined = specifiedCtx || api.getRunninFnCtx();
      if (!fnCtx) {
        return;
      }
      const doRecord = (valKey: string) => {
        if ([SHARED_KEY, PROTO_KEY].includes(valKey)) {
          return;
        }
        nodupPush(fnCtx.depKeys, valKey);
        const fnKeys = safeMapGet(VALKEY_FNKEYS_MAP, valKey, []);
        nodupPush(fnKeys, fnCtx.fnKey);
      };

      if (Array.isArray(valKey)) {
        valKey.forEach(doRecord);
      } else {
        doRecord(valKey);
      }
    },

    recordValKeyDep(fnCtx: IFnCtx | undefined) {
      if (fnCtx) {
        fnCtx.depKeys.forEach((valKey: string) => api.recordFnDep(valKey, fnCtx));
      }
    },

    getDepFnKeys(valKey: string, needDedup = true) {
      const fnKeys = VALKEY_FNKEYS_MAP.get(valKey) || [];
      let finalFnKeys: number[] = [];
      let isConcat = false;

      fnKeys.forEach((fnKey) => {
        finalFnKeys.push(fnKey);
        const fnCtx = api.getFnCtx(fnKey);
        if (fnCtx) {
          const { downstreamFnKeys } = fnCtx;
          finalFnKeys = finalFnKeys.concat(downstreamFnKeys);
          isConcat = true;
        }
      });

      if (needDedup && isConcat) {
        finalFnKeys = dedupList(finalFnKeys);
      }

      return finalFnKeys;
    },

    runFn(fnKey: number) {
      const fnCtx = api.getFnCtx(fnKey);
      if (!fnCtx) return;

      const { scopeType, mountStatus, createTime } = fnCtx;
      if (scopeType === 'hook' && mountStatus === NOT_MOUNT && Date.now() - createTime > EXPIRE_MS) {
        return api.delFnCtx(fnCtx);
      }

      const result = fnCtx.fn({ isFirstCall: false });
      // 是计算函数，非中转结果
      if (fnCtx.fnType === 'computed' && !fnCtx.isUpstreamResult) {
        result && Object.assign(fnCtx.result, result);
      }

      // 实例读取了计算结果才执行更新
      if (fnCtx.isResultReaded) {
        fnCtx.updater?.();
      }
    },

    recoverDep(fnCtx: IFnCtx) {
      const { fnKey } = fnCtx;
      FNKEY_CTX_MAP.set(fnKey, fnCtx);

      let info = UNMOUNT_INFO_MAP.get(fnKey);
      if (info) {
        info.c = 2;
      } else {
        info = { c: 1, t: Date.now(), prev: 0 };
        UNMOUNT_INFO_MAP.set(fnKey, info);
      }

      const { c: mountCount } = info;
      if (mountCount === 2) {
        // 因为双调用导致第二次 mount，需把前一刻已触发了 unmount 行为导致的依赖丢失还原回来
        const fnCtx = api.getFnCtx(fnKey);
        fnCtx && api.recordValKeyDep(fnCtx);
      }
    },
  };

  return api;
}

// for static createComputed, createWatch
export const staticApi = buildApi('static');

// for hook's useComputed, useWatch
export const hookApi = buildApi('hook');

export function recordFnDep(valKey: string | string[]) {
  staticApi.recordFnDep(valKey);
  hookApi.recordFnDep(valKey);
}
