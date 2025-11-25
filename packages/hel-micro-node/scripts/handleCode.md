
// 还原 tsup 编译后的 _resolveFilename 逻辑
```ts
// before
var _module = require('module'); var Module = _interopRequireWildcard(_module);
var TSUPC = { Module };
var oriResolveFilename = TSUPC.Module._resolveFilename;
TSUPC.Module._resolveFilename = function(pkgName, parentModule, isMain, options) {

// after
// replace module ori _resolveFilename
var _module = require('module');
var oriResolveFilename = _module._resolveFilename;
_module._resolveFilename = function(pkgName, parentModule, isMain, options) {
```


