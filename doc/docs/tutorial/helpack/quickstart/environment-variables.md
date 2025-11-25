---
sidebar_position: 4
---

# 后端启动文件配置

## package.json 脚本

在 `server/package.json` 中，有以下启动脚本：

```json
{
  "scripts": {
    "build": "cross-env node ./scripts/replaceToRelativePath.js && tsc -p ./tsconfigForBuild.json && node ./scripts/copy-views.js",
    "start": "cross-env IS_LOCAL_MODE=true IS_SIMPLE_SERVER=0 NODE_PATH=./build nodemon -e ts ./build/index.js",
    "start:simple": "cross-env IS_LOCAL_MODE=true NODE_PATH=./build nodemon -e ts ./build/index.js"
  }
}
```

## 环境变量说明

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `IS_LOCAL_MODE` | 是否本地模式，本地模式下不会连接数据库和 Redis | `true` |
| `IS_SIMPLE_SERVER` | 是否简单服务器模式，简单模式只提供基础 API | `1`（简单模式） |
| `NODE_PATH` | Node.js 模块搜索路径 | `./build` |

## 启动命令说明

### npm run build

编译 TypeScript 代码，生成 JavaScript 文件到 `build` 目录。

**注意：** 启动前必须先执行此命令。

### npm run start

默认启动本地模式服务器（无需数据库和 Redis）。

环境变量设置：
- `IS_LOCAL_MODE=true`：本地模式，不连接数据库和 Redis
- `IS_SIMPLE_SERVER=0`：完整模式，提供所有功能

### npm run start:simple

启动简单模式服务器（无需数据库和 Redis）。

环境变量设置：
- `IS_LOCAL_MODE=true`：本地模式
- `IS_SIMPLE_SERVER`：未设置，默认为简单模式

## 自定义环境变量

如果需要修改环境变量，可以在启动时设置：

```bash
# Windows
set IS_LOCAL_MODE=false
set IS_SIMPLE_SERVER=0
npm run start

# Linux/Mac
IS_LOCAL_MODE=false IS_SIMPLE_SERVER=0 npm run start
```

还可以创建 `.env.js` 文件（已加入 `.gitignore`）或者修改 `package.json` 进行本地配置。

