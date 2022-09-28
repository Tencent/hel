const helDevUtils = require("hel-dev-utils");
const pkg = require("../package.json");

const subApp = helDevUtils.createLibSubApp(pkg, { npmCdnType: "unpkg" });
// const subApp = helDevUtils.createLibSubApp(pkg, { homePage: 'http://localhost:8080' });

module.exports = subApp;
