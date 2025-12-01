import { SET_BY } from '../base/consts';
import { getGlobalConfig } from '../context/global-config';
import { isRunInJest } from '../test-util/jest-env';
import { mayUpdateModPresetData } from './execute';

let isIntervalUpdateCalled = false;

/** 在一些环境在长连接不可用时，允许用户开启定时器更新模块缓存 */
export function mayStartupIntervalModUpdate(platform: string) {
  const { intervalUpdateMs, enableIntervalUpdate } = getGlobalConfig();
  // jest 单测时为避免如下警告，也会不启动定时器
  // Async callback was not invoked within the 5000 ms timeout specified by jest.setTimeout.Timeout
  if (!enableIntervalUpdate || isIntervalUpdateCalled || isRunInJest()) {
    return;
  }

  isIntervalUpdateCalled = true;
  setInterval(() => {
    mayUpdateModPresetData(platform, SET_BY.timer).catch((err) => {
      const { reporter } = getGlobalConfig();
      reporter.reportError({ message: err.stack, desc: 'err-intervalUpdate', data: platform });
    });
  }, intervalUpdateMs);
}
