---
sidebar_position: 3
---

# Local 模式

## 说明

链接 Helpack 后端，但使用 Local 模式，可以快速体验版本切换功能，无需配置数据库和 Redis。

## 适用场景

- 需要连接 Helpack 后端服务
- 快速体验版本切换功能
- 本地开发环境

## 启动步骤

### 1. 配置后端连接

确保前端可以连接到后端服务（默认 `http://localhost:3001`）。

### 2. 启动后端（Local 模式）

```bash
cd server
npm install
npm run build
npm run start
```

后端会以 Local 模式启动，`IS_LOCAL_MODE=true` 时不会连接数据库和 Redis。

### 3. 启动用户端

```bash
cd hm-node-user
npm run build 
npm run start
```

用户端会在 `http://localhost:7776` 启动。、


### 4. 访问用户端界面

打开浏览器访问 `http://localhost:7776`，即可模拟用户的使用界面。

![](/img/user端截图.png)


### 5. 访问后端界面

打开浏览器访问 `http://localhost:7777`，即可进入helpack管理界面。

![](https://tnfe.gtimg.com/hel-img/WX20251027-120047.png)


### 6. 功能介绍
- 点击后端首页中探索更多可打开应用商店

![](/img/后端首页.png)

- 选择第一个 (@hel-demo/mono-libs) 应用

![](/img/选择app.png)

- 点击后选择查看版本选择

![](/img/查看版本.png)

- 再查看版本界面可以查看当前在线版本和所有已构建版本信息，可以看见目前在线版本为1.0.2

![](/img/切换版本.png)

- 可以在用户端进行验证

![](/img/验证.png)

![](/img/1.0.2.png)

- 点击一个不在线版本(示例为1.0.1)

![](/img/切换版本.png)

- 切换成功后再次用户端验证

![](/img/切换版本成功.png)
![](/img/验证.png)
![](/img/1.0.1.png)

- 可见helpack可以远程进行版本控制



## 功能特点

- 支持连接 Helpack 后端
- 支持版本切换功能
- 无需配置数据库和 Redis
- 适合本地开发和测试

## 技术细节

- 后端运行在 Local 模式（`IS_LOCAL_MODE=true`）
- `IS_SIMPLE_SERVER=0`，提供完整 API（但本地模式下不连接数据库）
- 不连接数据库和 Redis
- 支持版本切换等核心功能

