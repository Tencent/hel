import type { IFnParams, IFnCtx } from '../typing';
import { isFn } from '../utils';
import { staticApi, hookApi } from '../helpers/fndep';

export function createWatchLogic(
  watchFn: (fnParams: IFnParams) => void,
  options: { scopeType: 'static' | 'hook', fnCtxBase?: IFnCtx },
) {
  const { scopeType, fnCtxBase } = options;
  const isStatic = scopeType === 'static';
  const api = isStatic ? staticApi : hookApi;

  if (!isFn(watchFn)) {
    throw new Error('ERR_NON_FN: pass an non-function to createWatch!');
  }

  const fnCtx = api.mapFn(watchFn, 'watch', fnCtxBase);
  watchFn({ isFirstCall: true });
  api.delRunninFnKey();

  return fnCtx;
}

export function createWatch(watchFn: (fnParams: IFnParams) => void) {
  createWatchLogic(watchFn, { scopeType: 'static' });
}
