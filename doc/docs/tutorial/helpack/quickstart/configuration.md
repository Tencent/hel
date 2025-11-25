---
sidebar_position: 2
---

# 用户端连接配置

## Helpack 链接

Helpack 的用户端（hm-node-user）和后端（Server）需要配合使用：

1. **用户端默认配置**：用户端服务器默认会代理到 `http://localhost:7777`（后端服务地址）
2. **后端端口**：后端服务默认运行在 `7777` 端口（可通过环境变量配置）

## 用户端代理设置
如需要更改后端端口可在`hm-node-user\src\libs\hmnWrap.ts`文件中可以进行自行配置
```json
const HELPACK_PROTOCOLED_HOST = 'http://localhost:7777';
const HELPACK_WS_HOST = 'ws://localhost:7777';
const REPORT_API_URL = `${HELPACK_PROTOCOLED_HOST}/openapi/v1/hmn/reportHelModStat`;
```


## 基本配置流程

1. 确保前端和后端都已安装依赖
2. 先启动后端服务
3. 再启动用户端服务
4. 访问用户端界面进行配置和管理

