---
sidebar_position: 5
---

# VSCode 配置

为了方便调试，可以在 VSCode 中配置 `launch.json`。

## 配置文件位置

在项目根目录创建 `.vscode/launch.json` 文件。

## 配置内容

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "hp-quick-admin",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server/build/index.js",
      "env": {
        "IS_LOCAL_MODE": "true",
        "IS_SIMPLE_SERVER": "0"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "hm-node-user",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/hm-node-user/build/index.js"
    }
  ]
}
```

## 使用方式

1. 在 VSCode 中按 `F5` 启动调试
2. 选择需要进行调试的对象默认对象为后端(hp-quick-admin)以及用户端(hm-node-user)
3. 设置断点进行调试

## 调试配置说明

- 默认对编译后的对象进行调试，如修改ts文件后则需要重新编译文件
- 可以自行修改配置文件以支持对源码进行调试

