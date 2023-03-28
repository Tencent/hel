# hel-iso

当 `hel-micro`、`hel-micro-core` 包体被提升到 exnternal 里载入时，`isSubApp`判断会失效，可独立安装此包来调用 `isSubApp` 函数

## bofore

```ts
import { isSubApp } from 'hel-micro';
// or
import { isSubApp } from 'hel-lib-proxy';
```

## after

```ts
import { isSubApp } from 'hel-iso';
// or just import in entry file first line
import 'hel-iso';

// then you can call isSubApp that can return right result in any other files
```
