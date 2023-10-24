const helDevUtils = require('hel-dev-utils');
const pkg = require('../package.json');

const subApp = helDevUtils.createReactSubApp(pkg, { npmCdnType: 'unpkg' });

// 自定义 homePage，形如：https://youhost.com/aa/bb、 /aa/bb、../aa/bb
// const subApp = helDevUtils.createReactSubApp(pkg, { npmCdnType: 'unpkg', homePage: './xx' });

// 自定义 homePage，不拼接名字和版本号
// const subApp = helDevUtils.createReactSubApp(pkg, { npmCdnType: 'unpkg', homePage: './xx', handleHomePage: false });

module.exports = subApp;
