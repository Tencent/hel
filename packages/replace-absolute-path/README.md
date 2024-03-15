# replace-absolute-path

 - usage:
```js
const fs = require('fs');
const replacePath = require('replace-absolute-path');

(async function () {
  const srcDir = path.resolve(__dirname, '../src');
  const libDir = path.resolve(__dirname, '../lib');
  replacePath({
    inputDir: srcDir,
    outputDir: libDir,
    // includeExts: replacePath.DEFAULT_EXTS.concat(['.md']),
    afterReplaced: () => {
      console.log('--------------------------------------------------------------------------');
      console.log('|  all files import statements has been transformed to relative path ^_^  |');
      console.log('--------------------------------------------------------------------------');
    },
  });
})()
```

now your file import statements changed
```js
// if current file position is /src/components/Editor/index.js
// config file position is /src/config.js

import xx from 'configs/xx'; 
// change to
import xx from '../../configs/xx';

export { default as xx } from 'configs/xx'; 
// change to
export { default as xx } from '../../configs/xx';

import {
  xx
} from 'configs/xx';
// change to
import {
  xx
} from '../../configs/xx';
```

