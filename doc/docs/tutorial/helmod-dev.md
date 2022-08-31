---
sidebar_position: 2
---

# 模块开发-js库
目标：
- 学会基于模块模板项目快发开发一个新的hel模块

可以被别的项目动态引用，也可应用其他动态模块作为自己的依赖

- 学会将现有项目改造为hel模块

以便实现在Hel Pack平台做版本管理、灰度发布控制、秒级回滚、向其他项目提供远程组件等功能


## 开发远程库

### 克隆模板库

克隆远程库模板为`my-xxx-lib`（名字请按实际需要修改，此处仅做示例）
```bash
git clone https://github.com/hel-eco/hel-remote-lib-tpl my-xxx-lib
```

### 改package.json

将`name`和`appGroupName`改为hel模块组名
```
  "name": "my-xx-lib",
  "appGroupName": "my-xx-lib",
```

### 改subApp

`src/configs/subApp.ts`改为你hel模块组名，以便让hel流水线构建时能够校验通过
```ts
export const LIB_NAME = 'my-xx-lib';
```

### 开发业务代码

在`utils`目录下新增任意模块，或导入已有的第三方npm模块（即是将npm模块提升为hel动态模块），并在`utils/index.ts`里导出即可

- 执行单测

已内置`jest`，执行`npm run test`即可

- 发布类型与源码

此步骤可选，仅当需要给模块使用方提供类型文件时才需要

仅发布类型，执行
```bash
npm run build_proxy
tnpm publish
```

在hel流水线构建动态模块后，使用方即可按照使用，更多细节请阅读[快速开始](/docs/tutorial/intro)
```js
import xxLib from 'my-xx-lib';
```

此步骤可选，仅发布用于辅助给模块使用方`jest`通过动态模块的桩模块时才需要

仅发布模块cjs产物，执行
```bash
npm run build_bundle
tnpm publish
```

该步骤是可选的，仅是为了方便模块使用方的项目执行单测时，可以通过npm的cjs模块来做函数打桩
```ts
import entry from 'my-xx-lib/hel_bundle/entry';

jest.doMock('my-xx-lib', () => {
  return entry['my-xx-lib'];
});
```

发布源码和类型
```
npm run build
npm publish
```
