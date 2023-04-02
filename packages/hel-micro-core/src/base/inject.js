import { purify } from './commonUtil';

function injectPlat(platform, injectOptions) {
  const { fn, fnName, arg1PlatObjFnKeys } = injectOptions;
  const handleArg1 = arg1PlatObjFnKeys.includes(fnName);

  return (...args) => {
    const mergePlatObj = (obj) => ({ platform, ...purify(obj || {}) });
    const [arg1, arg2] = args;
    if (handleArg1) {
      args[0] = mergePlatObj(arg1);
    } else {
      args[1] = mergePlatObj(arg2);
    }
    // @ts-ignore
    return fn.apply(this, args);
  };
}

export function inectPlatToMod(platform, mod, options) {
  const { ignoreKeys = [], arg1PlatObjFnKeys = [] } = options || {};
  const newObj = {};
  Object.keys(mod).forEach((mayFnName) => {
    const mayFn = mod[mayFnName];
    if (ignoreKeys.includes(mayFnName)) {
      newObj[mayFnName] = mayFn;
      return;
    }

    const valueType = typeof mayFn;
    if (valueType && valueType === 'object') {
      newObj[mayFnName] = inectPlatToMod(platform, mayFn, options);
      return;
    }

    if (valueType === 'function') {
      newObj[mayFnName] = injectPlat(platform, {
        arg1PlatObjFnKeys,
        fn: mayFn,
        fnName: mayFnName,
      });
      return;
    }

    newObj[mayFnName] = mayFn;
  });

  return newObj;
}
