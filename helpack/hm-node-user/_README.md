
```bash

node ./build/index.js

# 源码修改位置（已打包为一个单文件）
node_modules/@tencent/hmn-proto/lib/index.js
```

每次复制到 libs/hmn/impl.js 位置后，需要在 140 行添加下面语句，并修改 148 行 SDK_NAME 引用
```ts
// add for local debug
const sdkPath = require('path').join(__dirname, './impl.js');

// SDK_NAME 指向 sdkPath
SDK_NAME = sdkPath;
```
