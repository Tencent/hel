---
sidebar_position: 2
---

# Simple 模式

## 说明

这是最简单的模式，无需配置数据库和 Redis，通过前端 API 实现版本快速切换。

## 适用场景

- 快速体验 Helpack 功能
- 本地开发和测试
- 演示和演示环境

## 启动步骤

### 1. 启动后端（Simple 模式）

```bash
cd server
npm install
npm run build
npm run start:simple
```

后端将以 Simple 模式启动，只提供基础 API 功能，无需数据库和 Redis。

### 2. 启动用户端

```bash
cd hm-node-user
npm run build 
npm run start
```

用户端会在 `http://localhost:7776` 启动。、


### 3. 访问用户端界面

打开浏览器访问 `http://localhost:7776`，即可模拟用户的使用界面。

![](/img/user端截图.png)

### 4.用户端功能介绍
- 测试hello函数api [`http://localhost:7776/api/hello`](http://localhost:7776/api/hello)
- 更新 hello 函数版本api [`http://localhost:7776/api/changeVer/:ver`](http://localhost:7776/api/changeVer/:1.0.1) (点击后可以切换到1.0.1版本)

![](/img/hello和切换.gif)

- 查看当前hel最新的版本号 [`http://localhost:7776/api/getModVer`](http://localhost:7776/api/getModVer)

![](/img/功能3.png)

- 查看当前hel模块描述 [`http://localhost:7776/api/getModDesc`](http://localhost:7776/api/getModDesc)

![](/img/功能4.png)

- 查看当前hel激活模块路径信息 [`http://localhost:7776/api/resolveMod`](http://localhost:7776/api/resolveMod)

![](/img/功能5.png)

- 本地虚拟模块演示

![](/img/虚拟模块总览.png)

- 查看虚拟模块 hel-hello-helpack 返回结果 [`http://localhost:7776/api/showVirtualNodeModule`](http://localhost:7776/api/showVirtualNodeModule)

![](/img/查看hhh结果.png)
![](/img/hhh结果.png)

- 更新虚拟模块 hel-hello-helpack 版本号

![](/img/更新虚拟版本.png)
![](/img/虚拟结果1.png)
![](/img/虚拟结果2.png)

- 查看本地虚拟模块 my-mod 返回结果 [`http://localhost:7776/api/showMyMod`](http://localhost:7776/api/showMyMod)

![](/img/查看虚拟结果.png)
![](/img/查看结果.png)

- 更新查看本地虚拟模块 my-mod 版本，变查看返回结果 [`http://localhost:7776/api/changeVirtualLocalModToV2`](http://localhost:7776/api/changeVirtualLocalModToV2)

![](/img/更新并查看虚拟结果.png)
![](/img/更新并查看结果.png)


## 技术细节

- 后端运行在 Simple 模式（`IS_SIMPLE_SERVER` 未设置或为 `1`）
- 不连接数据库和 Redis
- 仅提供基础的模块版本查询 API

