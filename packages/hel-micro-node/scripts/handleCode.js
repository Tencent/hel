const os = require('os');
const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');

const indexFile = path.join(__dirname, '../dist/index.js');
const content = fs.readFileSync(indexFile).toString();
const list = content.split(os.EOL);
const newContent = [];

let keyIndex = 0;
const sdkName = pkg.name;

const willReplace = {
  1: "var _module = require('module');",
  2: 'var oriResolveFilename = _module._resolveFilename;',
  3: '_module._resolveFilename = function(pkgName, parentModule, isMain, options) {',
};

const isForHMNUser = process.env.HMN_USER === '1';

list.forEach((line, idx) => {
  let newLine = line;
  if (line.includes("var _module = require('module')")) {
    newLine = '// replace module ori _resolveFilename';
    keyIndex = idx;
  } else if (keyIndex && idx - keyIndex <= 3) {
    const diff = idx - keyIndex;
    newLine = willReplace[diff];
  }
  newContent.push(newLine);
});

const newCode = newContent.join(os.EOL);
fs.writeFileSync(indexFile, newCode);
console.log('handle compiled code done');

if (isForHMNUser) {
  const hmnIdexJs = path.join(__dirname, '../../../helpack/hm-node-user/node_modules/hel-micro-node/dist/index.js');
  if (fs.existsSync(hmnIdexJs)) {
    fs.writeFileSync(hmnIdexJs, newCode);
    console.log('copy code to hm-node-user done');
  }
}
