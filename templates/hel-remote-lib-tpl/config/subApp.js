const helDevUtils = require('hel-dev-utils');
const pkg = require('../package.json');

const subApp = helDevUtils.createLibSubApp(pkg, { npmCdnType: 'unpkg' });

module.exports = subApp;
