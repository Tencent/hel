---
sidebar_position: 3
---

# Helpack 的 Client 和 Server

Helpack 项目包含两个主要部分：Client（前端）和 Server（后端）。

## Client（前端）

前端工程基于 React + Concent 构建，提供 Web 管理界面。

### 目录结构

```
client/
├── config/          # CRA webpack相关配置
├── mock/            # mock api配置
├── public/          # webpack-dev-server 静态资源目录
├── scripts/         # npm 脚本
└── src/             # 项目源码
    ├── components/   # 组件
    ├── models/       # Concent 数据模型
    ├── pages/        # 页面组件
    ├── services/     # 服务层
    └── utils/        # 工具函数
```

### 安装依赖

```bash
cd client
npm install
```

### 启动开发服务器

```bash
npm start
```

前端会在 `http://localhost:3000` 启动。

## Server（后端）

后端工程基于 Node.js + Express + TypeScript 构建，提供 API 服务和模块托管能力。

### 目录结构

```
server/
├── build/           # 编译后的 JavaScript 文件
├── src/             # TypeScript 源码
│   ├── at/          # 应用核心代码
│   │   ├── configs/ # 配置文件
│   │   ├── core/    # 核心初始化逻辑
│   │   ├── models/  # 数据模型
│   │   └── utils/   # 工具函数
│   ├── controllers/ # 控制器
│   ├── services/    # 服务层
│   └── router.ts    # 路由配置
├── scripts/         # 构建脚本
├── public/          # 静态资源目录
└── db.sql           # 数据库初始化脚本
```

### 安装依赖

```bash
cd server
npm install
```

### 编译 TypeScript

```bash
npm run build
```

### 启动服务器

```bash
npm run start
```

后端会在 `http://localhost:7777` 启动。

