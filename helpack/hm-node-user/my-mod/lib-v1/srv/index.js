'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};

// src/export.ts
var export_exports = {};
__export(export_exports, {
  delay: () => delay,
  hello: () => hello,
  helloAsync: () => helloAsync,
});

// src/utils/path/to/async-hello.ts
function delay(ms = 1e3) {
  return new Promise((r) => setTimeout(r, ms));
}
async function helloAsync() {
  await delay();
  return 'async hel hello my 1.0.2';
}

// src/utils/index.ts
function hello() {
  return 'hel hello from local disk';
}

// src/index.ts
var index_default = export_exports;

exports.default = index_default;
exports.delay = delay;
exports.hello = hello;
exports.helloAsync = helloAsync;
//# sourceMappingURL=index.js.map
