/** @typedef {import('hel-types').ISubApp} ISubApp */
// const sdk = require('helpack-js-sdk');
const sdk = require('../src/index'); // 其他地方使用应是上面的写法
const hdata = require('../data/ver');

const options = {
  classKey: 'your-class-key', // 新增应用里可以新增分类
  classToken: 'your-class-token', // 可在helpack分类管理处查看
  operator: 'fancyzhong',
};
const overwriteClassToken = 'write your token here';

const demos = {
  async createSubApp() {
    /** @type {ISubApp} */
    const subApp = {
      name: 'helpack-js-sdk-test2',
      app_group_name: 'helpack-js-sdk-test2',
    };
    const ret = await sdk.createSubApp(subApp, options);
    console.log(ret);
  },
  async updateSubApp() {
    /** @type {ISubApp} */
    const subApp = {
      name: 'helpack-js-sdk-test2',
      desc: 'new desc',
    };
    const ret = await sdk.updateSubApp(subApp, options);
    console.log(ret);
  },
  async addVersion() {
    const ver = hdata.getVer({
      ver: 'helpack-js-sdk-test2_123456',
    });
    const ret = await sdk.addVersion(ver, options);
    console.log(ret);
  },
  async getSubApp() {
    const ret = await sdk.getSubApp('helpack-js-sdk-test2');
    console.log(ret);
  },
  async addVersionAndBackupAssets() {
    // const ver = hdata.getVer({
    //   name: 'helpack-js-sdk-test2',
    //   ver: 'helpack-js-sdk-test2_20230418200730',
    // });
    const ver = hdata.getOtherCdnVer({
      name: 'helpack-js-sdk-test2',
      ver: 'helpack-js-sdk-test2_20230418200832',
    });
    const ret = await sdk.addVersionAndBackupAssets(ver, {
      ...options,
      // host: 'you helpack host',
      onProcess(data) {
        console.log(data);
      },
    });
    console.log(ret);
  },
  async testWeData() {
    const ver = hdata.getWeDataVer();
    const ret = await sdk.addVersionAndBackupAssets(ver, {
      ...options,
      classKey: 'wedata',
      classToken: overwriteClassToken,
      operator: 'wingpan',
      platform: 'hel',
      // host: 'you helpack host',
      onProcess(data) {
        console.log(data);
      },
    });
    console.log(ret);
  },
  async getVersionList() {
    const list = await sdk.getVersionList('wedata-manage-tcs', {
      ...options,
      classToken: overwriteClassToken,
      operator: 'wingpan',
      platform: 'hel',
    });
    console.log(list);
  },
};

// demos.createSubApp();
// demos.updateSubApp();
// demos.addVersion();
// demos.getSubApp();
// demos.addVersionAndBackupAssets();
// demos.testWeData();
demos.getVersionList();
