// 导入 qn-redis 打桩逻辑
import './mock-axios';
import './setImmediate';
// 暂通过这种方式直接复用 mock-node-rainbow-sdk 打桩逻辑
// 后续 TODO，直接在 qn-rainbow 里暴露出 RainbowSdkMock 类，就可写为:
// import { RainbowSdkMock} from '@tencent/qn-rinbow';
// 或者解决 exports 多出口导出是的编译问题，也可以写为：
// import { RainbowSdkMock} '@tencent/qn-rainbow/mock';
// 然后通过 jest.doMock 打桩即可
// jest.doMock('@tencent/rainbow-node-sdk', () => ({ Rainbow: RainbowSdkMock }));

process.env.NO_HEL_INTERVAL = '1';
// jest.useFakeTimers();
// jest.setTimeout(30000);

// 会报错 SyntaxError: Cannot use import statement outside a module
// import '@tencent/qn-rainbow/test/util/mock-node-rainbow-sdk';

/** *
 * // 以下两种配置方式，均不能导出 @tencent/qn-rainbow/mock
 * // 报错 Cannot find module '@tencent/qn-rainbow/mock' from 'test/util/mock.ts'
  "exports": {
    ".": {
      "default": "./cjs/index.js",
      "mock": "./test/util/mock-node-rainbow-sdk.tss"
    }
  },

  "exports": {
    ".": "./cjs/index.js",
    "./mock": {
      "default": "./test/util/mock-node-rainbow-sdk.ts"
    }
  },
 */
// import '@tencent/qn-rainbow/mock';
