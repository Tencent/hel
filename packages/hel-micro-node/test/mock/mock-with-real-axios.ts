/* eslint-disable @typescript-eslint/no-require-imports */
// 导入 qn-redis 打桩逻辑
import './setImmediate';

process.env.NO_HEL_INTERVAL = '1';

// jest.useFakeTimers();
// jest.setTimeout(30000);

// jest.doMock('axios', () => require('axios/dist/node/axios.cjs'));
jest.doMock('axios', () => require('./axios-mod'));
