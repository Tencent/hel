// @ts-nocheck 模块自身的确是一个函数
import * as mod from 'clear-module';

export function clearModule(path: string) {
  const clearFn = mod.default || mod;
  clearFn(path);
}
