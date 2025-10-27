const sdk = require('./helpack-js-sdk');
const hdata = require('./helpack-data');
/**@typedef {import('hel-types').ISubApp} ISubApp */

const options = {
  classKey: 'test-sdk',
  classToken: 'xxx-y12y-g3ewo-xf$e#HTeeGHe',
  operator: 'fantasticsoul',
};

const demos = {
  async createSubApp() {
    /**@type {ISubApp} */
    const subApp = {
      name: 'helpack-js-sdk-test2',
      app_group_name: 'helpack-js-sdk-test2',
    };
    const ret = await sdk.createSubApp(subApp, options);
    console.log(ret);
  },
  async updateSubApp() {
    /**@type {ISubApp} */
    const subApp = {
      name: 'helpack-js-sdk-test2',
      desc: 'new desc',
    };
    const ret = await sdk.updateSubApp(subApp, options);
    console.log(ret);
  },
  async addVersion() {
    const ver = hdata.getVer();
    const ret = await sdk.addVersion(ver, options);
    console.log(ret);
  },
  async getSubApp() {
    const ret = await sdk.getSubApp('helpack-js-sdk-test2');
    console.log(ret);
  },
};

// demos.createSubApp();
// demos.updateSubApp();
// demos.addVersion();
demos.getSubApp();
