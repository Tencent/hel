---
sidebar_position: 4
---

# Hmn User

## 简介

`hm-node-user` 是一个基于 hel-micro-node 的用户端示例项目
- 演示如何通过 hel-micro-node 自行加载和使用远程模块。
- 演示如何通过 helpack 远程加载和使用远程模块。

## 目录结构

```
hm-node-user/
├── build/           # 编译后的文件
├── src/             # TypeScript 源码
│   ├── libs/        # hel-micro-node 相关库
│   └── controllers/ # 控制器
└── my-mod/          # 本地模块示例
```

## 用途

- 演示 hel-micro-node 的使用方式
- 作为模块消费者的示例
- 用于测试和调试模块加载

## 运行

```bash
cd hm-node-user
npm install
npm run build
npm run start
```
用户端会在 `http://localhost:7776` 启动。

并发现如下界面

![](/img/user端截图.png)
